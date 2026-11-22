import { useState, useRef, useEffect } from 'react';
import { notify, apiErrorMessage } from '../api/notify';
import './CaptureEditor.css';


function CaptureEditor({ capture, onClose, onSave }) {
  const canvasRef = useRef(null);
  const [description, setDescription] = useState(capture.description || '');
  const [selectedAction, setSelectedAction] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [selection, setSelection] = useState(null);
  const [history, setHistory] = useState([]);
  const imageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = capture.imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      imageRef.current = img;
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };
  }, [capture.imageUrl]);

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function handleMouseDown(e) {
    if (!selectedAction) return;
    const pos = getPos(e);
    setStartPos(pos);
    setIsDrawing(true);
    setSelection(null);
  }

  function handleMouseMove(e) {
    if (!isDrawing || !startPos) return;
    const pos = getPos(e);
    const newSelection = {
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      w: Math.abs(pos.x - startPos.x),
      h: Math.abs(pos.y - startPos.y),
    };
    setSelection(newSelection);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const last = history[history.length - 1];
    ctx.putImageData(last, 0, 0);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(newSelection.x, newSelection.y, newSelection.w, newSelection.h);
    ctx.setLineDash([]);
  }

  function handleMouseUp() {
    if (!isDrawing || !selection || !selectedAction) return;
    setIsDrawing(false);
    applyAction(selectedAction, selection);
  }

  function applyAction(action, sel) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const last = history[history.length - 1];
    ctx.putImageData(last, 0, 0);

    const { x, y, w, h } = sel;

    if (action === 'flou') {
      ctx.filter = 'blur(8px)';
      ctx.drawImage(canvas, x, y, w, h, x, y, w, h);
      ctx.filter = 'none';
    } else if (action === 'rectangle') {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
    } else if (action === 'focus') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(x, y, w, h);
      ctx.drawImage(imageRef.current, x, y, w, h, x, y, w, h);
    } else if (action === 'curseur_statique') {
      const cx = x + w / 2;
      const cy = y + h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0,0,255,0.5)';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (action === 'curseur_blanc') {
      const cx = x + w / 2;
      const cy = y + h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (action === 'curseur_click') {
      const cx = x + w / 2;
      const cy = y + h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,0,0,0.5)';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    setHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    setSelection(null);
  }

  function annuler() {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newHistory = history.slice(0, -1);
    ctx.putImageData(newHistory[newHistory.length - 1], 0, 0);
    setHistory(newHistory);
    setSelection(null);
  }

 function handleSave() {
  const canvas = canvasRef.current;
  const base64 = canvas.toDataURL('image/png');

  fetch(`http://localhost:8080/api/captures/${capture.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description,
      name: capture.name,
      menu: capture.menu,
      imageUrl: base64,
      position: capture.position,
    }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(final => {
      onSave({ ...final, imageUrl: base64, description });
      onClose();
    })
    .catch(err => {
      console.error(err);
      if (!err?.response) {
        notify('Enregistrement de la capture : serveur injoignable. Le backend est-il demarre (start.cmd) ?');
      } else {
        notify(apiErrorMessage(err, 'Enregistrement de la capture'));
      }
    });
}

  const actions = [
    { key: 'flou', label: 'Flou' },
    { key: 'curseur_statique', label: 'Curseur statique' },
    { key: 'curseur_blanc', label: 'Curseur statique blanc' },
    { key: 'curseur_click', label: 'Curseur click' },
    { key: 'focus', label: 'Focus' },
    { key: 'rectangle', label: 'Rectangle' },
  ];

  return (
    <div className="editor-overlay">
      <div className="editor-container">
        <div className="editor-topbar">
          <h3>Visualisation de la Vidéo</h3>
          <div className="editor-topbar-buttons">
            <button className="btn-sauvegarder" onClick={handleSave}>Sauvegarder</button>
            <button className="btn-fermer" onClick={onClose}>Fermer</button>
          </div>
        </div>

        <div className="editor-body">
          <div className="editor-left">
            <div className="editor-canvas-container">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                  cursor: selectedAction ? 'crosshair' : 'default',
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>
            {selectedAction && (
              <p style={{ fontSize: 13, color: '#2563eb', marginTop: 8 }}>
                Action sélectionnée: <strong>{actions.find(a => a.key === selectedAction)?.label}</strong> — Dessinez sur l'image
              </p>
            )}
            <div className="editor-description">
              <label>Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Ajouter une description..."
              />
            </div>
          </div>

          <div className="editor-right">
            <h4>Actions</h4>
            {actions.map(action => (
              <button
                key={action.key}
                className={`btn-action ${selectedAction === action.key ? 'btn-action-selected' : ''}`}
                onClick={() => setSelectedAction(selectedAction === action.key ? null : action.key)}
              >
                {action.label}
              </button>
            ))}
            <button className="btn-action btn-annuler" onClick={annuler}>Annuler</button>

            <h4 style={{ marginTop: '20px' }}>Remplacer l'image</h4>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="replaceFile"
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const img = new Image();
                img.onload = () => {
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext('2d');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage(img, 0, 0);
                  imageRef.current = img;
                  setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
                };
                img.src = URL.createObjectURL(file);
              }}
            />
            <label htmlFor="replaceFile" className="btn-choose-file">Choisir un fichier</label>
            <p className="replace-hint">Sélectionnez une nouvelle image si nécessaire.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptureEditor;