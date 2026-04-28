import Spark from './Spark.jsx';

const ranges = [7, 14, 30, 90, 180, 365];

export default function RangeChart({ entries, range, setRange, t, lang }) {
  return (
    <section className="chart-box">
      <div className="chart-head">
        <div className="chart-label">
          {t.chartLabel}
        </div>
        <div className="legend">
          <span>
            {t.legendWeight}
          </span>
          <span className="trend">{t.legendTrend}
          </span>
        </div>
        <select className="range-select" value={range} onChange={event => setRange(Number(event.target.value))}>
          {ranges.map(days => <option key={days} value={days}>{t[`range${days}`]}</option>)}
        </select>
      </div>
      <Spark entries={entries} t={t} lang={lang} />
    </section>
  );
}
