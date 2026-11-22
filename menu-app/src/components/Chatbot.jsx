import { useState } from 'react';
import { getAllCaptures } from '../api/captureApi';
import { getAllModules } from '../api/moduleApi';
import './Chatbot.css';

// La cle est lue depuis menu-app/.env (fichier non versionne).
// Voir .env.example pour le modele.
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour! Comment puis-je vous aider?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 1) Search the app captures (name, description, module, menu)
      //    only in modules the current user is allowed to see
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      const [capRes, modRes] = await Promise.all([
        getAllCaptures(),
        getAllModules(currentUser?.id),
      ]);
      const allowedModuleIds = new Set(modRes.data.map(m => m.id));
      const captures = capRes.data.filter(c => allowedModuleIds.has(c.menu?.module?.id));
      const q = input.toLowerCase();
      const matches = captures.filter(c => {
        const hay = [c.name, c.description, c.menu?.name, c.menu?.module?.name]
          .filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q) || q.split(' ').some(w => w.length > 3 && hay.includes(w));
      });

      if (matches.length > 0) {
        const lines = matches.slice(0, 5).map(c =>
          `• ${c.name} → Module "${c.menu?.module?.name || '?'}" → Menu "${c.menu?.name || '?'}"${c.description ? `\n   Description : ${c.description}` : ''}`
        );
        const reply = `J'ai trouvé ${matches.length} capture(s) correspondante(s) :\n\n${lines.join('\n\n')}\n\n${matches.length > 5 ? `...et ${matches.length - 5} autre(s).` : ''}`;
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        setLoading(false);
        return;
      }

      // 2) Otherwise, ask the AI
      const apiMessages = [...messages, userMessage].filter(
        (m, i) => !(i === 0 && m.role === 'assistant')
      );

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: `Tu es un assistant virtuel intégré dans une application de gestion médicale. 
L'application permet de:
- Gérer des modules (Module 1, Module 2, etc.)
- Chaque module contient des menus et sous-menus (ex: Liste des patients, Feuille de soins, Entête feuille de soin, etc.)
- Chaque menu peut contenir des captures d'écran (images)
- Les captures peuvent être annotées avec des outils: Flou, Rectangle, Focus, Curseur
- On peut générer une vidéo GIF à partir des captures d'un menu
- L'application est construite avec Spring Boot (backend), React (frontend) et MySQL (base de données)
Réponds toujours en français et aide l'utilisateur avec des questions sur l'application ou des questions générales.` },
            ...apiMessages,
          ],
          max_tokens: 1024,
        }),
      });

      const data = await response.json();
      console.log('Groq response:', data);
      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Assistant IA</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="chatbot-message assistant">...</div>}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Écrivez votre message..."
            />
            <button onClick={sendMessage} disabled={loading}>Envoyer</button>
          </div>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>
    </div>
  );
}

export default Chatbot;