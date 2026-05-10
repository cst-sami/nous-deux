import { useState, useEffect, useCallback } from "react";

const API = "/api/data";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #1a1410;
    --parchment: #f5f0e8;
    --warm: #c8a96e;
    --muted: #8a7a68;
    --accent: #8b3a3a;
    --surface: #faf7f2;
    --border: #ddd5c5;
    --locked-bg: #2a2218;
    --locked-text: #c8a96e;
  }

  body { font-family: 'Lato', sans-serif; background: var(--parchment); color: var(--ink); min-height: 100vh; }

  .app { max-width: 480px; margin: 0 auto; min-height: 100vh; background: var(--surface); display: flex; flex-direction: column; border-left: 1px solid var(--border); border-right: 1px solid var(--border); }

  .header { padding: 28px 24px 20px; border-bottom: 1px solid var(--border); text-align: center; background: var(--surface); }
  .header-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--ink); letter-spacing: 0.02em; }
  .header-subtitle { font-size: 12px; color: var(--muted); margin-top: 4px; letter-spacing: 0.08em; text-transform: uppercase; }

  .tabs { display: flex; border-bottom: 1px solid var(--border); background: var(--surface); }
  .tab { flex: 1; padding: 14px 8px; text-align: center; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); cursor: pointer; border: none; background: none; transition: color 0.2s; border-bottom: 2px solid transparent; font-family: 'Lato', sans-serif; }
  .tab.active { color: var(--ink); border-bottom: 2px solid var(--warm); }

  .content { flex: 1; padding: 24px; overflow-y: auto; }

  .lock-banner { border-radius: 10px; padding: 16px 18px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .lock-banner.locked { background: var(--locked-bg); color: var(--locked-text); }
  .lock-banner.unlocked { background: #e8f5e8; color: #3a6b3a; }
  .lock-icon { font-size: 22px; }
  .lock-text { font-size: 13px; line-height: 1.5; }
  .lock-text strong { display: block; font-weight: 600; font-size: 14px; }
  .countdown-text { font-family: 'Playfair Display', serif; font-style: italic; font-size: 13px; color: var(--warm); margin-top: 2px; display: block; }

  .section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 12px; }

  .message-card { background: white; border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 12px; position: relative; overflow: hidden; }
  .message-card.blurred .message-body { filter: blur(7px); user-select: none; pointer-events: none; }
  .message-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .message-author { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
  .message-date { font-size: 11px; color: var(--border); }
  .message-body { font-size: 14px; line-height: 1.7; color: var(--ink); font-weight: 300; }
  .message-tag { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 20px; margin-top: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
  .tag-ressenti { background: #fef3e2; color: #a06020; }
  .tag-besoin { background: #e8eef8; color: #304878; }
  .tag-demande { background: #f0e8f0; color: #5a3a6a; }

  .locked-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
  .locked-pill { background: rgba(250,247,242,0.85); padding: 5px 14px; border-radius: 20px; font-size: 11px; letter-spacing: 0.07em; color: var(--muted); }

  .empty { text-align: center; padding: 36px 20px; color: var(--muted); }
  .empty-icon { font-size: 32px; margin-bottom: 10px; }
  .empty-text { font-size: 13px; line-height: 1.6; }

  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 8px; }
  .form-input, .form-textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 300; color: var(--ink); background: white; outline: none; transition: border-color 0.2s; }
  .form-input:focus, .form-textarea:focus { border-color: var(--warm); }
  .form-textarea { resize: vertical; min-height: 110px; line-height: 1.7; }

  .btn-primary { width: 100%; padding: 14px; background: var(--ink); color: var(--warm); border: none; border-radius: 8px; font-family: 'Lato', sans-serif; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
  .btn-primary:hover { background: #2d2418; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-secondary { width: 100%; padding: 12px; background: transparent; color: var(--muted); border: 1px solid var(--border); border-radius: 8px; font-family: 'Lato', sans-serif; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
  .btn-secondary:hover { border-color: var(--muted); color: var(--ink); }

  .settings-card { background: white; border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 16px; }
  .settings-title { font-family: 'Playfair Display', serif; font-size: 15px; margin-bottom: 14px; color: var(--ink); }
  .settings-hint { font-size: 12px; color: var(--muted); line-height: 1.6; margin-top: 10px; }

  .identity-row { display: flex; gap: 8px; margin-bottom: 16px; }
  .identity-btn { flex: 1; padding: 14px 8px; border-radius: 8px; border: 2px solid var(--border); background: white; cursor: pointer; text-align: center; transition: all 0.2s; font-family: 'Lato', sans-serif; }
  .identity-btn:hover { border-color: var(--warm); }
  .identity-name { display: block; font-size: 15px; margin-bottom: 3px; color: var(--ink); }
  .identity-role { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }

  .divider { height: 1px; background: var(--border); margin: 20px 0; }

  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--warm); padding: 12px 22px; border-radius: 8px; font-size: 13px; letter-spacing: 0.06em; z-index: 999; animation: fadeUp 0.3s ease; white-space: nowrap; }
  @keyframes fadeUp { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-size: 13px; color: var(--muted); letter-spacing: 0.08em; gap: 14px; }
  .sync-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--warm); animation: pulse 1.2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

  .tag-btns { display: flex; gap: 8px; }
  .tag-btn { flex: 1; padding: 10px 6px; border-radius: 8px; border: 2px solid var(--border); background: white; cursor: pointer; font-size: 12px; font-family: 'Lato', sans-serif; transition: all 0.2s; }
  .tag-btn.active { border-color: var(--warm); background: #fdf8ef; }
`;

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) +
    " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function countdown(unlockDate) {
  const diff = new Date(unlockDate) - new Date();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `Dans ${d}j ${h}h`;
  if (h > 0) return `Dans ${h}h ${m}min`;
  return `Dans ${m} minutes`;
}

const TAGS = [
  { value: "ressenti", label: "Ressenti", cls: "tag-ressenti" },
  { value: "besoin", label: "Besoin", cls: "tag-besoin" },
  { value: "demande", label: "Demande", cls: "tag-demande" },
];

function emptyData() {
  return { names: ["", ""], unlockDate: "", messages: [], setupDone: false };
}

export default function App() {
  const [data, setDataState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState(null);
  const [tab, setTab] = useState("messages");
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Load from API
  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(d => setDataState(d && d.setupDone !== undefined ? d : emptyData()))
      .catch(() => setDataState(emptyData()))
      .finally(() => setLoading(false));
  }, []);

  // Poll every 15s
  useEffect(() => {
    if (!data) return;
    const t = setInterval(() => {
      fetch(API)
        .then(r => r.json())
        .then(remote => {
          setDataState(prev => {
            if (!prev) return remote;
            if (remote.messages.length !== prev.messages.length || remote.unlockDate !== prev.unlockDate) return remote;
            return prev;
          });
        })
        .catch(() => {});
    }, 15000);
    return () => clearInterval(t);
  }, [data]);

  const setData = useCallback((updater) => {
    setDataState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) }).catch(() => {});
      return next;
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  if (loading || !data) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading">
          <span className="sync-dot" />
          <span>Connexion…</span>
        </div>
      </>
    );
  }

  const isUnlocked = data.unlockDate && new Date(data.unlockDate) <= now;

  if (!data.setupDone) {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="header">
            <div className="header-title">Nous Deux</div>
            <div className="header-subtitle">Configuration</div>
          </div>
          <div className="content">
            <SetupScreen data={data} setData={setData} showToast={showToast} />
          </div>
          {toast && <div className="toast">{toast}</div>}
        </div>
      </>
    );
  }

  if (identity === null) {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="header">
            <div className="header-title">Nous Deux</div>
            <div className="header-subtitle">Qui êtes-vous ?</div>
          </div>
          <div className="content">
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 22, lineHeight: 1.7 }}>
              Choisissez votre identité à chaque ouverture.
            </p>
            <div className="identity-row">
              {data.names.map((name, i) => (
                <button key={i} className="identity-btn" onClick={() => setIdentity(i)}>
                  <span className="identity-name">{name}</span>
                  <span className="identity-role">Partenaire {i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-title">Nous Deux</div>
          <div className="header-subtitle">{data.names[identity]} · {isUnlocked ? "🔓 Ouvert" : "🔒 Verrouillé"}</div>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === "messages" ? "active" : ""}`} onClick={() => setTab("messages")}>Messages</button>
          <button className={`tab ${tab === "write" ? "active" : ""}`} onClick={() => setTab("write")}>Écrire</button>
          <button className={`tab ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>Réglages</button>
        </div>
        <div className="content">
          {tab === "messages" && <MessagesTab data={data} isUnlocked={isUnlocked} />}
          {tab === "write" && <WriteTab data={data} setData={setData} identity={identity} showToast={showToast} setTab={setTab} />}
          {tab === "settings" && <SettingsTab data={data} setData={setData} setIdentity={setIdentity} showToast={showToast} />}
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

function SetupScreen({ data, setData, showToast }) {
  const [names, setNames] = useState(["", ""]);
  const [unlockDate, setUnlockDate] = useState("");
  const min = new Date(); min.setMinutes(min.getMinutes() + 5);

  const submit = () => {
    if (!names[0].trim() || !names[1].trim()) { showToast("Entrez vos deux prénoms"); return; }
    if (!unlockDate) { showToast("Choisissez une date de discussion"); return; }
    setData({ ...data, names: [names[0].trim(), names[1].trim()], unlockDate, setupDone: true });
  };

  return (
    <>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, lineHeight: 1.7 }}>
        Votre espace privé pour poser vos ressentis. Ils ne se révèlent qu'au moment où vous choisissez de vous asseoir ensemble.
      </p>
      <div className="form-group">
        <label className="form-label">Prénom — Partenaire 1</label>
        <input className="form-input" value={names[0]} onChange={e => setNames([e.target.value, names[1]])}
          placeholder="Rim, la femme dont rêve un homme" />
      </div>
      <div className="form-group">
        <label className="form-label">Prénom — Partenaire 2</label>
        <input className="form-input" value={names[1]} onChange={e => setNames([names[0], e.target.value])}
          placeholder="Sami, l'amour de ta vie" />
      </div>
      <div className="divider" />
      <div className="form-group">
        <label className="form-label">Date de votre prochaine discussion</label>
        <input className="form-input" type="datetime-local" min={min.toISOString().slice(0, 16)} value={unlockDate}
          onChange={e => setUnlockDate(e.target.value)} />
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
          Les messages se déverrouilleront à cette date pour vous deux, depuis n'importe quel appareil.
        </p>
      </div>
      <button className="btn-primary" onClick={submit}>Créer notre espace</button>
    </>
  );
}

function MessagesTab({ data, isUnlocked }) {
  const cd = data.unlockDate ? countdown(data.unlockDate) : null;

  return (
    <>
      <div className={`lock-banner ${isUnlocked ? "unlocked" : "locked"}`}>
        <span className="lock-icon">{isUnlocked ? "🔓" : "🔒"}</span>
        <div className="lock-text">
          {isUnlocked
            ? <><strong>Espace ouvert</strong>Lisez ensemble, à voix haute si vous pouvez.</>
            : <><strong>Messages verrouillés</strong>
                {cd ? <span className="countdown-text">{cd}</span> : <span>Ouverture le {formatDate(data.unlockDate)}</span>}
              </>
          }
        </div>
      </div>

      {data.names.map((name, i) => {
        const msgs = data.messages.filter(m => m.authorIdx === i);
        return (
          <div key={i} style={{ marginBottom: 28 }}>
            <div className="section-label">{name} · {msgs.length} message{msgs.length !== 1 ? "s" : ""}</div>
            {msgs.length === 0
              ? <div className="empty"><div className="empty-icon">✦</div><div className="empty-text">Pas encore de message</div></div>
              : msgs.map(msg => {
                  const tag = TAGS.find(t => t.value === msg.tag);
                  return (
                    <div key={msg.id} className={`message-card ${!isUnlocked ? "blurred" : ""}`}>
                      <div className="message-meta">
                        <span className="message-author">{data.names[msg.authorIdx]}</span>
                        <span className="message-date">{new Date(msg.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="message-body">{msg.text}</div>
                      {tag && <span className={`message-tag ${tag.cls}`}>{tag.label}</span>}
                      {!isUnlocked && (
                        <div className="locked-overlay">
                          <span className="locked-pill">🔒 {formatDate(data.unlockDate)}</span>
                        </div>
                      )}
                    </div>
                  );
                })
            }
          </div>
        );
      })}

      {data.messages.length === 0 && (
        <div className="empty" style={{ marginTop: 10 }}>
          <div className="empty-icon">🪴</div>
          <div className="empty-text">Commencez par écrire ce qui vous pèse.<br />L'autre ne le lira qu'à votre rendez-vous.</div>
        </div>
      )}
    </>
  );
}

function WriteTab({ data, setData, identity, showToast, setTab }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("ressenti");

  const submit = () => {
    if (!text.trim()) { showToast("Écrivez quelque chose d'abord"); return; }
    const msg = { id: Date.now(), authorIdx: identity, text: text.trim(), tag, createdAt: new Date().toISOString() };
    setData(d => ({ ...d, messages: [...d.messages, msg] }));
    setText(""); setTag("ressenti");
    showToast("Message enregistré ✓");
    setTab("messages");
  };

  return (
    <>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
        Écrivez sans filtre. {data.names[identity === 0 ? 1 : 0]} ne lira ceci que lors de votre discussion.
      </p>
      <div className="form-group">
        <label className="form-label">Type</label>
        <div className="tag-btns">
          {TAGS.map(t => (
            <button key={t.value} className={`tag-btn ${tag === t.value ? "active" : ""}`} onClick={() => setTag(t.value)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Votre message</label>
        <textarea className="form-textarea" value={text} onChange={e => setText(e.target.value)}
          placeholder="Ex : Quand tu fais X, je ressens Y… J'aurais besoin de…" />
      </div>
      <button className="btn-primary" onClick={submit} disabled={!text.trim()}>Enregistrer</button>
    </>
  );
}

function SettingsTab({ data, setData, setIdentity, showToast }) {
  const [newDate, setNewDate] = useState(data.unlockDate || "");
  const min = new Date(); min.setMinutes(min.getMinutes() + 1);

  const saveDate = () => {
    if (!newDate) { showToast("Choisissez une date"); return; }
    setData(d => ({ ...d, unlockDate: newDate }));
    showToast("Date mise à jour ✓");
  };

  const resetMessages = () => {
    if (window.confirm("Supprimer tous les messages ? Cette action est définitive.")) {
      setData(d => ({ ...d, messages: [] }));
      showToast("Messages supprimés");
    }
  };

  const resetAll = () => {
    if (window.confirm("Tout réinitialiser ? Vous devrez reconfigurer l'app.")) {
      setData(emptyData());
      setIdentity(null);
    }
  };

  function emptyData() {
    return { names: ["", ""], unlockDate: "", messages: [], setupDone: false };
  }

  return (
    <>
      <div className="settings-card">
        <div className="settings-title">Prochaine discussion</div>
        <input className="form-input" type="datetime-local" min={min.toISOString().slice(0, 16)} value={newDate}
          onChange={e => setNewDate(e.target.value)} />
        <p className="settings-hint">Repoussez la date ensemble si besoin.</p>
        <button className="btn-primary" style={{ marginTop: 14 }} onClick={saveDate}>Mettre à jour</button>
      </div>
      <div className="settings-card">
        <div className="settings-title">Session</div>
        <button className="btn-secondary" onClick={() => setIdentity(null)}>Changer d'identité</button>
      </div>
      <div className="settings-card" style={{ borderColor: "#f0d0d0" }}>
        <div className="settings-title" style={{ color: "var(--accent)" }}>Zone dangereuse</div>
        <button className="btn-secondary" style={{ borderColor: "#e0b0b0", color: "var(--accent)" }} onClick={resetMessages}>
          Effacer tous les messages
        </button>
        <button className="btn-secondary" style={{ borderColor: "#e0b0b0", color: "var(--accent)" }} onClick={resetAll}>
          Tout réinitialiser
        </button>
      </div>
    </>
  );
}
