import { useEffect, useState } from 'react';
import StaffLayout from '../components/StaffLayout';
import QuizBuilderModal from '../components/QuizBuilderModal';
import QuizDetailsModal from '../components/QuizDetailsModal';
import AddCourseVideoModal from '../components/AddCourseVideoModal';
import { adminAPI } from '../services/api';
import '../App.css';

function StaffCourses() {
  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showQuizBuilderModal, setShowQuizBuilderModal] = useState(false);
  const [localCourses, setLocalCourses] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetailsOpen, setQuizDetailsOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [questionEditIdx, setQuestionEditIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // DB-backed Course Videos (courses_vedio)
  const [courseVideos, setCourseVideos] = useState([]);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState('');
  const [showCvModal, setShowCvModal] = useState(false);
  const [showCvEditModal, setShowCvEditModal] = useState(false);
  const [cvEditTargetId, setCvEditTargetId] = useState(null);
  const [cvEditInitial, setCvEditInitial] = useState(null);

  // DB-backed Quizzes (quizes / quiz_content)
  const [quizzesDb, setQuizzesDb] = useState([]);
  const [qzLoading, setQzLoading] = useState(false);
  const [qzError, setQzError] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getCourses();
      setCourses(data || []);
      setLocalCourses(data || []);
    } catch (e) {
      setCourses([]);
      setLocalCourses([]);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const openEditCourseVideo = (v) => {
    setCvEditTargetId(v.id);
    setCvEditInitial({ title: v.course_vedio_title, url: v.vedio_url, description: v.description });
    setShowCvEditModal(true);
  };

  const handleUpdateCourseVideoDb = async ({ title, url, description }) => {
    const t = (title || '').trim();
    const u = (url || '').trim();
    const d = description || '';
    if (!t || !u || !cvEditTargetId) {
      alert('Please fill Course Video Title and Video URL');
      return false;
    }
    try {
      const res = await adminAPI.updateCourseVideo(cvEditTargetId, {
        course_vedio_title: t,
        vedio_url: u,
        description: d,
      });
      const updated = res?.video;
      if (updated) {
        setCourseVideos((prev) => prev.map(v => v.id === cvEditTargetId ? updated : v));
        return true;
      } else {
        alert('Unexpected response while updating video');
        return false;
      }
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to update video';
      alert(msg);
      return false;
    }
  };

  const deleteCourseVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await adminAPI.deleteCourseVideo(id);
      setCourseVideos((prev) => prev.filter(v => v.id !== id));
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to delete video';
      alert(msg);
    }
  };

  const handleAddCourseVideoDb = async ({ title, url, description }) => {
    if (!selectedCourse) return false;
    const t = (title || '').trim();
    const u = (url || '').trim();
    const d = description || '';
    if (!t || !u) {
      alert('Please fill Course Video Title and Video URL');
      return false;
    }
    try {
      const res = await adminAPI.addCourseVideo({
        course_vedio_title: t,
        vedio_url: u,
        description: d,
        course_title: selectedCourse.name,
      });
      if (res && res.video) {
        setCourseVideos((prev) => [...prev, res.video]);
        return true;
      } else {
        alert('Unexpected response while adding video');
        return false;
      }
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to add video';
      alert(msg);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchCourses();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchDbVideos = async () => {
      if (!selectedCourse) return;
      setCvLoading(true);
      setCvError('');
      try {
        const vids = await adminAPI.getCourseVideos(selectedCourse.name);
        setCourseVideos(Array.isArray(vids) ? vids : []);
      } catch (e) {
        setCourseVideos([]);
        setCvError('Failed to load course videos');
      } finally {
        setCvLoading(false);
      }
    };
    fetchDbVideos();
  }, [selectedCourse]);

  // Fetch quizzes for selected course from backend
  useEffect(() => {
    const fetchDbQuizzes = async () => {
      if (!selectedCourse) return;
      setQzLoading(true);
      setQzError('');
      try {
        const data = await adminAPI.getQuizzesByCourse(selectedCourse.id);
        const mapped = Array.isArray(data) ? data.map(q => ({
          id: q.qid,
          title: q.quiz_title,
          createdAt: q.created_at,
          questions: (q.questions || []).map(qq => ({
            questionId: qq.question_id,
            questionText: qq.question,
            optionA: qq.option_a,
            optionB: qq.option_b,
            optionC: qq.option_c,
            optionD: qq.option_d,
            correctAnswer: qq.correct_answer,
          })),
        })) : [];
        setQuizzesDb(mapped);
      } catch (e) {
        setQuizzesDb([]);
        setQzError('Failed to load quizzes');
      } finally {
        setQzLoading(false);
      }
    };
    fetchDbQuizzes();
  }, [selectedCourse]);

  // Add Video
  const handleAddVideo = (videoData) => {
    if (!selectedCourse) return;
    const newVideo = {
      id: Date.now(),
      ...videoData
    };
    setLocalCourses(localCourses.map(c => 
      c.id === selectedCourse.id 
        ? { ...c, videos: [...c.videos, newVideo] }
        : c
    ));
    setSelectedCourse({ ...selectedCourse, videos: [...selectedCourse.videos, newVideo] });
    setShowAddVideoModal(false);
    console.log('Video added to course:', selectedCourse.id);
  };

  // Delete Video
  const handleDeleteVideo = (videoId) => {
    if (!selectedCourse) return;
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    setLocalCourses(localCourses.map(c => 
      c.id === selectedCourse.id 
        ? { ...c, videos: c.videos.filter(v => v.id !== videoId) }
        : c
    ));
    setSelectedCourse({ 
      ...selectedCourse, 
      videos: selectedCourse.videos.filter(v => v.id !== videoId) 
    });
    console.log('Video deleted:', videoId);
  };

  // Add/Edit Quiz (from quiz builder)
  const handleAddQuizBuilder = async (quizData, mode = 'add') => {
    if (!selectedCourse) return;

    const toBackendQuestions = (arr) => (arr || []).map(q => ({
      question: q.questionText,
      option_a: q.optionA,
      option_b: q.optionB,
      option_c: q.optionC,
      option_d: q.optionD,
      correct_answer: q.correctAnswer,
      question_id: q.questionId,
    }));

    try {
      if (mode === 'edit' && editingQuiz) {
        const originalIds = new Set((editingQuiz.questions || []).map(q => q.questionId).filter(Boolean));
        const newIds = new Set((quizData.questions || []).map(q => q.questionId).filter(Boolean));
        const deletedIds = Array.from(originalIds).filter(id => !newIds.has(id));

        await adminAPI.updateQuiz(editingQuiz.id, {
          quiz_title: quizData.title,
          questions: toBackendQuestions(quizData.questions),
          deleted_question_ids: deletedIds,
        });
      } else {
        await adminAPI.createQuiz({
          cid: selectedCourse.id,
          quiz_title: quizData.title,
          questions: toBackendQuestions(quizData.questions),
        });
      }

      // Refresh quizzes list
      const fresh = await adminAPI.getQuizzesByCourse(selectedCourse.id);
      const mapped = Array.isArray(fresh) ? fresh.map(q => ({
        id: q.qid,
        title: q.quiz_title,
        createdAt: q.created_at,
        questions: (q.questions || []).map(qq => ({
          questionId: qq.question_id,
          questionText: qq.question,
          optionA: qq.option_a,
          optionB: qq.option_b,
          optionC: qq.option_c,
          optionD: qq.option_d,
          correctAnswer: qq.correct_answer,
        })),
      })) : [];
      setQuizzesDb(mapped);
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to save quiz';
      alert(msg);
    }

    setShowQuizBuilderModal(false);
    setEditingQuiz(null);
  };

  // Open Edit Quiz Modal
  const openEditQuizModal = (quiz) => {
    setEditingQuiz(quiz);
    setShowQuizBuilderModal(true);
  };

  // Delete Quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!selectedCourse) return;
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await adminAPI.deleteQuiz(quizId);
      setQuizzesDb(prev => prev.filter(q => q.id !== quizId));
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to delete quiz';
      alert(msg);
    }
  };

  if (selectedCourse) {
    return (
      <StaffLayout activeMenuItem="courses">
        <div className="course-details-page">
          <div className="course-header">
            <button className="btn btn-secondary" onClick={() => setSelectedCourse(null)}>
              ← Back to Courses
            </button>
            <h1 className="page-header">{selectedCourse.name}</h1>
            <div className="course-summary">
              <span className="badge">📹 {selectedCourse.videos.length} Videos</span>
              <span className="badge">📝 {selectedCourse.quizzes.length} Quizzes</span>
            </div>
          </div>

          {/* Course Videos (DB) Section */}
          <div className="content-section">
            <div className="section-header">
              <h2>🎞️ Course Videos</h2>
              <button className="btn btn-success" onClick={() => setShowCvModal(true)}>➕ Add Video</button>
            </div>
            {cvLoading && <p>Loading videos...</p>}
            {!!cvError && <p className="error-text">{cvError}</p>}
            <div className="table-responsive table-card">
              <table className="table video-table">
                <thead>
                  <tr>
                    <th>Course Video Title</th>
                    <th>Video URL</th>
                    <th>Description</th>
                    <th style={{width:'140px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courseVideos.map((v) => (
                    <tr key={v.id}>
                      <td>{v.course_vedio_title}</td>
                      <td><a href={v.vedio_url} target="_blank" rel="noreferrer">{v.vedio_url}</a></td>
                      <td>{v.description}</td>
                      <td>
                        <div className="video-actions">
                          <button className="btn btn-secondary btn-small" onClick={()=>openEditCourseVideo(v)}>✏️ Edit</button>
                          <button className="btn btn-danger btn-small" onClick={()=>deleteCourseVideo(v.id)}>❌ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {courseVideos.length === 0 && !cvLoading && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center' }}>No videos yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          

          {/* Quizzes Section */}
          <div className="content-section">
            <div className="section-header">
              <h2>📝 Quizzes</h2>
              <button className="btn btn-success" onClick={() => { setEditingQuiz(null); setShowQuizBuilderModal(true); }}>➕ Add Quiz</button>
            </div>
            {qzLoading && <p>Loading quizzes...</p>}
            {!!qzError && <p className="error-text">{qzError}</p>}
            <div className="items-list">
              {quizzesDb.length === 0 && !qzLoading ? (
                <p className="empty-state">No quizzes yet. Add one to get started!</p>
              ) : (
                quizzesDb.map((quiz) => (
                  <div key={quiz.id} className="item-card">
                    <div className="item-info">
                      <h3>{quiz.title}</h3>
                      <div>
                        <p><strong>Questions:</strong> {quiz.questions?.length || 0}</p>
                        {quiz.createdAt && <p className="created-at">Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn btn-secondary btn-small" onClick={() => { setSelectedQuiz(quiz); setQuizDetailsOpen(true); }}>📋 View Questions</button>
                      <button className="btn btn-secondary btn-small" onClick={() => openEditQuizModal(quiz)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDeleteQuiz(quiz.id)}>❌ Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <QuizBuilderModal
          isOpen={showQuizBuilderModal}
          onClose={() => { setShowQuizBuilderModal(false); setEditingQuiz(null); setQuestionEditIdx(null); }}
          onSave={handleAddQuizBuilder}
          courseName={selectedCourse.name}
          editQuiz={editingQuiz}
          editQuestionIdx={questionEditIdx}
        />
        <QuizDetailsModal
          isOpen={quizDetailsOpen && !!selectedQuiz}
          onClose={() => { setQuizDetailsOpen(false); setSelectedQuiz(null); setQuestionEditIdx(null); }}
          quiz={selectedQuiz}
          onEditQuiz={() => { setQuizDetailsOpen(false); setEditingQuiz(selectedCourse); setShowQuizBuilderModal(true); setQuestionEditIdx(null); }}
          onEditQuestion={(qIdx) => { setQuizDetailsOpen(false); setEditingQuiz({ ...selectedQuiz, _editQuestionIdx: qIdx }); setShowQuizBuilderModal(true); setQuestionEditIdx(qIdx); }}
        />
        <AddCourseVideoModal
          isOpen={showCvModal}
          onClose={() => setShowCvModal(false)}
          onSave={handleAddCourseVideoDb}
          courseTitle={selectedCourse.name}
        />
        {showCvEditModal && (
          <AddCourseVideoModal
            isOpen={showCvEditModal}
            onClose={() => setShowCvEditModal(false)}
            onSave={async (payload)=>{ const ok = await handleUpdateCourseVideoDb(payload); if (ok) setShowCvEditModal(false); return ok; }}
            courseTitle={selectedCourse.name}
            mode="edit"
            initial={cvEditInitial}
          />
        )}
      </StaffLayout>
    );
  }

  // Main Courses Grid View
  return (
    <StaffLayout activeMenuItem="courses">
      <div className="courses-page">
        <div className="courses-header">
          <h1 className="page-header">Courses</h1>
          <button className="btn btn-secondary" onClick={fetchCourses}>⟳ Refresh</button>
        </div>

        {loading && <p>Loading courses...</p>}
        {!!error && <p className="error-text">{error}</p>}

        <div className="courses-grid">
          {localCourses.map(course => (
            <div key={course.id} className="course-card" onClick={() => setSelectedCourse(course)}>
              <div className="course-icon">📚</div>
              <div className="course-info">
                <h3>{course.name}</h3>
                <div className="course-stats">
                  <span className="stat-badge">📹 {course.videos.length} Videos</span>
                  <span className="stat-badge">📝 {course.quizzes.length} Quizzes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaffLayout>
  );
}

export default StaffCourses;