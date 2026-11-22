import { useRef } from 'react';
import { uploadCapture, generateVideo } from '../api/captureApi';
import { saveMenuVideo } from '../api/menuApi';
import { notify, apiErrorMessage } from '../api/notify';
import './TopBar.css';

function TopBar({ onAddCapture, hasMenuSelected, selectedMenuId, onDelete, hasChecked, captures, menuName, onVideoSaved, onDevalider, isAdmin = true }) {
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file || !selectedMenuId) return;
    uploadCapture(file, selectedMenuId)
      .then(res => onAddCapture(res.data))
      .catch(err => {
        console.error(err);
        notify(apiErrorMessage(err, 'Ajout de la capture'));
      });
    e.target.value = '';
  }

  function handleGenerateVideo() {
    if (!captures || captures.length === 0) return;
    const imageUrls = captures.map(c => c.imageUrl).filter(url => url);
    generateVideo(imageUrls, menuName || 'video')
      .then(res => {
        // type explicite : le data URL enregistre en base doit etre un GIF
        // affichable dans <img>, sinon la video ne s'affiche pas dans le menu.
        const blob = new Blob([res.data], { type: 'image/gif' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          saveMenuVideo(selectedMenuId, base64)
            .then(() => {
              onVideoSaved(selectedMenuId, base64);
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${menuName || 'video'}.gif`;
              link.click();
            })
            .catch(err => {
              console.error(err);
              notify(apiErrorMessage(err, 'Enregistrement de la vidéo'));
            });
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error(err);
        if (!err?.response) {
          notify('Génération de la vidéo : service Python injoignable (port 5000).', 'error');
        } else {
          notify(apiErrorMessage(err, 'Génération de la vidéo'));
        }
      });
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {isAdmin && (
          <>
            <button
              className="btn-ajouter"
              onClick={() => fileInputRef.current.click()}
              disabled={!hasMenuSelected}
            >
              Ajouter une capture
            </button>
            <button
              className="btn-supprimer"
              onClick={() => {
                if (window.confirm('Voulez-vous supprimer les captures sélectionnées ?')) {
                  onDelete();
                }
              }}
              disabled={!hasChecked}
            >
              Supprimer sélectionnés
            </button>
          </>
        )}
      </div>
      <div className="topbar-right">
        {isAdmin && (
          <>
            <button
              className="btn-generer"
              onClick={handleGenerateVideo}
              disabled={!captures || captures.length === 0}
            >
              Générer la vidéo
            </button>
            <button
              className="btn-devalider"
              onClick={() => {
                if (window.confirm('Voulez-vous supprimer la vidéo générée ?')) {
                  onDevalider();
                }
              }}
              disabled={!selectedMenuId}
            >
              Dévalider la vidéo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;