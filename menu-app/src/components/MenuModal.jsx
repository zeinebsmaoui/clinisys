import { useState } from 'react';
import './MenuModal.css';

function MenuModal({ menus, onSave, onClose }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [parentId, setParentId] = useState('');

  function handleSave() {
  if (!name.trim()) return;
  onSave({
    name,
    icon: icon || null,
    parent: parentId ? { id: parseInt(parentId) } : null,
    hasAdd: parentId ? false : true,
  });
  onClose();
}

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Nouveau menu</h3>

        <label>Nom du menu *</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ex: Diagnostic"
        />

        <label>Icône (emoji)</label>
        <div className="emoji-picker">
          {['📁','📂','📄','📋','📌','📝','🏥','💊','🩺','💉','🦷','👁️','❤️','🧬','🔬','📅','👤','👥','⚙️','📊','📈','💰','🖼️','📷','🎥','📞','✉️','🏠','🚗','⭐','🔔','✅','❌','⚠️','❤️‍🩹','🩹','🧪','🩻','🖥️','🗂️','📰','🔒','🔑'].map(e => (
            <button
              type="button"
              key={e}
              className={`emoji-btn ${icon === e ? 'emoji-selected' : ''}`}
              onClick={() => setIcon(e)}
            >
              {e}
            </button>
          ))}
        </div>
        {icon && <p style={{ fontSize: 13, color: '#555' }}>Icône choisie : {icon} <button type="button" onClick={() => setIcon('')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✕</button></p>}

        <label>Menu parent (optionnel)</label>
        <select value={parentId} onChange={e => setParentId(e.target.value)}>
          <option value="">Aucun (menu principal)</option>
          {menus.filter(m => !m.parent).map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-save" onClick={handleSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default MenuModal;