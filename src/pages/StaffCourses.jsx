import { useState } from 'react';
import StaffLayout from '../components/StaffLayout';
import AddVideoModal from '../components/AddVideoModal';
import QuizBuilderModal from '../components/QuizBuilderModal';
import QuizDetailsModal from '../components/QuizDetailsModal';
import '../App.css';

function StaffCourses() {
  const [courses] = useState([
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
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showQuizBuilderModal, setShowQuizBuilderModal] = useState(false);
  const [localCourses, setLocalCourses] = useState(courses);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetailsOpen, setQuizDetailsOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [questionEditIdx, setQuestionEditIdx] = useState(null);

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
  const handleAddQuizBuilder = (quizData, mode = 'add') => {
    if (!selectedCourse) return;
    
    if (mode === 'edit') {
      // Update existing quiz
      const updatedQuiz = {
        ...editingQuiz,
        title: quizData.title,
        questions: quizData.questions
      };
      
      setLocalCourses(localCourses.map(c => 
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

      setLocalCourses(localCourses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, quizzes: [...c.quizzes, newQuiz] }
          : c
      ));
      setSelectedCourse({ ...selectedCourse, quizzes: [...selectedCourse.quizzes, newQuiz] });
      console.log('Quiz with multiple questions added:', JSON.stringify(newQuiz, null, 2));
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
          onClose={() => setShowAddVideoModal(false)}
          onSave={handleAddVideo}
          courseName={selectedCourse.name}
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
            setEditingQuiz(selectedQuiz);
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