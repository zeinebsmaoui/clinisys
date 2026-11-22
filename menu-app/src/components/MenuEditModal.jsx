import { useState } from 'react';
import './MenuModal.css';

function MenuEditModal({ menu, onSave, onDelete, onClose }) {
  const [name, setName] = useState(menu.name);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Modifier le menu</h3>

        <label>Nom du menu</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom du menu"
        />

        <div className="modal-buttons">
          <button
            className="btn-cancel"
            style={{ background: '#122a5c', color: 'white' }}
            onClick={() => { onDelete(menu.id); onClose(); }}
          >
            Supprimer
          </button>
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-save" onClick={() => { onSave({ ...menu, name }); onClose(); }}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuEditModal;