export default function Header({ t, headerSub, onOpenSettings, onToggleLang }) {
  return (
    <header>
      <div className="header-inner">
        <div>
          <h1>{t.appTitle}</h1>
          <p>{headerSub}</p>
        </div>
        <div className="header-actions">
          <button className="lang-btn" onClick={onOpenSettings}>{t.settings}</button>
          <button className="lang-btn" onClick={onToggleLang}>{t.langToggle}</button>
        </div>
      </div>
    </header>
  );
}
