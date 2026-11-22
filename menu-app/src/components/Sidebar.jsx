import { useState } from 'react';
import MenuItem from './MenuItem';
import MenuEditModal from './MenuEditModal';
import './Sidebar.css';

function Sidebar({ menus, selectedId, onSelect, onNewMenu, onBack, moduleName, onAddChild, onEditMenu, onDeleteMenu, isAdmin = true }) {
  const [search, setSearch] = useState('');
  const [editingMenu, setEditingMenu] = useState(null);


  const topLevel = menus.filter(m => !m.parent).filter(m =>
  search.trim() === '' ||
  m.name.toLowerCase().includes(search.toLowerCase()) ||
  menus.some(child => child.parent?.id === m.id && child.name.toLowerCase().includes(search.toLowerCase()))
);

  return (
    <div className="sidebar">
      {editingMenu && (
        <MenuEditModal
          menu={editingMenu}
          onSave={onEditMenu}
          onDelete={onDeleteMenu}
          onClose={() => setEditingMenu(null)}
        />
      )}

      <div className="sidebar-back">
  <button className="btn-back" onClick={onBack}>← Modules</button>
  <span className="module-name">{moduleName}</span>
</div>

      <div className="sidebar-header">
        <span className="sidebar-title">Menus</span>
        {isAdmin && <button className="btn-new-menu" onClick={onNewMenu}>Nouveau menu</button>}
      </div>

      <div className="sidebar-search">
        <input
          placeholder="Rechercher un menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="menu-list">
        {topLevel.map(menu => (
          <div key={menu.id}>
            <MenuItem
              menu={menu}
              isChild={false}
              isSelected={selectedId === menu.id}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onEdit={() => setEditingMenu(menu)}
              isAdmin={isAdmin}
            />
            {menus
              .filter(m => m.parent && m.parent.id === menu.id)
              .filter(m => search.trim() === '' || m.name.toLowerCase().includes(search.toLowerCase()))
              .map(child => (
                <MenuItem
                  key={child.id}
                  menu={child}
                  isChild={true}
                  isSelected={selectedId === child.id}
                  onSelect={onSelect}
                  onAddChild={onAddChild}
                  onEdit={() => setEditingMenu(child)}
                  isAdmin={isAdmin}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;