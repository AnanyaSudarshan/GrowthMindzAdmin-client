import { useState } from 'react';

function AddVideoModal({ isOpen, onClose, onSave, courseName }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a video title');
      return;
    }
    onSave(formData);
    setFormData({ title: '', description: '', file: null });
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', file: null });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Video to {courseName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Video Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter video title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter video description"
              rows="3"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
              className="file-input"
            />
            <small className="form-text">Video upload will be connected to cloud storage (e.g., AWS S3)</small>
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
              Add Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVideoModal;
