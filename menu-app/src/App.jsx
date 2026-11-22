import Chatbot from './components/Chatbot';
import { useState, useEffect } from 'react';
import { getMenusByModuleId, createMenu, updateMenu, deleteMenu, saveMenuVideo } from './api/menuApi';
import Sidebar from './components/Sidebar';
import CaptureGrid from './components/CaptureGrid';
import TopBar from './components/TopBar';
import MenuModal from './components/MenuModal';
import Notifications from './components/Notifications';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EmployeesPage from './pages/EmployeesPage';
import { getCapturesByMenuId, deleteCapture } from './api/captureApi';
import { getAllModules, createModule, deleteModule, renameModule } from './api/moduleApi';
import { notify, apiErrorMessage } from './api/notify';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showEmployees, setShowEmployees] = useState(false);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [menus, setMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [captures, setCaptures] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Toute erreur API devient visible : plus d'echec silencieux qui donne
  // l'impression que la modification a ete enregistree.
  function handleError(action) {
    return err => {
      console.error(err);
      notify(apiErrorMessage(err, action));
    };
  }

  useEffect(() => {
    if (currentUser) {
      getAllModules(currentUser.id)
        .then(res => setModules(res.data))
        .catch(handleError('Chargement des modules'));
    }
  }, [currentUser]);

  function handleLogout() {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setSelectedModule(null);
    setShowEmployees(false);
  }

  useEffect(() => {
    if (selectedModule) {
      getMenusByModuleId(selectedModule.id)
        .then(res => setMenus(res.data))
        .catch(handleError('Chargement des menus'));
    }
  }, [selectedModule]);

  useEffect(() => {
    if (selectedMenuId) {
      getCapturesByMenuId(selectedMenuId)
        .then(res => setCaptures(res.data))
        .catch(handleError('Chargement des captures'));
    }
  }, [selectedMenuId]);

  const selectedMenu = menus.find(m => m.id === selectedMenuId);

  function handleSelectModule(module) {
    setSelectedModule(module);
    setSelectedMenuId(null);
    setCaptures([]);
    setCheckedIds([]);
  }

  function handleRenameModule(id, name) {
  renameModule(id, name)
    .then(res => setModules(prev =>
      prev.map(m => m.id === id ? { ...m, name: res.data.name } : m)
    ))
    .catch(handleError('Renommage du module'));
}

 function handleAddModule(name) {
  createModule(name, currentUser?.id)
    .then(res => setModules(prev => [...prev, res.data]))
    .catch(handleError('Ajout du module'));
}
  function handleSelectMenu(id) {
  setCaptures([]);
  setCheckedIds([]);
  setSelectedMenuId(null);
  setTimeout(() => setSelectedMenuId(id), 0);
}

  function handleAddCapture(newCapture) {
    setCaptures(prev => [...prev, newCapture]);
  }

  function handleDelete(ids) {
    Promise.all(ids.map(id => deleteCapture(id)))
      .then(() => {
        setCaptures(prev => prev.filter(c => !ids.includes(c.id)));
        setCheckedIds([]);
      })
      .catch(handleError('Suppression des captures'));
  }

  function handleSaveCapture(updatedCapture) {
    setCaptures(prev =>
      prev.map(c => c.id === updatedCapture.id ? updatedCapture : c)
    );
  }

  function handleVideoSaved(menuId, videoData) {
  setMenus(prev =>
    prev.map(m => m.id === menuId ? { ...m, videoData } : m)
  );
}

function handleDevalider() {
  if (!selectedMenuId) return;
  saveMenuVideo(selectedMenuId, null)
    .then(() => {
      setMenus(prev =>
        prev.map(m => m.id === selectedMenuId ? { ...m, videoData: null } : m)
      );
    })
    .catch(handleError('Suppression de la vidéo'));
}

  function handleSaveMenu(menuData) {
    createMenu({ ...menuData, module: { id: selectedModule.id } })
      .then(res => setMenus(prev => [...prev, res.data]))
      .catch(handleError('Création du menu'));
  }

  function handleAddChild(parentMenu) {
    const childMenu = {
      name: "Nouveau sous-menu",
      parent: { id: parentMenu.id },
      module: { id: selectedModule.id },
      hasAdd: false,
    };
    createMenu(childMenu)
      .then(res => setMenus(prev => [...prev, res.data]))
      .catch(handleError('Ajout du sous-menu'));
  }

  function handleUpdateMenu(updatedMenu) {
    updateMenu(updatedMenu.id, updatedMenu)
      .then(res => setMenus(prev =>
        prev.map(m => m.id === res.data.id ? res.data : m)
      ))
      .catch(handleError('Mise à jour du menu'));
  }

  function handleDeleteMenu(id) {
    deleteMenu(id)
      .then(() => {
        setMenus(prev => prev.filter(m => m.id !== id && (!m.parent || m.parent.id !== id)));
        if (selectedMenuId === id) setSelectedMenuId(null);
      })
      .catch(handleError('Suppression du menu'));
  }

  function handleDeleteModule(id) {
  deleteModule(id)
    .then(() => setModules(prev => prev.filter(m => m.id !== id)))
    .catch(handleError('Suppression du module'));
}

  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={setCurrentUser} />
        <Notifications />
      </>
    );
  }

  if (!selectedModule) {
    if (showEmployees && currentUser.role === 'admin') {
      return (
        <>
          <EmployeesPage modules={modules} onBack={() => setShowEmployees(false)} />
          <Notifications />
        </>
      );
    }
    return (
      <>
        <HomePage
          modules={modules}
          onSelectModule={handleSelectModule}
          onAddModule={handleAddModule}
          onDeleteModule={handleDeleteModule}
          onRenameModule={handleRenameModule}
          currentUser={currentUser}
          onManageEmployees={() => setShowEmployees(true)}
          onLogout={handleLogout}
        />
        <Chatbot />
        <Notifications />
      </>
    );
  }

  return (
    <div className="app-layout">
      <Notifications />
      {showModal && (
        <MenuModal
          menus={menus}
          onSave={handleSaveMenu}
          onClose={() => setShowModal(false)}
        />
      )}
      <Sidebar
        menus={menus}
        selectedId={selectedMenuId}
        onSelect={handleSelectMenu}
        onNewMenu={() => setShowModal(true)}
        onBack={() => setSelectedModule(null)}
        moduleName={selectedModule.name}
        onAddChild={handleAddChild}
        onEditMenu={handleUpdateMenu}
        onDeleteMenu={handleDeleteMenu}
        isAdmin={true}
      />
      <div className="main-content">
        <TopBar
          onAddCapture={handleAddCapture}
          hasMenuSelected={!!selectedMenuId}
          selectedMenuId={selectedMenuId}
          onDelete={() => handleDelete(checkedIds)}
          hasChecked={checkedIds.length > 0}
          captures={captures}
          menuName={selectedMenu ? selectedMenu.name : 'video'}
          onVideoSaved={handleVideoSaved}
          onDevalider={handleDevalider}
          isAdmin={true}
        />
        <div className="content-area">
          <h2 className="section-title">
            {selectedMenu ? selectedMenu.name : "Sélectionnez un menu"}
          </h2>
          {selectedMenuId
            ? <CaptureGrid
                captures={captures}
                setCaptures={setCaptures}
                onDelete={handleDelete}
                checkedIds={checkedIds}
                setCheckedIds={setCheckedIds}
                onSaveCapture={handleSaveCapture}
              />
            : <p className="empty-hint">Cliquez sur un menu pour voir ses captures.</p>
          }
   </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default App;