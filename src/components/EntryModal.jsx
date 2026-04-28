import Field from './Field.jsx';
import { isValidISODate } from '../utils/date.js';
import { fmt, fmtWeight, formNum } from '../utils/format.js';

export default function EntryModal({ form, setForm, editing, onClose, onSave, t }) {
  const burned = formNum(form.verbraucht);
  const intake = formNum(form.intake);
  const weight = formNum(form.gewicht);
  const dateOk = isValidISODate(form.date);
  const ok = dateOk && burned > 0 && intake >= 0 && weight > 0;

  return (
    <div className="entry-modal active" aria-hidden="false">
      <div className="entry-backdrop" onClick={onClose}></div>
      <div className="entry-sheet" role="dialog" aria-modal="true">
        <div className="entry-sheet-head">
          <div><div className="entry-kicker">{t.modalKicker}</div><h2>{editing ? t.modalTitleEdit : t.modalTitleNew}</h2></div>
          <button className="entry-close" onClick={onClose} aria-label={t.btnClose}>×</button>
        </div>
        <div className="form">
          <Field label={t.fieldDate}><input type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} /></Field>
          <Field label={t.fieldBurned}><input type="number" placeholder={t.phBurned} min="0" step="1" value={form.verbraucht} onChange={event => setForm({ ...form, verbraucht: event.target.value })} /></Field>
          <Field label={t.fieldIntake}><input type="number" placeholder={t.phIntake} min="0" step="1" value={form.intake} onChange={event => setForm({ ...form, intake: event.target.value })} /></Field>
          <Field label={t.fieldWeight}><input type="number" placeholder={t.phWeight} min="0" step="0.1" inputMode="decimal" value={form.gewicht} onChange={event => setForm({ ...form, gewicht: event.target.value })} /></Field>
          {(ok || (form.date && !dateOk)) && <div className={`preview ${form.date && !dateOk ? 'error' : ''}`} style={{ display: 'block' }}>{form.date && !dateOk ? t.previewDateError : t.previewDeficit(fmt(burned - intake), fmtWeight(weight))}</div>}
          <div className="entry-actions">
            <button className="cancel-btn" onClick={onClose}>{t.btnCancel}</button>
            <button className="add-btn" disabled={!ok} onClick={onSave}>{editing ? t.btnSave : t.btnAddNew}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
