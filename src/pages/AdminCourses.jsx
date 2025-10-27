import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AddVideoModal from '../components/AddVideoModal';
import QuizBuilderModal from '../components/QuizBuilderModal';
import AddCourseModal from '../components/AddCourseModal';
import QuizDetailsModal from '../components/QuizDetailsModal';
import '../App.css';

function AdminCourses() {
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      name: "NISM Course", 
      videos: [{ id: 1, title: "Intro to NISM", description: "Introduction to NISM concepts" }], 
      quizzes: [{ 
        id: 1,
        type: 'quiz-builder',
        title: "Basic Quiz",
        questions: [
          {
            id: 1,
            questionText: "What is NISM?",
            optionA: "National Institute of Securities Markets",
            optionB: "New System",
            optionC: "None",
            optionD: "Other",
            correctAnswer: "A"
          }
        ],
        createdAt: new Date().toISOString()
      }] 
    },
    { 
      id: 2, 
      name: "Stock Market", 
      videos: [
        { id: 2, title: "Basics of Stock Trading", description: "Learn the fundamentals" },
        { id: 3, title: "Technical Analysis", description: "Understanding charts" }
      ], 
      quizzes: [
        { 
          id: 2,
          type: 'quiz-builder',
          title: "Stock Fundamentals",
          questions: [
            {
              id: 1,
              questionText: "What is a bull market?",
              optionA: "Rising market",
              optionB: "Falling market",
              optionC: "Stable market",
              optionD: "None",
              correctAnswer: "A"
            }
          ],
          createdAt: new Date().toISOString()
        }
      ] 
    },
    { 
      id: 3, 
      name: "Forex Market", 
      videos: [], 
      quizzes: [] 
    }
  ]);

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

  // Add Course
  const handleAddCourse = (courseName) => {
    const newCourse = {
      id: Date.now(),
      name: courseName,
      videos: [],
      quizzes: []
    };
    setCourses([...courses, newCourse]);
    setShowAddCourseModal(false);
    console.log('Course added:', newCourse);
  };

  // Delete Course
  const handleDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter(c => c.id !== courseToDelete.id));
      setCourseToDelete(null);
      setShowDeleteCourseModal(false);
      setSelectedCourse(null); // Return to course grid
      console.log('Course deleted:', courseToDelete.id);
    }
  };

  // Add/Edit Video
  const handleAddVideo = (videoData, mode = 'add') => {
    if (!selectedCourse) return;
    
    if (mode === 'edit') {
      // Update existing video
      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, videos: c.videos.map(v => v.id === videoData.id ? videoData : v) }
          : c
      ));
      setSelectedCourse({ 
        ...selectedCourse, 
        videos: selectedCourse.videos.map(v => v.id === videoData.id ? videoData : v)
      });
      console.log('Video updated:', videoData.id);
    } else {
      // Add new video
      const newVideo = {
        id: Date.now(),
        ...videoData
      };
      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, videos: [...c.videos, newVideo] }
          : c
      ));
      setSelectedCourse({ ...selectedCourse, videos: [...selectedCourse.videos, newVideo] });
      console.log('Video added to course:', selectedCourse.id);
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
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    setCourses(courses.map(c => 
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
  const handleAddQuizBuilder = (quizData, mode = 'add') => {
    if (!selectedCourse) return;
    
    if (mode === 'edit') {
      // Update existing quiz
      const updatedQuiz = {
        ...editingQuiz,
        title: quizData.title,
        questions: quizData.questions
      };
      
      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, quizzes: c.quizzes.map(q => q.id === editingQuiz.id ? updatedQuiz : q) }
          : c
      ));
      setSelectedCourse({ 
        ...selectedCourse, 
        quizzes: selectedCourse.quizzes.map(q => q.id === editingQuiz.id ? updatedQuiz : q)
      });
      console.log('Quiz updated:', JSON.stringify(updatedQuiz, null, 2));
    } else {
      // Add new quiz
      const newQuiz = {
        id: Date.now(),
        type: 'quiz-builder',
        title: quizData.title,
        courseName: quizData.courseName,
        questions: quizData.questions,
        createdAt: quizData.createdAt
      };

      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, quizzes: [...c.quizzes, newQuiz] }
          : c
      ));
      setSelectedCourse({ ...selectedCourse, quizzes: [...selectedCourse.quizzes, newQuiz] });
      console.log('Quiz with multiple questions added:', JSON.stringify(newQuiz, null, 2));
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
  const handleDeleteQuiz = (quizId) => {
    if (!selectedCourse) return;
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    
    setCourses(courses.map(c => 
      c.id === selectedCourse.id 
        ? { ...c, quizzes: c.quizzes.filter(q => q.id !== quizId) }
        : c
    ));
    setSelectedCourse({ 
      ...selectedCourse, 
      quizzes: selectedCourse.quizzes.filter(q => q.id !== quizId) 
    });
    console.log('Quiz deleted:', quizId);
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
            <button className="btn btn-secondary" onClick={() => setSelectedCourse(null)}>
              ← Back to Courses
            </button>
            <h1 className="page-header">{selectedCourse.name}</h1>
            <div className="course-summary">
              <span className="badge">📹 {selectedCourse.videos.length} Videos</span>
              <span className="badge">📝 {selectedCourse.quizzes.length} Quizzes</span>
            </div>
          </div>

          {/* Videos Section */}
          <div className="content-section">
            <div className="section-header">
              <h2>📹 Videos</h2>
              <button 
                className="btn btn-success" 
                onClick={() => {
                  setEditingVideo(null);
                  setShowAddVideoModal(true);
                }}
              >
                ➕ Add Video
              </button>
            </div>
            <div className="items-list">
              {selectedCourse.videos.length === 0 ? (
                <p className="empty-state">No videos yet. Add one to get started!</p>
              ) : (
                selectedCourse.videos.map(video => (
                  <div key={video.id} className="item-card">
                    <div className="item-info">
                      <h3>{video.title}</h3>
                      <p>{video.description}</p>
                    </div>
                    <div className="item-actions">
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => openEditVideoModal(video)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        ❌ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
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
            <div className="items-list">
              {selectedCourse.quizzes.length === 0 ? (
                <p className="empty-state">No quizzes yet. Add one to get started!</p>
              ) : (
                selectedCourse.quizzes.map(quiz => (
                  <div key={quiz.id} className="item-card">
                    <div className="item-info">
                      <h3>{quiz.title}</h3>
                      <div>
                        <p><strong>Questions:</strong> {quiz.questions?.length || 0}</p>
                        {quiz.createdAt && (
                          <p className="created-at">Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>
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
          onEditQuestion={qIdx => {
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
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddCourseModal(true)}
          >
            ➕ Add Course
          </button>
        </div>

        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card" onClick={() => setSelectedCourse(course)}>
              <div className="course-icon">📚</div>
              <div className="course-info">
                <h3>{course.name}</h3>
                <div className="course-stats">
                  <span className="stat-badge">📹 {course.videos.length} Videos</span>
                  <span className="stat-badge">📝 {course.quizzes.length} Quizzes</span>
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
      </div>

      {/* Modals */}
      <AddCourseModal 
        isOpen={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        onSave={handleAddCourse}
      />

      {showDeleteCourseModal && courseToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteCourseModal(false)}>
          <div className="modal-content modal-delete" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Course</h2>
            <p>Are you sure you want to delete <strong>{courseToDelete.name}</strong>?</p>
            <p className="warning-text">This will delete all videos and quizzes in this course.</p>
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