import { useEffect, useState } from 'react';
import { subscribeToNotifications } from '../api/notify';
import './Notifications.css';

const AUTO_HIDE_MS = 8000;

function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    return subscribeToNotifications(event => {
      setItems(prev => [...prev, event]);
      window.setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== event.id));
      }, AUTO_HIDE_MS);
    });
  }, []);

  function dismiss(id) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="notifications" role="status" aria-live="polite">
      {items.map(item => (
        <div key={item.id} className={`notification notification-${item.type}`}>
          <span>{item.message}</span>
          <button type="button" onClick={() => dismiss(item.id)} aria-label="Fermer">✕</button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
