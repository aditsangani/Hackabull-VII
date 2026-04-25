function MetricCard({ label, value, badge, badgeStyle = 'blue' }) {
  const badgeClass = badgeStyle === 'gray'
    ? 'bg-gray-100 text-gray-800'
    : 'bg-blue-50 text-blue-800'
  return (
    <div className="bg-blue-50 rounded-xl p-4">
      <div className="text-[12px] text-blue-600 mb-1">{label}</div>
      <div className="text-[22px] font-medium text-blue-800 leading-tight">{value}</div>
      {badge && (
        <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full ${badgeClass}`}>{badge}</span>
      )}
    </div>
  )
}

const hourlyData = [
  { h: '10a', pct: 88, level: 'good' },
  { h: '11a', pct: 92, level: 'good' },
  { h: '12p', pct: 75, level: 'warn' },
  { h: '1p',  pct: 40, level: 'bad'  },
  { h: '2p',  pct: 78, level: 'good' },
  { h: '3p',  pct: 88, level: 'good' },
  { h: '4p',  pct: 62, level: 'warn' },
  { h: '5p',  pct: 85, level: 'good' },
]

const barColor = { good: 'bg-blue-600', warn: 'bg-blue-200', bad: 'bg-gray-200' }
const streaks = ['done','done','miss','done','done','active','upcoming','upcoming']

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-[18px] font-medium text-gray-900">Dashboard</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Today, Saturday — Session active for 2h 14m</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <MetricCard label="Posture score" value="84" badge="Good" />
        <MetricCard label="Time in blue zone" value="1h 42m" badge="78%" />
        <MetricCard label="Alerts today" value="3" badge="2 resolved" badgeStyle="gray" />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
        <div>
          <div className="text-[13px] font-medium text-blue-800">Tech neck detected — 8 min ago</div>
          <div className="text-[12px] text-blue-600 mt-0.5">Head angle dropped to 138°. Time for a 30-second shoulder reset.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white border border-blue-100 rounded-xl p-4">
          <div className="text-[14px] font-medium text-gray-900 mb-3">Live detection</div>
          <div className="bg-page rounded-lg h-28 flex flex-col items-center justify-center gap-2 border-2 border-blue-400 relative">
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">LIVE</span>
            <div className="opacity-30 flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full border-2 border-blue-600" />
              <div className="w-12 h-0.5 bg-blue-600" />
              <div className="w-0.5 h-8 bg-blue-600" />
            </div>
            <span className="absolute bottom-2 text-[11px] text-blue-600 font-medium">Landmarks detected</span>
          </div>
          <div className="text-center mt-3">
            <div className="text-[26px] font-medium text-blue-600 font-mono">172°</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Ear → shoulder → hip angle</div>
            <div className="text-[11px] text-blue-500 mt-1">Good posture (threshold: 150°)</div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-xl p-4">
          <div className="text-[14px] font-medium text-gray-900 mb-3">Hourly breakdown</div>
          <div className="flex items-end gap-1 h-20">
            {hourlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end h-full">
                <div className={`w-full rounded-sm ${barColor[d.level]} transition-all`} style={{ height: `${d.pct}%` }} />
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-1">
            {hourlyData.map((d, i) => (
              <div key={i} className="flex-1 text-[10px] text-gray-400 text-center">{d.h}</div>
            ))}
          </div>
          <div className="flex flex-col gap-1 mt-3">
            {[['bg-blue-600','Good (above 165°)'],['bg-blue-200','Warning (150–165°)'],['bg-gray-200','Tech neck (below 150°)']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <div className={`w-2 h-2 rounded-full shrink-0 ${c}`} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-2">Spine streaks</div>
        <div className="text-[11px] text-gray-400 mb-3">50+ min in blue zone per hour earns a block</div>
        <div className="flex gap-1.5 flex-wrap">
          {streaks.map((s, i) => (
            <div key={i} className={`w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-medium
              ${s === 'done' ? 'bg-blue-100 text-blue-800' : ''}
              ${s === 'active' ? 'bg-blue-600 text-white' : ''}
              ${s === 'miss' ? 'bg-gray-100 text-gray-400' : ''}
              ${s === 'upcoming' ? 'border border-dashed border-blue-200 text-gray-300' : ''}
            `}>
              {s === 'done' ? '✓' : s === 'active' ? (i + 1) : s === 'miss' ? '–' : (i + 1)}
            </div>
          ))}
        </div>
        <div className="text-[12px] text-blue-600 font-medium mt-3">Current streak: 2 — Keep it up this hour!</div>
      </div>
    </div>
  )
}
