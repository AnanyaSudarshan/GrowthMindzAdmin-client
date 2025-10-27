function QuizDetailsModal({ isOpen, onClose, quiz, onEditQuiz = null, onEditQuestion }) {
  if (!isOpen || !quiz) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content quiz-details-modal" onClick={e => e.stopPropagation()}>
        <h2>Quiz: {quiz.title}</h2>
        <ol style={{paddingLeft: 24}}>
          {quiz.questions && quiz.questions.map((q, idx) => (
                <li key={q.id} style={{marginBottom: 24, borderBottom: '1px solid #f0f0f0', paddingBottom: 16, paddingTop: 10}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px'}}>
                <strong>Q{idx + 1}: {q.questionText}</strong>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => onEditQuestion(idx)}
                  title="Edit this question"
                  style={{marginLeft: '10px'}}
                >✏️ Edit</button>
              </div>
              <div style={{marginLeft: 16, marginTop: 6}}>
                <div>A: {q.optionA}</div>
                <div>B: {q.optionB}</div>
                <div>C: {q.optionC}</div>
                <div>D: {q.optionD}</div>
                <div style={{color: '#48bb78', fontWeight: 'bold', marginTop: 3}}>✓ Correct: {q.correctAnswer}</div>
              </div>
            </li>
          ))}
        </ol>
        <div className="modal-actions" style={{marginTop: 22}}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default QuizDetailsModal;
