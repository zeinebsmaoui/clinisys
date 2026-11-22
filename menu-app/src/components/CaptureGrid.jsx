import { useState } from 'react';
import { reorderCaptures, updateCapture } from '../api/captureApi';
import { notify, apiErrorMessage } from '../api/notify';
import CaptureCard from './CaptureCard';
import CaptureModal from './CaptureModal';
import './CaptureGrid.css';

function CaptureGrid({ captures, setCaptures, onDelete, checkedIds, setCheckedIds, onSaveCapture }) {
  const [selectedId, setSelectedId] = useState(null);
  const [modalCapture, setModalCapture] = useState(null);

  if (captures.length === 0) {
    return <p className="no-captures">Aucune capture pour ce menu.</p>;
  }

  function toggleCheck(id) {
    setCheckedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  function moveCapture(index, direction) {
    const newCaptures = [...captures];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newCaptures.length) return;

    [newCaptures[index], newCaptures[swapIndex]] = [newCaptures[swapIndex], newCaptures[index]];

    setCaptures(newCaptures);
    setSelectedId(newCaptures[swapIndex].id);

    const orderedIds = newCaptures.map(c => c.id);
    reorderCaptures(orderedIds).catch(err => {
      console.error(err);
      notify(apiErrorMessage(err, 'Réorganisation des captures'));
    });
  }

  function handleDownload(capture) {
    const link = document.createElement('a');
    link.href = capture.imageUrl.startsWith('data:')
      ? capture.imageUrl
      : `http://localhost:8080${capture.imageUrl}`;
    link.download = capture.name;
    link.click();
  }

  return (
    <div>
      {modalCapture && (
        <CaptureModal
          capture={modalCapture}
          onClose={() => setModalCapture(null)}
          onDelete={(id) => {
            onDelete([id]);
            setModalCapture(null);
          }}
          onDownload={handleDownload}
          onSave={(updatedCapture) => {
  updateCapture(updatedCapture.id, updatedCapture)
    .then(() => {
      onSaveCapture(updatedCapture);
      setModalCapture(updatedCapture);
    })
    .catch(err => {
      console.error(err);
      notify(apiErrorMessage(err, 'Enregistrement de la capture'));
    });
}}
        />
      )}
      <div className="capture-grid">
        {captures.map((capture, index) => (
          <CaptureCard
            key={capture.id}
            capture={capture}
            isSelected={selectedId === capture.id}
            isChecked={checkedIds.includes(capture.id)}
            onSelect={() => setSelectedId(capture.id)}
            onCheck={() => toggleCheck(capture.id)}
            onDoubleClick={() => setModalCapture(capture)}
            showLeft={index !== 0}
            showRight={index !== captures.length - 1}
            onLeft={() => moveCapture(index, -1)}
            onRight={() => moveCapture(index, 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default CaptureGrid;