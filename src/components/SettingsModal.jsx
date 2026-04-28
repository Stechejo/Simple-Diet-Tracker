import Field from './Field.jsx';

export default function SettingsModal({ settings, setSettings, onClose, onSave, t }) {
  return (
    <div className="entry-modal active" aria-hidden="false">
      <div className="entry-backdrop" onClick={onClose}></div>
      <div className="entry-sheet" role="dialog" aria-modal="true">
        <div className="entry-sheet-head">
          <div>
            <div className="entry-kicker">
              Setup
            </div>
            <h2>
              {t.settingsTitle}
            </h2>
          </div>
          <button className="entry-close" onClick={onClose} aria-label={t.btnClose}>
            x
          </button>
        </div>
        <div className="form">
          <Field label={t.settingsStart}>
            <input type="number" placeholder="z.B. 91,4" min="0" step="0.1" inputMode="decimal" value={settings.startWeight} onChange={event => setSettings({ ...settings, startWeight: event.target.value })} />
          </Field>
          <Field label={t.settingsTarget}>
            <input type="number" placeholder="z.B. 85" min="0" step="0.1" inputMode="decimal" value={settings.targetWeight} onChange={event => setSettings({ ...settings, targetWeight: event.target.value })} />
          </Field>
          <Field label={t.settingsDeficit}>
            <input type="number" placeholder="z.B. 500" min="0" step="50" value={settings.targetDeficit} onChange={event => setSettings({ ...settings, targetDeficit: event.target.value })} />
          </Field>
          <div className="entry-actions">
            <button className="cancel-btn" onClick={onClose}>
              {t.btnCancel}
            </button>
            <button className="add-btn" onClick={onSave}>
              {t.btnSaveSettings}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
