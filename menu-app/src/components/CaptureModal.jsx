import { useState } from 'react';
import CaptureEditor from './CaptureEditor';
import './CaptureModal.css';


function CaptureModal({ capture, onClose, onDelete, onDownload, onSave }) {
  const [showEditor, setShowEditor] = useState(false);

  if (showEditor) {
    return (
      <CaptureEditor
        capture={capture}
        onClose={() => setShowEditor(false)}
        onSave={(updated) => {
          onSave(updated);
          setShowEditor(false);
        }}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="capture-modal" onClick={e => e.stopPropagation()}>
        <div className="capture-modal-header">
          <h3>Détails de la capture</h3>
          <button className="btn-close-x" onClick={onClose}>✕</button>
        </div>
        <div className="capture-modal-img">
          {capture.imageUrl
            ? <img src={capture.imageUrl} alt={capture.name} />
            : <span>image ici</span>
          }
        </div>
        <p className="capture-modal-name">{capture.name}</p>
        <div className="capture-modal-description">
          <p>{capture.description || 'Aucune description.'}</p>
        </div>
        <div className="capture-modal-buttons">
          <button className="btn-supprimer" onClick={() => {
            if (window.confirm('Voulez-vous supprimer cette capture ?')) {
              onDelete(capture.id);
              onClose();
            }
          }}>Supprimer</button>
          <button className="btn-telecharger" onClick={() => onDownload(capture)}>Télécharger</button>
          <button className="btn-modifier" onClick={() => setShowEditor(true)}>Modifier</button>
          <button className="btn-fermer" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default CaptureModal;