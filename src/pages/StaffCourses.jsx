import { useState } from 'react';
import StaffLayout from '../components/StaffLayout';
import AddVideoModal from '../components/AddVideoModal';
import AddQuizModal from '../components/AddQuizModal';
import '../App.css';

function StaffCourses() {
  const [courses] = useState([
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
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [localCourses, setLocalCourses] = useState(courses);

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

  // Add Quiz
  const handleAddQuiz = (quizData) => {
    if (!selectedCourse) return;
    const newQuiz = {
      id: Date.now(),
      ...quizData
    };
    setLocalCourses(localCourses.map(c => 
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
    
    setLocalCourses(localCourses.map(c => 
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

  if (selectedCourse) {
    // Course Details View
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
      </StaffLayout>
    );
  }

  // Main Courses Grid View
  return (
    <StaffLayout activeMenuItem="courses">
      <div className="courses-page">
        <h1 className="page-header">Courses Management</h1>

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