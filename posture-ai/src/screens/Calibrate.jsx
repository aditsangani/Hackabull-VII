import { useState, useEffect } from 'react'

const steps = ['Position', 'Hold pose', 'Confirm']

export default function Calibrate() {
  const [activeStep, setActiveStep] = useState(1)
  const [countdown, setCountdown] = useState(6)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (activeStep !== 1 || done) return
    if (countdown <= 0) { setDone(true); setActiveStep(2); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, activeStep, done])

  const circumference = 2 * Math.PI * 34
  const offset = circumference * (countdown / 10)

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-[18px] font-medium text-gray-900">Calibrate your baseline</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Set once — personalized to your height and chair</p>
      </div>

      <div className="flex items-center gap-0 mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium z-10
                ${i < activeStep ? 'bg-blue-100 text-blue-800' : i === activeStep ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}
              `}>
                {i < activeStep
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0C447C" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  : i + 1}
              </div>
              <span className={`text-[11px] ${i === activeStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="h-px w-full bg-blue-100 mb-5" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">
          {done ? 'Baseline captured successfully' : 'Sit in your best posture and hold for 10 seconds'}
        </div>
        <div className={`bg-page rounded-lg h-36 flex flex-col items-center justify-center gap-2 relative border-2 ${done ? 'border-blue-600' : 'border-blue-400'}`}>
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">LIVE</span>
          <div className="opacity-30 flex flex-col items-center gap-1">
            <div className="w-5 h-5 rounded-full border-2 border-blue-600" />
            <div className="w-12 h-0.5 bg-blue-600 mt-2" />
            <div className="w-0.5 h-8 bg-blue-600" />
          </div>
          <span className="absolute bottom-2 flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            Landmarks detected — looking good
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-[13px] text-gray-400">Current angle reading</div>
            <div className="text-[28px] font-medium text-blue-600 font-mono">174°</div>
          </div>
          {!done ? (
            <div className="flex flex-col items-center gap-1">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#E6F1FB" strokeWidth="6"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke="#185FA5" strokeWidth="6"
                  strokeDasharray={circumference} strokeDashoffset={circumference - offset}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <text x="40" y="45" textAnchor="middle" fontSize="18" fontWeight="500" fill="#185FA5">{countdown}s</text>
              </svg>
              <span className="text-[11px] text-gray-400">Remaining</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-blue-50">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l7 7 13-13" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] text-blue-600 mt-1">Saved</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2a3 3 0 100 6 3 3 0 000-6zM3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-medium text-blue-800">Previous baseline: 171° (set 3 days ago)</div>
          <div className="text-[12px] text-blue-600 mt-0.5">New calibration will replace this and apply going forward.</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[13px] font-medium text-gray-900">Tips for best results</div>
        {[
          ['Sit in the chair you use most', 'Different chairs change your natural posture angle'],
          ['Keep your full upper body in frame', 'Ear, shoulder, and hip must all be visible'],
          ['Sit naturally — not artificially straight', 'Your baseline should be sustainable, not forced'],
        ].map(([t, s], i) => (
          <div key={t} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-medium flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
            <div>
              <div className="text-[13px] text-gray-900">{t}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
