import { useState } from 'react';

function AddCourseModal({ isOpen, onClose, onSave }) {
  const [courseName, setCourseName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName.trim()) {
      alert('Please enter a course name');
      return;
    }
    onSave(courseName);
    setCourseName('');
  };

  const handleClose = () => {
    setCourseName('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-delete" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name (e.g., Stock Market, Forex Market)"
              required
            />
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
              className="btn btn-primary"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourseModal;














