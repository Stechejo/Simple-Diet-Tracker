function getLatest(entries) {
    return entries.length ? entries[entries.length - 1] : null;
}

function getAvgDeficit(entries) {
    return entries.length
        ? Math.round(entries.reduce((s, e) => s + deficit(e), 0) / entries.length)
        : 0;
}

function getCompliance(entries, targetDeficit) {
    if (!entries.length || targetDeficit <= 0) return 0;
    const onPlan = entries.filter(e => deficit(e) >= targetDeficit).length;
    return Math.round((onPlan / entries.length) * 100);
}

function getDeficitGap(entries, targetDeficit) {
    return getAvgDeficit(entries) - targetDeficit;
}

function getPlateauStatus(entries) {
    if (entries.length < 7) return null;

    const last = entries.slice(-7);
    const weights = last.map(e => e.gewicht);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const change = last.at(-1).gewicht - last[0].gewicht;

    if ((max - min) <= 0.3 && Math.abs(change) <= 0.2) {
        return {
            label: T('plateauLabel'),
            detail: T('plateauDetail')(fmtWeight(min), fmtWeight(max))
        };
    }

    return {
        label: change < 0 ? T('trendFalling') : T('trendStable'),
        detail: T('trendDetail')((change >= 0 ? '+' : '') + fmtWeight(change))
    };
}
