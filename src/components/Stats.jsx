import Stat from './Stat.jsx';
import { fmt, fmtWeight } from '../utils/format.js';
import { getAvgDeficit, getLatest, trendWeight } from '../utils/calculations.js';

export default function Stats({ entries, startWeight, t }) {
  const latest = getLatest(entries);
  const trend = trendWeight(entries);
  const baseline = startWeight > 0 ? startWeight : (entries[0]?.gewicht || 0);

  return (
    <section className="stats">
      <Stat label={t.statLost} value={latest && baseline > 0 ? `${fmtWeight(baseline - latest.gewicht)} kg` : '-'} />
      <Stat label={t.statDeficit} value={entries.length ? fmt(getAvgDeficit(entries)) : '-'} />
      <Stat label={t.statTrend} value={trend ? `${fmtWeight(trend)} kg` : '-'} />
      <Stat label={t.statToday} value={latest ? `${fmtWeight(latest.gewicht)} kg` : '-'} />
    </section>
  );
}
