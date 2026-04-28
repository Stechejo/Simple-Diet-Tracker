import { deficit } from '../utils/calculations.js';
import { fmt, fmtDate, fmtWeight } from '../utils/format.js';

export default function OverviewPage({ entries, total, showAll, setShowAll, editEntry, deleteEntry, targetDeficit, t }) {
  const label = showAll ? t.tableAll(total) : `${t.tableLatest(Math.min(7, total))} ${total} ${total === 1 ? 'Eintrag' : 'Einträgen'}`;

  return (
    <div className="panel active">
      <div className="table-toolbar">
        <span>
          {label}
        </span>
        <button className={`period-mode ${!showAll ? 'active' : ''}`} onClick={() => setShowAll(false)}>
          {t.btnLatest7}
        </button>
        <button className={`period-mode ${showAll ? 'active' : ''}`} onClick={() => setShowAll(true)}>
          {t.btnAll}
        </button>
      </div>
      <div className="table-head">
        <span>
          {t.thDay}
        </span>
        <span>
          {t.thDate}
        </span>
        <span>
          {t.thBurned}
        </span>
        <span>
          {t.thIntake}
        </span>
        <span>
          {t.thDeficit}
        </span>
        <span>
          {t.thWeight}
        </span>
        <span>
        </span>
      </div>
      <div className={showAll && total > 12 ? 'table-scroll' : ''}>
        {!entries.length ?
          <div className="empty-state">
            {t.noEntries}
          </div>
          : [...entries].reverse().map(entry => {
            const currentDeficit = deficit(entry);
            const statusClass = targetDeficit > 0 && currentDeficit >= targetDeficit ? 'green' : currentDeficit >= 0 ? 'yellow' : 'red';
            return (
              <div className="row" key={entry.date}>
                <span>
                  {entry.tag}
                </span>
                <span>
                  {fmtDate(entry.date)}
                </span>
                <span>
                  {fmt(entry.verbraucht)}
                </span>
                <span>
                  {fmt(entry.intake)}
                </span>
                <span className={statusClass}>{fmt(currentDeficit)}
                </span>
                <span className="w-val">{fmtWeight(entry.gewicht)}
                </span>
                <span className="actions">
                  <button className="mini-btn" onClick={() => editEntry(entry.date)}>
                    {t.btnEdit}
                  </button>
                  <button className="del" onClick={() => deleteEntry(entry.date)}>
                    x
                  </button>
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
