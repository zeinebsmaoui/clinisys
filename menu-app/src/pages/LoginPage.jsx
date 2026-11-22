import { useState } from 'react';
import { login } from '../api/employeeApi';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password)
      .then(res => {
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        onLogin(res.data);
      })
      .catch(err => {
        if (!err.response) {
          setError("Serveur injoignable. Démarrez le backend (start.cmd) puis réessayez.");
        } else {
          setError('Email ou mot de passe incorrect');
        }
      });
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Connexion</h1>
        <div className="login-field">
          <span>📧</span>
          <input
            type="email"
            placeholder="Nom d'utilisateur (email)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="login-field">
          <span>🔒</span>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="btn-login">SE CONNECTER</button>
      </form>
    </div>
  );
}

export default LoginPage;
