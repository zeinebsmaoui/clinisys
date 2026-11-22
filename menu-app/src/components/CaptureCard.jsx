import './CaptureCard.css';


function CaptureCard({ capture, isSelected, isChecked, onSelect, onCheck, onDoubleClick, showLeft, showRight, onLeft, onRight }) {
  return (
    <div
      className={`capture-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
    >
      <div className="capture-checkbox">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={e => { e.stopPropagation(); onCheck(); }}
          onClick={e => e.stopPropagation()}
        />
      </div>
      <div className="capture-img">
        {capture.imageUrl
  ? <img src={capture.imageUrl} alt={capture.name} />
  : <span className="img-placeholder">image ici</span>
}
      </div>
      <div className="capture-footer">
        <p className="capture-name">{capture.name}</p>
        {capture.description && (
          <p className="capture-desc">{capture.description}</p>
        )}
        <div className="capture-actions">
          {showLeft && (
            <button className="btn-move" onClick={e => { e.stopPropagation(); onLeft(); }}>◀</button>
          )}
          {showRight && (
            <button className="btn-move" onClick={e => { e.stopPropagation(); onRight(); }}>▶</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CaptureCard;