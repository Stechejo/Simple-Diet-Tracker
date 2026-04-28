import { addDaysISO } from '../utils/date.js';
import { fmt, fmtDateLong, fmtWeight } from '../utils/format.js';
import { deficit, getAvgDeficit, getLatest } from '../utils/calculations.js';

export default function Insights({ entries, targetWeight, targetDeficit, t, lang }) {
  const latest = getLatest(entries);

  if (!latest) {
    return (
      <div className="insight-grid">
        <div className="insight">
          <div className="insight-label">
            {t.insightPlan}
          </div>
          <div className="insight-main">
            -
          </div>
          <div className="insight-sub">
            {t.insightPlanEmpty}
          </div>
        </div>
        <div className="insight">
          <div className="insight-label">
            {t.insightForecast}
          </div>
          <div className="insight-main">
            -
          </div>
          <div className="insight-sub">
            {t.insightForecastEmpty}
          </div>
        </div>
      </div>
    );
  }

  const latestDeficit = deficit(latest);
  const statusClass = targetDeficit > 0 && latestDeficit >= targetDeficit ? 'green' : latestDeficit >= 0 ? 'yellow' : 'red';
  const gap = latestDeficit - targetDeficit;
  const avgDeficit = getAvgDeficit(entries);

  let forecastMain = '-';
  let forecastSub = targetWeight <= 0 ? t.setTargetWeight : t.forecastNoDeficit;
  if (avgDeficit > 0 && targetWeight > 0 && latest.gewicht > targetWeight) {
    const kgLeft = latest.gewicht - targetWeight;
    const daysLeft = Math.ceil((kgLeft * 7000) / avgDeficit);
    forecastMain = fmtDateLong(addDaysISO(latest.date, daysLeft));
    forecastSub = t.forecastSub(fmtWeight(kgLeft), fmtWeight(targetWeight), fmt(avgDeficit));
  }

  return (
    <div className="insight-grid">
      <div className="insight">
        <div className="insight-label">
          {t.insightPlan}
        </div>
        <div className="insight-main">
          <span className="badge">
            <span className={`dot ${statusClass}`}>
            </span>
            {fmt(latestDeficit)} kcal {lang === 'de' ? 'Defizit' : 'deficit'}
          </span>
        </div>
        <div className="insight-sub">
          {targetDeficit > 0 ? (gap >= 0 ? t.kcalOverTarget(fmt(gap)) : t.kcalUnderTarget(fmt(Math.abs(gap)))) : t.setTargetDeficit}
        </div>
      </div>
      <div className="insight">
        <div className="insight-label">
          {t.insightForecast}
        </div>
        <div className="insight-main">
          {forecastMain}
        </div>
        <div className="insight-sub">
          {forecastSub}
        </div>
      </div>
    </div>
  );
}
