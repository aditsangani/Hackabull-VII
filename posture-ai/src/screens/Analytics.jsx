const todayData = [
  { h:'10a', pct:88, l:'good' }, { h:'11a', pct:92, l:'good' },
  { h:'12p', pct:85, l:'good' }, { h:'1p',  pct:80, l:'good' },
  { h:'2p',  pct:72, l:'warn' }, { h:'3p',  pct:55, l:'warn' },
  { h:'4p',  pct:38, l:'bad'  }, { h:'5p',  pct:42, l:'bad'  },
  { h:'6p',  pct:65, l:'warn' }, { h:'7p',  pct:78, l:'good' },
  { h:'8p',  pct:84, l:'good' }, { h:'9p',  pct:87, l:'good' },
]
const weekData = [
  { d:'Mon', score:75, l:'good' }, { d:'Tue', score:68, l:'warn' },
  { d:'Wed', score:82, l:'good' }, { d:'Thu', score:55, l:'warn' },
  { d:'Fri', score:90, l:'good' }, { d:'Sat', score:84, l:'good' },
  { d:'Sun', score:0,  l:'none' },
]
const barColor = { good:'bg-blue-600', warn:'bg-blue-200', bad:'bg-gray-200', none:'bg-gray-100' }
const scoreColor = { good:'text-blue-800', warn:'text-blue-500', none:'text-gray-300' }

export default function Analytics() {
  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-[18px] font-medium text-gray-900">Analytics</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Postural fatigue patterns — last 7 days</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label:'Avg daily score', value:'81', badge:'+6 vs last week', style:'blue' },
          { label:'Worst hour',      value:'2:00 PM', badge:'Every day this week', style:'gray' },
          { label:'Total alerts',    value:'18', badge:'Down from 27', style:'blue' },
        ].map(m => (
          <div key={m.label} className="bg-blue-50 rounded-xl p-4">
            <div className="text-[12px] text-blue-600 mb-1">{m.label}</div>
            <div className="text-[22px] font-medium text-blue-800 leading-tight">{m.value}</div>
            <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full ${m.style === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{m.badge}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">Today's postural fatigue curve</div>
        <div className="flex items-end gap-1 h-28">
          {todayData.map((d, i) => (
            <div key={i} className="flex-1 h-full flex flex-col justify-end">
              <div className={`w-full rounded-sm ${barColor[d.l]}`} style={{ height: `${d.pct}%` }} />
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {todayData.map((d, i) => (
            <div key={i} className="flex-1 text-[10px] text-gray-400 text-center">{d.h}</div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="text-[12px] font-medium text-blue-800">Pattern detected: 2–4 PM fatigue window</div>
          <div className="text-[11px] text-blue-600 mt-1">You slouch consistently in the early afternoon. Try a 5-min walk break at 1:45 PM.</div>
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">Weekly overview</div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekData.map(d => (
            <div key={d.d} className="flex flex-col items-center gap-1">
              <div className="text-[10px] text-gray-400">{d.d}</div>
              <div className="h-14 w-full flex items-end">
                <div className={`w-full rounded-sm ${barColor[d.l]}`} style={{ height: d.score ? `${d.score}%` : '15%' }} />
              </div>
              <div className={`text-[11px] font-medium ${scoreColor[d.l]}`}>{d.score || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { val:'Friday',  sub:'Best day this week' },
          { val:'3.2 hrs', sub:'Avg blue zone daily' },
          { val:'12 min',  sub:'Avg slouch duration' },
        ].map(c => (
          <div key={c.sub} className="bg-blue-50 rounded-xl p-4">
            <div className="text-[16px] font-medium text-blue-800">{c.val}</div>
            <div className="text-[12px] text-blue-500 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
