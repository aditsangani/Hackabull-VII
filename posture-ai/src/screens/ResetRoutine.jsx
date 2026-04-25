import { useState, useEffect } from 'react'

const exercises = [
  { name:'Chin tuck',        desc:'Draw chin straight back, hold for 2 seconds. Repeat 3x.',  duration:10 },
  { name:'Shoulder roll',    desc:'Roll shoulders backward in slow circles. 5 full rotations.', duration:10 },
  { name:'Neck side stretch',desc:'Tilt head to each side, hold 3 seconds each.',               duration:10 },
]

export default function ResetRoutine() {
  const [currentEx, setCurrentEx] = useState(1)
  const [timeLeft, setTimeLeft] = useState(18)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running || timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running])

  const totalTime = 30
  const progressPct = Math.round(((totalTime - timeLeft) / totalTime) * 100)

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
        <div>
          <div className="text-[13px] font-medium text-blue-800">Tech neck detected for 10+ minutes</div>
          <div className="text-[12px] text-blue-600 mt-0.5">Your head angle dropped below 150° at 2:14 PM. Take a 30-second reset break.</div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-4">
        <div>
          <div className="text-[12px] text-blue-500">Time remaining</div>
          <div className="text-[32px] font-medium text-blue-800 font-mono leading-tight">{timeLeft}s</div>
          <div className="text-[11px] text-blue-500 mt-0.5">Routine in progress</div>
        </div>
        <div className="flex-1">
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="text-[11px] text-blue-500 mt-1 text-right">Exercise {currentEx} of {exercises.length}</div>
        </div>
        <button
          onClick={() => setRunning(r => !r)}
          className="text-[12px] text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          {running ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">30-second reset routine</div>
        <div className="flex flex-col gap-2">
          {exercises.map((ex, i) => {
            const isDone = i < currentEx
            const isActive = i === currentEx
            return (
              <div
                key={ex.name}
                onClick={() => setCurrentEx(i)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                  ${isActive ? 'border-blue-300 bg-blue-50' : isDone ? 'border-gray-100 opacity-60' : 'border-blue-100'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0
                  ${isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}
                >
                  {isDone
                    ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0C447C" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    : i + 1}
                </div>
                <div className="flex-1">
                  <div className={`text-[13px] font-medium ${isActive ? 'text-blue-800' : 'text-gray-900'}`}>{ex.name}</div>
                  <div className={`text-[11px] mt-0.5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>{ex.desc}</div>
                </div>
                <div className={`text-[12px] font-medium ${isActive ? 'text-blue-600' : isDone ? 'text-blue-400' : 'text-gray-300'}`}>
                  {isDone ? `${ex.duration}s ✓` : `${ex.duration}s`}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
        <div className="text-[12px] text-blue-800">Camera is paused during your reset — no tracking during the break.</div>
      </div>

      <div className="bg-page rounded-xl p-4">
        <div className="text-[12px] font-medium text-gray-900 mb-1">Why this matters</div>
        <div className="text-[12px] text-gray-400 leading-relaxed">Tech neck puts up to 60 lbs of pressure on your cervical spine. These 30 seconds decompress the muscles and reset your natural posture angle.</div>
      </div>
    </div>
  )
}
