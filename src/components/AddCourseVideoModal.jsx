import { useState, useEffect } from 'react';

function AddCourseVideoModal({ isOpen, onClose, onSave, courseTitle, mode = 'add', initial = null }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [desc, setDesc] = useState(initial?.description || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initial?.title || '');
      setUrl(initial?.url || '');
      setDesc(initial?.description || '');
    } else {
      setTitle('');
      setUrl('');
      setDesc('');
      setSubmitting(false);
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const handleCancel = () => {
    setTitle('');
    setUrl('');
    setDesc('');
    onClose();
  };

  const handleAdd = async () => {
    const trimmedTitle = (title || '').trim();
    const trimmedUrl = (url || '').trim();
    if (!trimmedTitle || !trimmedUrl) {
      alert('Please fill Course Video Title and Video URL');
      return;
    }
    setSubmitting(true);
    try {
      const ok = await onSave({ title: trimmedTitle, url: trimmedUrl, description: desc });
      if (ok) {
        setTitle('');
        setUrl('');
        setDesc('');
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'edit' ? 'Edit Video' : 'Add Video'}{mode === 'add' ? ` to ${courseTitle}` : ''}</h2>
        <div className="form-group">
          <label>Course Video Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter video title" />
        </div>
        <div className="form-group">
          <label>Video URL</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Optional description" />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>Cancel</button>
          <button type="button" className="btn btn-success" onClick={handleAdd} disabled={submitting}>{submitting ? (mode==='edit'?'Saving...':'Adding...') : (mode==='edit'?'Save':'Add Video')}</button>
        </div>
      </div>
    </div>
  );
}

export default AddCourseVideoModal;
