import fs from 'node:fs';
const keys = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift'];
const median = values => [...values].sort((a,b) => a-b)[Math.floor(values.length / 2)];
const summary = {};
for (const mode of ['before', 'after']) {
  const runs = [1,2,3].map(i => {
    const r = JSON.parse(fs.readFileSync(`reports/lighthouse/${mode}-${i}.report.json`));
    if (r.runtimeError) throw new Error(JSON.stringify(r.runtimeError));
    return { time: r.fetchTime, lighthouse: r.lighthouseVersion, browser: r.environment.hostUserAgent, settings:r.configSettings,
      score: r.categories.performance.score * 100, ...Object.fromEntries(keys.map(k => [k,r.audits[k].numericValue])) };
  });
  summary[mode] = { runs, median: Object.fromEntries(['score', ...keys].map(k => [k, median(runs.map(r => r[k]))])) };
}
fs.writeFileSync('reports/lighthouse/summary.json', JSON.stringify(summary, null, 2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(summary).map(([k,v]) => [k,v.median])), null, 2));
