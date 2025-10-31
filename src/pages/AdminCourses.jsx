import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { adminAPI } from "../services/api";
import AddCourseVideoModal from "../components/AddCourseVideoModal";
import AddVideoModal from "../components/AddVideoModal";
import QuizBuilderModal from "../components/QuizBuilderModal";
import AddCourseModal from "../components/AddCourseModal";
import QuizDetailsModal from "../components/QuizDetailsModal";
import "../App.css";

function AdminCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await adminAPI.getCourses();
        if (isMounted) setCourses(data);
      } catch (e) {
        setCourses([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

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
      }
      alert('Unexpected response while updating video');
      return false;
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

  // Add Course Video (DB-backed)
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
      }
      alert('Unexpected response while adding video');
      return false;
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to add video';
      alert(msg);
      return false;
    }
  };

  const refreshCourses = async () => {
    try {
      const data = await adminAPI.getCourses();
      setCourses(data || []);
    } catch (e) {
      setCourses([]);
      alert('Failed to load courses');
    }
  };

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showQuizBuilderModal, setShowQuizBuilderModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetailsOpen, setQuizDetailsOpen] = useState(false);
  const [questionEditIdx, setQuestionEditIdx] = useState(null);

  // DB-backed Quizzes (quizes / quiz_content) state
  const [quizzesDb, setQuizzesDb] = useState([]);
  const [qzLoading, setQzLoading] = useState(false);
  const [qzError, setQzError] = useState("");

  // DB-backed Course Videos (courses_vedio) state
  const [courseVideos, setCourseVideos] = useState([]);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState("");
  const [showCvModal, setShowCvModal] = useState(false);
  const [showCvEditModal, setShowCvEditModal] = useState(false);
  const [cvEditTargetId, setCvEditTargetId] = useState(null);
  const [cvEditInitial, setCvEditInitial] = useState(null);

  useEffect(() => {
    const fetchDbVideos = async () => {
      if (!selectedCourse) return;
      setCvLoading(true);
      setCvError("");
      try {
        const vids = await adminAPI.getCourseVideos(selectedCourse.name);
        setCourseVideos(Array.isArray(vids) ? vids : []);
      } catch (e) {
        setCourseVideos([]);
        setCvError("Failed to load course videos");
      } finally {
        setCvLoading(false);
      }
    };
    fetchDbVideos();
  }, [selectedCourse]);

  // Load quizzes for selected course from backend
  useEffect(() => {
    const fetchDbQuizzes = async () => {
      if (!selectedCourse) return;
      setQzLoading(true);
      setQzError("");
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
          }))
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

  // Add Course
  const handleAddCourse = async (courseName) => {
    const title = (courseName || '').trim();
    if (!title) {
      alert('Please enter a valid course name');
      return;
    }
    try {
      const res = await adminAPI.addCourse({ course_title: title });
      if (res && res.course) {
        setCourses((prev) => [...prev, res.course]);
        setShowAddCourseModal(false);
        alert('Course added successfully');
      } else {
        alert('Unexpected response from server while adding course');
      }
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to add course. Please try again.';
      alert(msg);
    }
  };

  // Delete Course
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      await adminAPI.deleteCourse(courseToDelete.id);
      setCourses(courses.filter((c) => c.id !== courseToDelete.id));
    } catch (e) {}
    setCourseToDelete(null);
    setShowDeleteCourseModal(false);
    setSelectedCourse(null);
  };

  // Add/Edit Video
  const handleAddVideo = (videoData, mode = "add") => {
    if (!selectedCourse) return;

    if (mode === "edit") {
      // Update existing video
      setCourses(
        courses.map((c) =>
          c.id === selectedCourse.id
            ? {
                ...c,
                videos: c.videos.map((v) =>
                  v.id === videoData.id ? videoData : v
                ),
              }
            : c
        )
      );
      setSelectedCourse({
        ...selectedCourse,
        videos: selectedCourse.videos.map((v) =>
          v.id === videoData.id ? videoData : v
        ),
      });
      console.log("Video updated:", videoData.id);
    } else {
      // Add new video
      const newVideo = {
        id: Date.now(),
        ...videoData,
      };
      setCourses(
        courses.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, videos: [...c.videos, newVideo] }
            : c
        )
      );
      setSelectedCourse({
        ...selectedCourse,
        videos: [...selectedCourse.videos, newVideo],
      });
      console.log("Video added to course:", selectedCourse.id);
    }

    setShowAddVideoModal(false);
    setEditingVideo(null);
  };

  // Open Edit Video Modal
  const openEditVideoModal = (video) => {
    setEditingVideo(video);
    setShowAddVideoModal(true);
  };

  // Delete Video
  const handleDeleteVideo = (videoId) => {
    if (!selectedCourse) return;
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    setCourses(
      courses.map((c) =>
        c.id === selectedCourse.id
          ? { ...c, videos: c.videos.filter((v) => v.id !== videoId) }
          : c
      )
    );
    setSelectedCourse({
      ...selectedCourse,
      videos: selectedCourse.videos.filter((v) => v.id !== videoId),
    });
    console.log("Video deleted:", videoId);
  };

  // Add/Edit Quiz (from quiz builder)
  const handleAddQuizBuilder = async (quizData, mode = "add") => {
    if (!selectedCourse) return;

    // Map UI payload to backend shape
    const toBackendQuestions = (arr) => (arr || []).map(q => ({
      question: q.questionText,
      option_a: q.optionA,
      option_b: q.optionB,
      option_c: q.optionC,
      option_d: q.optionD,
      correct_answer: q.correctAnswer,
      question_id: q.questionId // may be undefined for new
    }));

    try {
      if (mode === 'edit' && editingQuiz) {
        // Determine deleted questions: present in original but not in new payload
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
      // Refresh list
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
        }))
      })) : [];
      setQuizzesDb(mapped);
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to save quiz';
      alert(msg);
    }

    setShowQuizBuilderModal(false);
    setEditingQuiz(null);
    setQuestionEditIdx(null);
  };

  // Open Edit Quiz Modal
  const openEditQuizModal = (quiz) => {
    setEditingQuiz(quiz);
    setShowQuizBuilderModal(true);
    setQuestionEditIdx(null);
  };

  // Delete Quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!selectedCourse) return;
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await adminAPI.deleteQuiz(quizId);
      setQuizzesDb(prev => prev.filter(q => q.id !== quizId));
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to delete quiz';
      alert(msg);
    }
  };

  // Show Delete Course Confirmation
  const openDeleteCourseModal = (course) => {
    setCourseToDelete(course);
    setShowDeleteCourseModal(true);
  };

  if (selectedCourse) {
    // Course Details View
    return (
      <AdminLayout activeMenuItem="courses">
        <div className="course-details-page">
          <div className="course-header">
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedCourse(null)}
            >
              ← Back to Courses
            </button>
            <h1 className="page-header">{selectedCourse.name}</h1>
            <div className="course-summary">
              <span className="badge">
                📹 {selectedCourse.videos.length} Videos
              </span>
              <span className="badge">
                📝 {selectedCourse.quizzes.length} Quizzes
              </span>
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
              <button
                className="btn btn-success"
                onClick={() => {
                  setEditingQuiz(null);
                  setShowQuizBuilderModal(true);
                }}
              >
                ➕ Add Quiz
              </button>
            </div>
            {qzLoading && <p>Loading quizzes...</p>}
            {!!qzError && <p className="error-text">{qzError}</p>}
            <div className="items-list">
              {quizzesDb.length === 0 && !qzLoading ? (
                <p className="empty-state">
                  No quizzes yet. Add one to get started!
                </p>
              ) : (
                quizzesDb.map((quiz) => (
                  <div key={quiz.id} className="item-card">
                    <div className="item-info">
                      <h3>{quiz.title}</h3>
                      <div>
                        <p>
                          <strong>Questions:</strong>{" "}
                          {quiz.questions?.length || 0}
                        </p>
                        {quiz.createdAt && (
                          <p className="created-at">
                            Created:{" "}
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setQuizDetailsOpen(true);
                        }}
                      >
                        📋 View Questions
                      </button>
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => openEditQuizModal(quiz)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        ❌ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddVideoModal
          isOpen={showAddVideoModal}
          onClose={() => {
            setShowAddVideoModal(false);
            setEditingVideo(null);
          }}
          onSave={handleAddVideo}
          courseName={selectedCourse.name}
          editVideo={editingVideo}
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
        <QuizBuilderModal
          isOpen={showQuizBuilderModal}
          onClose={() => {
            setShowQuizBuilderModal(false);
            setEditingQuiz(null);
            setQuestionEditIdx(null);
          }}
          onSave={handleAddQuizBuilder}
          courseName={selectedCourse.name}
          editQuiz={editingQuiz}
          editQuestionIdx={questionEditIdx}
        />
        <QuizDetailsModal
          isOpen={quizDetailsOpen && !!selectedQuiz}
          onClose={() => {
            setQuizDetailsOpen(false);
            setSelectedQuiz(null);
            setQuestionEditIdx(null);
          }}
          quiz={selectedQuiz}
          onEditQuiz={() => {
            setQuizDetailsOpen(false);
            setEditingQuiz({ ...selectedQuiz, _editQuestionIdx: null });
            setShowQuizBuilderModal(true);
            setQuestionEditIdx(null);
          }}
          onEditQuestion={(qIdx) => {
            setQuizDetailsOpen(false);
            setEditingQuiz({ ...selectedQuiz, _editQuestionIdx: qIdx });
            setShowQuizBuilderModal(true);
            setQuestionEditIdx(qIdx);
          }}
        />
      </AdminLayout>
    );
  }

  // Main Courses Grid View
  return (
    <AdminLayout activeMenuItem="courses">
      <div className="courses-page">
        <div className="courses-header">
          <h1 className="page-header">Courses Management</h1>
          <div>
            <button
              className="btn btn-secondary"
              onClick={refreshCourses}
            >
              ⟳ Refresh
            </button>
            <button
              className="btn btn-primary"
              style={{ marginLeft: 8 }}
              onClick={() => setShowAddCourseModal(true)}
            >
              ➕ Add Course
            </button>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="empty-state">No courses found. Use "Add Course" to create one.</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="course-icon">📚</div>
                <div className="course-info">
                  <h3>{course.name}</h3>
                  <div className="course-stats">
                    <span className="stat-badge">
                      📹 {course.videos.length} Videos
                    </span>
                    <span className="stat-badge">
                      📝 {course.quizzes.length} Quizzes
                    </span>
                  </div>
                </div>
                <button
                  className="btn-icon btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteCourseModal(course);
                  }}
                  title="Delete Course"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCourseModal
        isOpen={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        onSave={handleAddCourse}
      />

      {showDeleteCourseModal && courseToDelete && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteCourseModal(false)}
        >
          <div
            className="modal-content modal-delete"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete Course</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{courseToDelete.name}</strong>?
            </p>
            <p className="warning-text">
              This will delete all videos and quizzes in this course.
            </p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteCourseModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteCourse}
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminCourses;
