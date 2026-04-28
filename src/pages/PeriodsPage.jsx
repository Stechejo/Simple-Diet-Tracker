import { getAvgDeficit, groupByMonth, groupByWeek } from '../utils/calculations.js';
import { fmt, fmtWeight } from '../utils/format.js';

export default function PeriodsPage({ entries, mode, setMode, t, lang }) {
  const groups = mode === 'months' ? groupByMonth(entries, lang) : groupByWeek(entries, t);

  return (
    <div className="panel active">
      <div className="period-toolbar">
        <button className={`period-mode ${mode === 'weeks' ? 'active' : ''}`} onClick={() => setMode('weeks')}>{t.btnWeeks}</button>
        <button className={`period-mode ${mode === 'months' ? 'active' : ''}`} onClick={() => setMode('months')}>{t.btnMonths}</button>
        <span>{mode === 'months' ? t.periodHintMonths(groups.length) : t.periodHintWeeks(groups.length)}</span>
      </div>
      <div className="period-grid">
        {!groups.length ? <div className="empty-state">{t.noEntriesRange}</div> : groups.map(group => {
          const start = group.values[0];
          const end = group.values.at(-1);
          const avgDeficit = getAvgDeficit(group.values);
          const change = end.gewicht - start.gewicht;
          return (
            <div className="period-card" key={group.key}>
              <div className="period-title">{group.title}</div>
              <div className="period-line"><span>{t.periodEntries}</span><strong>{group.values.length}</strong></div>
              <div className="period-line"><span>{t.periodAvgDeficit}</span><strong>{fmt(avgDeficit)} kcal</strong></div>
              <div className="period-line"><span>{t.periodWeight}</span><strong>{fmtWeight(start.gewicht)} → {fmtWeight(end.gewicht)} kg</strong></div>
              <div className="period-line"><span>{t.periodChange}</span><strong className={change <= 0 ? 'green' : 'yellow'}>{change >= 0 ? '+' : ''}{fmtWeight(change)} kg</strong></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
