import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Zap,
  Layers,
  Database,
  Settings,
  Send,
  FileText,
  Code,
  ChevronRight,
  LogOut,
  Bell,
  Sparkles
} from 'lucide-react';
import './index.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Welcome back. I'm Aura, your high-performance AI assistant. How can I help you accelerate your workflow today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const messagesEndRef = useRef(null);

  const recipes = [
    { id: 'chat', icon: <Bot size={24} />, name: 'General AI', prompt: 'I am your general assistant.' },
    { id: 'speed', icon: <Zap size={24} />, name: 'Deep Reasoning', prompt: 'Think step by step...' },
    { id: 'flow', icon: <Layers size={24} />, name: 'Workflow Builder', prompt: 'Let us build a pipeline.' },
    { id: 'data', icon: <Database size={24} />, name: 'Knowledge Base', prompt: 'Analyzing your context.' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      time: timestamp
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');

    // Mock AI response
    setTimeout(() => {
      const mode = recipes.find(r => r.id === activeTab).name;
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Active Mode: ${mode}. I've processed your input. Here's how we can proceed with "${inputValue}" using advanced reasoning...`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="aura-container">
      {/* Left Wing: Recipe Sidebar */}
      <aside className="recipe-sidebar">
        <div className="recipe-item active" style={{ marginBottom: '12px' }}>
          <div className="glow-text" style={{ fontSize: '24px' }}>A</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {recipes.map((r) => (
            <div
              key={r.id}
              className={`recipe-item ${activeTab === r.id ? 'active' : ''}`}
              onClick={() => setActiveTab(r.id)}
              title={r.name}
            >
              {r.icon}
            </div>
          ))}
        </div>
        <div className="recipe-item"><Settings size={22} /></div>
        <div className="recipe-item"><LogOut size={22} /></div>
      </aside>

      {/* Main Content Area */}
      <main className="main-layout">

        {/* Center: Chat Canvas */}
        <section className="chat-canvas glass-panel" style={{ padding: '24px' }}>
          <header className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
                <Sparkles size={20} className="glow-text" />
              </div>
              <div>
                <h2 className="glow-text" style={{ fontSize: '18px' }}>{recipes.find(r => r.id === activeTab).name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Aura Neural Engine • v4.2</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="recipe-item" style={{ width: '36px', height: '36px' }}><Bell size={18} /></div>
              <div className="recipe-item" style={{ width: '36px', height: '36px', overflow: 'hidden' }}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aura" alt="avatar" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          </header>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-${msg.sender}`} style={{
                display: 'flex',
                gap: '16px',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                animation: 'messageIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div className={`recipe-item ${msg.sender === 'ai' ? 'active' : ''}`} style={{
                  width: '36px',
                  height: '36px',
                  flexShrink: 0,
                  background: msg.sender === 'user' ? 'rgba(255,255,255,0.05)' : undefined
                }}>
                  {msg.sender === 'ai' ? <Bot size={20} /> : <div style={{ width: '20px', height: '20px', background: 'var(--text-secondary)', borderRadius: '50%' }}></div>}
                </div>
                <div style={{ maxWidth: '75%', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  <p style={{ marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', opacity: 0.7 }}>
                    {msg.sender === 'ai' ? 'AURA 01' : 'AUTHORIZED USER'} • {msg.time}
                  </p>
                  <div className="glass-panel" style={{
                    padding: '16px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.1))' : 'rgba(255,255,255,0.03)',
                    borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    border: msg.sender === 'user' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--glass-border)',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-container glass-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 16px' }}>
            <input
              type="text"
              className="chat-input"
              placeholder={`Communicate with ${recipes.find(r => r.id === activeTab).name}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ padding: '12px 0' }}
            />
            <button
              type="submit"
              className="recipe-item active"
              style={{ border: 'none', background: 'var(--accent-purple)', color: 'white', cursor: 'pointer', width: '40px', height: '40px' }}
            >
              <Send size={18} />
            </button>
          </form>
        </section>

        {/* Right Wing: Context Panel */}
        <aside className="side-panel" style={{ gap: '20px' }}>
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-section">
              <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={14} /> Active Context
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['knowledge_base.json', 'system_config.yaml'].map(file => (
                  <div key={file} className="context-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', fontSize: '12px', border: '1px solid var(--glass-border)', transition: 'all 0.2s', cursor: 'pointer' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: file.endsWith('json') ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}></div>
                    <span style={{ flex: 1 }}>{file}</span>
                    <ChevronRight size={14} color="var(--text-secondary)" />
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-section" style={{ flex: 1 }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Neural Extracts</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['#VectorDB', '#SemanticSearch', '#ContextWindow', '#AuraGrid'].map(tag => (
                  <span key={tag} style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', fontSize: '10px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="panel-section" style={{ padding: '20px' }}>
              <button style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-purple), #6366f1)',
                border: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)'
              }}>
                Compute Sync <Zap size={16} />
              </button>
            </div>
          </div>
        </aside>

      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .context-card:hover {
          background: rgba(255,255,255,0.06) !important;
          transform: translateX(4px);
          border-color: rgba(255,255,255,0.15) !important;
        }
        .chat-messages::-webkit-scrollbar {
          width: 5px;
        }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default App;
