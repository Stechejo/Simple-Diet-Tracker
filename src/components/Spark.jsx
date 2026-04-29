import { avg, deficit, exponentialMovingAverage, groupByMonth, groupByWeek } from '../utils/calculations.js';
import { fmt, fmtDate, fmtDateLong, fmtWeight } from '../utils/format.js';

export default function Spark({ entries, t, lang }) {
  if (entries.length < 2) {
    return (
      <>
        <svg className="spark" viewBox="0 0 320 112">
          <text x="160" y="56" textAnchor="middle" fill="#555" fontSize="10">
            {t.chartNeedMore}
          </text>
        </svg>
        <div className="spark-days" />
      </>
    );
  }

  const days = entries.length;
  let chartEntries;

  if (days > 300) {
    chartEntries = groupByMonth(entries, lang).reverse().map(group => ({
      date: group.key,
      gewicht: avg(group.values.map(e => e.gewicht)),
      verbraucht: avg(group.values.map(e => e.verbraucht)),
      intake: avg(group.values.map(e => e.intake))
    }));
  } else if (days > 60) {
    chartEntries = groupByWeek(entries, t).reverse().map(group => ({
      date: group.key,
      gewicht: avg(group.values.map(e => e.gewicht)),
      verbraucht: avg(group.values.map(e => e.verbraucht)),
      intake: avg(group.values.map(e => e.intake))
    }));
  } else {
    chartEntries = entries;
  }

  const w = 320, h = 112, padX = 32, padTop = 12, padBottom = 24;

  const weights = chartEntries.map(entry => entry.gewicht);
  const trend = exponentialMovingAverage(weights, 0.3);

  const minRaw = Math.min(...weights, ...trend);
  const maxRaw = Math.max(...weights, ...trend);
  const range = Math.max(0.4, maxRaw - minRaw);
  const min = minRaw - range * 0.18;
  const max = maxRaw + range * 0.18;

  const x = index => padX + (index * (w - padX * 2)) / (chartEntries.length - 1);
  const y = value => h - padBottom - ((value - min) * (h - padTop - padBottom)) / (max - min || 1);
  const line = values => values.map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(' ');

  const yTicks = [maxRaw, (minRaw + maxRaw) / 2, minRaw];
  const step = Math.max(1, Math.ceil(chartEntries.length / 8));
  const xTicks = chartEntries.filter((_, index) => index % step === 0 || index === chartEntries.length - 1);
  const last = entries.at(-1);

  return (
    <>
      <svg className="spark" viewBox={`0 0 ${w} ${h}`}>
        {yTicks.map((value, index) => (
          <g key={index}>
            <line x1={padX} y1={y(value)} x2={w - padX} y2={y(value)} className="spark-grid" />
            <text x="4" y={y(value) + 3} className="spark-axis">
              {fmtWeight(value)}
            </text>
          </g>
        ))}

        <polyline points={line(weights)} className="spark-line weight" />
        <polyline points={line(trend)} className="spark-line trend-line" />

        {chartEntries.map((entry, index) => (
          <circle key={entry.date} cx={x(index)} cy={y(entry.gewicht)} r="2.2" className="spark-dot">
            <title>
              {`${fmtDateLong(entry.date)} • ${fmtWeight(entry.gewicht)} kg • ${fmt(deficit(entry))} ${lang === 'de' ? 'kcal Defizit' : 'kcal deficit'}`}
            </title>
          </circle>
        ))}

        <circle cx={x(chartEntries.length - 1)} cy={y(last.gewicht)} r="3.4" className="spark-dot current" />

        <text
          x={Math.min(w - 76, Math.max(padX, x(chartEntries.length - 1) - 34))}
          y={Math.max(12, y(last.gewicht) - 8)}
          className="spark-last"
        >
          {fmtWeight(last.gewicht)} kg
        </text>
      </svg>

      <div className="spark-days">
        {xTicks.map(entry => (
          <span key={entry.date}>{fmtDate(entry.date)}</span>
        ))}
      </div>
    </>
  );
}