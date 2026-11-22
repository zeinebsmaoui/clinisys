import { useState } from 'react';

function MenuItem({ menu, isChild, isSelected, onSelect, onAddChild, onEdit, isAdmin = true }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <div
        className={`menu-item ${isChild ? 'child' : 'parent'} ${isSelected ? 'active' : ''}`}
        onClick={() => onSelect(menu.id)}
      >
        <span className="menu-label">
          {menu.icon && <span className="menu-icon">{menu.icon}</span>}
          {menu.name}
        </span>
        <span className="menu-actions">
          {menu.videoData && (
            <button
              className="btn-icon btn-play"
              onClick={e => { e.stopPropagation(); setShowVideo(true); }}
            >▶</button>
          )}
          {isAdmin && (
            <button
              className="btn-icon btn-edit"
              onClick={e => { e.stopPropagation(); onEdit(); }}
            >✎</button>
          )}
          {isAdmin && menu.hasAdd && (
            <button
              className="btn-icon btn-add"
              onClick={e => { e.stopPropagation(); onAddChild(menu); }}
            >+</button>
          )}
        </span>
      </div>

      {showVideo && (
        <div className="video-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-modal" onClick={e => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3>{menu.name}</h3>
              <button onClick={() => setShowVideo(false)}>✕</button>
            </div>
            <img src={menu.videoData} alt="video" style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </>
  );
}

export default MenuItem;