import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employeeApi';
import { notify, apiErrorMessage } from '../api/notify';
import './EmployeesPage.css';

function EmployeesPage({ modules, onBack }) {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
  const [editingId, setEditingId] = useState(null);

  function loadEmployees() {
    getEmployees()
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error(err);
        notify(apiErrorMessage(err, 'Chargement des employés'));
      });
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    setSelectedModuleIds([]);
    setEditingId(null);
  }

  function toggleModule(id) {
    setSelectedModuleIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  }

  function handleSave() {
    if (!name.trim() || !email.trim() || (!editingId && !password.trim())) {
      notify('Renseignez le nom, l’email et le mot de passe.', 'info');
      return;
    }
    const payload = {
      name,
      email,
      password,
      role: 'employee',
      allowedModules: selectedModuleIds.map(id => ({ id })),
    };
    const request = editingId
      ? updateEmployee(editingId, payload)
      : createEmployee(payload);
    request
      .then(() => {
        loadEmployees();
        resetForm();
        notify(editingId ? 'Employé modifié.' : 'Employé ajouté.', 'success');
      })
      .catch(err => {
        console.error(err);
        notify(apiErrorMessage(err, 'Enregistrement de l\'employé'));
      });
  }

  function handleEdit(emp) {
    setEditingId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setPassword('');
    setSelectedModuleIds((emp.allowedModules || []).map(m => m.id));
  }

  function handleDelete(id) {
    if (!window.confirm('Supprimer cet employé ?')) return;
    deleteEmployee(id)
      .then(() => {
        setEmployees(prev => prev.filter(e => e.id !== id));
        notify('Employé supprimé.', 'success');
      })
      .catch(err => {
        console.error(err);
        notify(apiErrorMessage(err, 'Suppression de l\'employé'));
      });
  }

  return (
    <div className="employees-page">
      <div className="employees-header">
        <button className="btn-back" onClick={onBack}>← Modules</button>
        <h1>Gestion des employés</h1>
      </div>

      <div className="employees-content">
        <div className="employee-form">
          <h3>{editingId ? 'Modifier employé' : 'Nouvel employé'}</h3>
          <label>Nom</label>
          <input value={name} onChange={e => setName(e.target.value)} />
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <label>Mot de passe {editingId && '(laisser vide pour garder)'}</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <label>Modules autorisés</label>
          <div className="modules-checklist">
            {modules.map(module => (
              <label key={module.id} className="module-check">
                <input
                  type="checkbox"
                  checked={selectedModuleIds.includes(module.id)}
                  onChange={() => toggleModule(module.id)}
                />
                {module.name}
              </label>
            ))}
          </div>
          <div className="form-buttons">
            <button className="btn-save" onClick={handleSave}>
              {editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
            {editingId && <button className="btn-cancel" onClick={resetForm}>Annuler</button>}
          </div>
        </div>

        <div className="employees-list">
          {employees.filter(e => e.role !== 'admin').map(emp => (
            <div key={emp.id} className="employee-card">
              <div>
                <strong>{emp.name}</strong>
                <p>{emp.email}</p>
                <p className="emp-modules">
                  Modules: {(emp.allowedModules || []).map(m => m.name).join(', ') || 'aucun'}
                </p>
              </div>
              <div className="employee-actions">
                <button onClick={() => handleEdit(emp)}>✎</button>
                <button onClick={() => handleDelete(emp.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;
