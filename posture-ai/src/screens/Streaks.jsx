const streakBlocks = ['done','done','miss','done','done','active','upcoming','upcoming']
const weekData = [
  { d:'Mon', score:75 }, { d:'Tue', score:68 }, { d:'Wed', score:82 },
  { d:'Thu', score:55 }, { d:'Fri', score:90 }, { d:'Sat', score:84 }, { d:'Sun', score:0 },
]
const achievements = [
  { name:'First calibration', sub:'Set your baseline', unlocked:true },
  { name:'5-block day',       sub:'Earned today',      unlocked:true },
  { name:'10-block day',      sub:'5 blocks away',     unlocked:false },
  { name:'7-day streak',      sub:'Keep it up',        unlocked:false },
]
const leaderboard = [
  { rank:1, initials:'AS', name:'You',       score:47, you:true },
  { rank:2, initials:'MK', name:'Marcus K.', score:39, you:false },
  { rank:3, initials:'JL', name:'Jasmine L.',score:31, you:false },
]

export default function Streaks() {
  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-[18px] font-medium text-gray-900">Streaks</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">50+ min in the blue zone per hour earns a block</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label:'Current streak', value:'5',  badge:'Hours today' },
          { label:'Best streak',    value:'12', badge:'Last Wednesday' },
          { label:'Total blocks',   value:'47', badge:'This week' },
        ].map(m => (
          <div key={m.label} className="bg-blue-50 rounded-xl p-4">
            <div className="text-[12px] text-blue-600 mb-1">{m.label}</div>
            <div className="text-[22px] font-medium text-blue-800">{m.value}</div>
            <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">{m.badge}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">Today's spine streak — Saturday</div>
        <div className="grid grid-cols-8 gap-1.5">
          {streakBlocks.map((s, i) => (
            <div key={i} className={`h-8 rounded-md flex items-center justify-center text-[11px] font-medium
              ${s === 'done'     ? 'bg-blue-100 text-blue-800' : ''}
              ${s === 'active'   ? 'bg-blue-600 text-white' : ''}
              ${s === 'miss'     ? 'bg-gray-100 text-gray-400' : ''}
              ${s === 'upcoming' ? 'border border-dashed border-blue-200 text-gray-300' : ''}
            `}>
              {s === 'done' ? '✓' : s === 'miss' ? '–' : i + 1}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          {[['bg-blue-100','Earned'],['bg-blue-600','Current'],['border border-dashed border-blue-200 bg-white','Upcoming']].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <div className={`w-3 h-3 rounded-sm ${c}`} />{l}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">Achievements</div>
        <div className="grid grid-cols-4 gap-2">
          {achievements.map(a => (
            <div key={a.name} className={`bg-page rounded-lg p-3 flex flex-col items-center gap-1.5 text-center ${!a.unlocked ? 'opacity-40' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${a.unlocked ? 'bg-blue-50' : 'bg-gray-100'}`}>
                {a.unlocked
                  ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l1.8 3.6L15 6.5l-3 2.9.7 4.1L9 11.4l-3.7 2.1.7-4.1L3 6.5l4.2-.9L9 2z" stroke="#185FA5" strokeWidth="1.2" strokeLinejoin="round" fill="#E6F1FB"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="4" y="8" width="10" height="7" rx="2" stroke="#888780" strokeWidth="1.2"/><path d="M6 8V6a3 3 0 116 0v2" stroke="#888780" strokeWidth="1.2"/></svg>
                }
              </div>
              <div className="text-[12px] font-medium text-gray-900">{a.name}</div>
              <div className="text-[11px] text-gray-400">{a.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">This week's leaderboard</div>
        <div className="flex flex-col gap-1">
          {leaderboard.map(p => (
            <div key={p.name} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${p.you ? 'bg-blue-50' : ''}`}>
              <span className={`text-[13px] font-medium w-5 ${p.you ? 'text-blue-600' : 'text-gray-400'}`}>{p.rank}</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium ${p.you ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{p.initials}</div>
              <span className={`flex-1 text-[13px] ${p.you ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{p.name}</span>
              <span className={`text-[13px] font-medium ${p.you ? 'text-blue-600' : 'text-gray-400'}`}>{p.score} blocks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
