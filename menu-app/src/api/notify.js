// Petit bus d'evenements pour remonter les erreurs API a l'utilisateur.
// Sans cela, un echec reseau (backend arrete) etait seulement ecrit dans la
// console : l'interface donnait l'impression que l'action avait reussi.

const listeners = new Set();

export function subscribeToNotifications(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notify(message, type = 'error') {
  const event = { id: `${Date.now()}-${Math.random()}`, message, type };
  listeners.forEach(listener => listener(event));
}

export function apiErrorMessage(error, action) {
  if (!error || !error.response) {
    return `${action} : serveur injoignable. Le backend est-il demarre (start.cmd) ?`;
  }

  const status = error.response.status;
  if (status === 401) return `${action} : non autorise (401).`;
  if (status === 403) return `${action} : action interdite (403).`;
  if (status === 413) return `${action} : fichier trop volumineux (413).`;
  if (status >= 500) return `${action} : erreur du serveur (${status}).`;
  return `${action} : echec (${status}).`;
}
