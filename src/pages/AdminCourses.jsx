import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AddVideoModal from '../components/AddVideoModal';
import AddQuizModal from '../components/AddQuizModal';
import AddCourseModal from '../components/AddCourseModal';
import '../App.css';

function AdminCourses() {
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      name: "NISM Course", 
      videos: [{ id: 1, title: "Intro to NISM", description: "Introduction to NISM concepts" }], 
      quizzes: [{ 
        id: 1, 
        title: "Basic Quiz", 
        question: "What is NISM?", 
        optionA: "National Institute of Securities Markets", 
        optionB: "New System", 
        optionC: "None", 
        optionD: "Other",
        correctAnswer: "A"
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
          title: "Stock Fundamentals", 
          question: "What is a bull market?", 
          optionA: "Rising market", 
          optionB: "Falling market", 
          optionC: "Stable market", 
          optionD: "None",
          correctAnswer: "A"
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
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

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

  // Add Video
  const handleAddVideo = (videoData) => {
    if (!selectedCourse) return;
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
    setShowAddVideoModal(false);
    console.log('Video added to course:', selectedCourse.id);
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

  // Add Quiz
  const handleAddQuiz = (quizData) => {
    if (!selectedCourse) return;
    const newQuiz = {
      id: Date.now(),
      ...quizData
    };
    setCourses(courses.map(c => 
      c.id === selectedCourse.id 
        ? { ...c, quizzes: [...c.quizzes, newQuiz] }
        : c
    ));
    setSelectedCourse({ ...selectedCourse, quizzes: [...selectedCourse.quizzes, newQuiz] });
    setShowAddQuizModal(false);
    console.log('Quiz added to course:', selectedCourse.id);
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
                onClick={() => setShowAddVideoModal(true)}
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
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      ❌ Delete
                    </button>
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
                onClick={() => setShowAddQuizModal(true)}
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
                      <p>{quiz.question}</p>
                      <div className="quiz-options">
                        <span>A: {quiz.optionA}</span> | 
                        <span>B: {quiz.optionB}</span> | 
                        <span>C: {quiz.optionC}</span> | 
                        <span>D: {quiz.optionD}</span>
                      </div>
                      <p className="correct-answer">✓ Correct Answer: {quiz.correctAnswer}</p>
                    </div>
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      ❌ Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddVideoModal 
          isOpen={showAddVideoModal}
          onClose={() => setShowAddVideoModal(false)}
          onSave={handleAddVideo}
          courseName={selectedCourse.name}
        />
        <AddQuizModal 
          isOpen={showAddQuizModal}
          onClose={() => setShowAddQuizModal(false)}
          onSave={handleAddQuiz}
          courseName={selectedCourse.name}
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