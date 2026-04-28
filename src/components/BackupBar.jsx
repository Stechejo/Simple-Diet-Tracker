export default function BackupBar({ t, onExport, onImport }) {
  return (
    <div className="backup-bar">
      <button className="backup-btn" onClick={onExport}>{t.btnExport}</button>
      <label className="backup-btn">
        {t.btnImport}
        <input type="file" accept=".txt" style={{ display: 'none' }} onChange={event => { onImport(event.target.files[0]); event.target.value = ''; }} />
      </label>
    </div>
  );
}
