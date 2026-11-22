import { useState } from 'react';
import './HomePage.css';

function HomePage({ modules, onSelectModule, onAddModule, onDeleteModule, onRenameModule, currentUser, onManageEmployees, onLogout }) {
  const isAdmin = currentUser?.role === 'admin';
  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [renamingModule, setRenamingModule] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  function handleAdd() {
    if (!moduleName.trim()) return;
    onAddModule(moduleName);
    setModuleName('');
    setShowModal(false);
  }

  function handleRename() {
    if (!renameValue.trim()) return;
    onRenameModule(renamingModule.id, renameValue);
    setRenamingModule(null);
    setRenameValue('');
  }

  return (
    <div className="home-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nouveau module</h3>
            <label>Nom du module</label>
            <input
              value={moduleName}
              onChange={e => setModuleName(e.target.value)}
              placeholder="Ex: Cardiologie"
              autoFocus
            />
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-save" onClick={handleAdd}>Créer</button>
            </div>
          </div>
        </div>
      )}

      {renamingModule && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Renommer le module</h3>
            <label>Nouveau nom</label>
            <input
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              placeholder={renamingModule.name}
              autoFocus
            />
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setRenamingModule(null)}>Annuler</button>
              <button className="btn-save" onClick={handleRename}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div className="home-header">
        <h1>Bienvenue, {currentUser?.name}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-add-module" onClick={() => setShowModal(true)}>
            + Ajouter un module
          </button>
          {isAdmin && (
            <button className="btn-add-module" onClick={onManageEmployees}>
              👥 Employés
            </button>
          )}
          <button className="btn-add-module" onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="modules-grid">
        {modules.map(module => (
          <div key={module.id} className="module-card-wrapper">
            <div
              className="module-card"
              onClick={() => onSelectModule(module)}
            >
              <div className="module-icon">📁</div>
              <h3>{module.name}</h3>
            </div>
            <div className="module-card-actions">
              <button
                className="btn-rename-module"
                onClick={() => { setRenamingModule(module); setRenameValue(module.name); }}
              >
                ✎
              </button>
              <button
                className="btn-delete-module"
                onClick={() => {
                  if (window.confirm(`Voulez-vous supprimer "${module.name}" ?`)) {
                    onDeleteModule(module.id);
                  }
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;