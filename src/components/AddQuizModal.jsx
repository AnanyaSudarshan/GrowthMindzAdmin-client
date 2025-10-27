import { useState, useEffect } from 'react';

function AddQuizModal({ isOpen, onClose, onSave, courseName, editQuiz = null }) {
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A'
  });

  // Update form when editing
  useEffect(() => {
    if (editQuiz && isOpen) {
      setFormData({
        title: editQuiz.title || '',
        question: editQuiz.question || '',
        optionA: editQuiz.optionA || '',
        optionB: editQuiz.optionB || '',
        optionC: editQuiz.optionC || '',
        optionD: editQuiz.optionD || '',
        correctAnswer: editQuiz.correctAnswer || 'A'
      });
    } else if (!isOpen) {
      setFormData({
        title: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A'
      });
    }
  }, [editQuiz, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.question.trim()) {
      alert('Please enter quiz title and question');
      return;
    }
    if (!formData.optionA.trim() || !formData.optionB.trim() || 
        !formData.optionC.trim() || !formData.optionD.trim()) {
      alert('Please enter all 4 options');
      return;
    }

    const quizData = {
      ...formData,
      id: editQuiz ? editQuiz.id : Date.now()
    };

    onSave(quizData, editQuiz ? 'edit' : 'add');
    
    if (!editQuiz) {
      setFormData({
        title: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A'
      });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{editQuiz ? 'Edit Quiz' : 'Add Quiz to '}{!editQuiz && courseName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quiz Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter quiz title"
              required
            />
          </div>
          <div className="form-group">
            <label>Question</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter the question"
              rows="3"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Option A</label>
            <input
              type="text"
              value={formData.optionA}
              onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
              placeholder="Enter option A"
              required
            />
          </div>
          <div className="form-group">
            <label>Option B</label>
            <input
              type="text"
              value={formData.optionB}
              onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
              placeholder="Enter option B"
              required
            />
          </div>
          <div className="form-group">
            <label>Option C</label>
            <input
              type="text"
              value={formData.optionC}
              onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
              placeholder="Enter option C"
              required
            />
          </div>
          <div className="form-group">
            <label>Option D</label>
            <input
              type="text"
              value={formData.optionD}
              onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
              placeholder="Enter option D"
              required
            />
          </div>
          <div className="form-group">
            <label>Correct Answer</label>
            <select
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              className="form-control"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
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
              {editQuiz ? 'Update Quiz' : 'Add Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuizModal;


