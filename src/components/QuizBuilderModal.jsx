import { useRef, useEffect, useState } from 'react';

function QuizBuilderModal({ isOpen, onClose, onSave, courseName, editQuiz = null, editQuestionIdx = null }) {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    }
  ]);
  const questionRefs = useRef([]);

  // Update form when editing
  useEffect(() => {
    if (editQuiz && isOpen) {
      setQuizTitle(editQuiz.title || '');
      setQuestions(editQuiz.questions || [{
        id: 1,
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A'
      }]);
    } else if (!isOpen) {
      setQuizTitle('');
      setQuestions([{
        id: 1,
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A'
      }]);
    }
  }, [editQuiz, isOpen]);

  // Scroll to question only once when modal opens or question index changes
  useEffect(() => {
    if (
      isOpen &&
      editQuestionIdx != null &&
      questionRefs.current[editQuestionIdx] &&
      questions.length > 0
    ) {
      // Only scroll once when the component mounts or editQuestionIdx changes, not on every render
      const timer = setTimeout(() => {
        questionRefs.current[editQuestionIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Only focus if it hasn't been focused yet
        if (questionRefs.current[editQuestionIdx] && !questionRefs.current[editQuestionIdx].dataset.focused) {
          questionRefs.current[editQuestionIdx].dataset.focused = 'true';
          questionRefs.current[editQuestionIdx].focus();
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, editQuestionIdx]); // Removed questions from dependencies

  if (!isOpen) return null;

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    } else {
      alert('At least one question is required');
    }
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!quizTitle.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    const validQuestions = questions.filter(q => q.questionText.trim());
    if (validQuestions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Validate each question
    for (let i = 0; i < validQuestions.length; i++) {
      const q = validQuestions[i];
      if (!q.optionA.trim() || !q.optionB.trim() || !q.optionC.trim() || !q.optionD.trim()) {
        alert(`Question ${i + 1}: Please fill all 4 options`);
        return;
      }
    }

    const quizData = {
      title: quizTitle,
      courseName: courseName,
      questions: validQuestions,
      createdAt: editQuiz ? editQuiz.createdAt : new Date().toISOString()
    };

    // Log as JSON for now (later will be sent to backend)
    console.log('Quiz Data (JSON):', JSON.stringify(quizData, null, 2));
    
    onSave(quizData, editQuiz ? 'edit' : 'add');
    
    // Reset form if adding new quiz
    if (!editQuiz) {
      setQuizTitle('');
      setQuestions([{
        id: 1,
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A'
      }]);
    }
  };

  const handleClose = () => {
    setQuizTitle('');
    setQuestions([{
      id: 1,
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    }]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content quiz-builder-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{editQuiz ? '📝 Edit Quiz' : '📝 Quiz Builder'} - {courseName}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Quiz Title */}
          <div className="form-group">
            <label>Quiz Title</label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title (e.g., Chapter 1 Assessment)"
              required
            />
          </div>

          {/* Questions List */}
          <div className="questions-container">
            <div className="questions-header">
              <h3>Questions ({questions.length})</h3>
              <button 
                type="button"
                className="btn btn-success btn-small"
                onClick={addQuestion}
              >
                ➕ Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <div ref={el => (questionRefs.current[index] = el)} tabIndex={-1} key={question.id} className="question-card">
                <div className="question-header">
                  <h4>Question {index + 1}</h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeQuestion(question.id)}
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Question Text</label>
                  <textarea
                    value={question.questionText}
                    onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                    placeholder="Enter your question here..."
                    rows="2"
                    className="form-control"
                  />
                </div>

                <div className="options-grid">
                  <div className="form-group">
                    <label>Option A</label>
                    <input
                      type="text"
                      value={question.optionA}
                      onChange={(e) => updateQuestion(question.id, 'optionA', e.target.value)}
                      placeholder="Option A"
                    />
                  </div>

                  <div className="form-group">
                    <label>Option B</label>
                    <input
                      type="text"
                      value={question.optionB}
                      onChange={(e) => updateQuestion(question.id, 'optionB', e.target.value)}
                      placeholder="Option B"
                    />
                  </div>

                  <div className="form-group">
                    <label>Option C</label>
                    <input
                      type="text"
                      value={question.optionC}
                      onChange={(e) => updateQuestion(question.id, 'optionC', e.target.value)}
                      placeholder="Option C"
                    />
                  </div>

                  <div className="form-group">
                    <label>Option D</label>
                    <input
                      type="text"
                      value={question.optionD}
                      onChange={(e) => updateQuestion(question.id, 'optionD', e.target.value)}
                      placeholder="Option D"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Correct Answer</label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                    className="form-control"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-success"
            >
              {editQuiz ? '✅ Update Quiz' : '✅ Save Quiz'} ({questions.length} {questions.length === 1 ? 'Question' : 'Questions'})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuizBuilderModal;
