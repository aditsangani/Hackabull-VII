import { useState, useCallback, useEffect } from 'react'
import { usePosture, ZONE_COLORS } from '../context/PostureContext'

const steps = ['Position', 'Hold pose', 'Confirm']

export default function Calibrate() {
  const {
    angle, baseline, zone, isCalibrating, calibCountdown,
    cameraReady, landmarksDetected, canvasRef,
    startCalibration, skipCalibration,
  } = usePosture()

  // Track which wizard step we're on independently of context state
  const [activeStep, setActiveStep] = useState(0)
  const [savedBaseline, setSavedBaseline] = useState(null)

  // Move to confirm step when calibration finishes
  useEffect(() => {
    if (activeStep === 1 && !isCalibrating && baseline !== null) {
      setSavedBaseline(baseline)
      setActiveStep(2)
    }
  }, [isCalibrating, baseline, activeStep])

  const handleStart = () => {
    setActiveStep(1)
    startCalibration()
  }

  const handleSkip = () => {
    const result = skipCalibration()
    if (result) {
      setSavedBaseline(result)
      setActiveStep(2)
    }
  }

  const handleRecalibrate = () => {
    setActiveStep(0)
    setSavedBaseline(null)
  }

  // Callback ref: registers this canvas with the context so skeleton is drawn here
  const setCanvas = useCallback(el => { canvasRef.current = el }, [canvasRef])

  const zoneColor = ZONE_COLORS[zone] || ZONE_COLORS.UNCALIBRATED
  const circumference = 2 * Math.PI * 34
  const offset = circumference * (calibCountdown / 10)

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-[18px] font-medium text-gray-900">Calibrate your baseline</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Set once — personalized to your height and chair</p>
      </div>

      {/* Step indicator */}
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

      {/* Camera + calibration card */}
      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="text-[14px] font-medium text-gray-900 mb-3">
          {activeStep === 2
            ? 'Baseline captured successfully'
            : activeStep === 1
            ? 'Sit in your best posture and hold…'
            : 'Position yourself in frame'}
        </div>

        {/* Canvas: skeleton overlay is drawn here by PostureContext */}
        <div
          className="bg-page rounded-lg overflow-hidden relative"
          style={{ height: 144, borderWidth: 2, borderStyle: 'solid', borderColor: activeStep === 2 ? '#4caf50' : zoneColor, borderRadius: 8, transition: 'border-color 0.4s' }}
        >
          <canvas
            ref={setCanvas}
            width={640}
            height={480}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
          {cameraReady && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">LIVE</span>
          )}
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] text-gray-400">Starting camera…</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-[13px] text-gray-400">Current angle reading</div>
            <div className="text-[28px] font-medium font-mono" style={{ color: zoneColor }}>
              {angle !== null ? `${angle}°` : '—°'}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {landmarksDetected ? 'Landmarks detected' : cameraReady ? 'No landmarks — check framing' : 'Waiting for camera…'}
            </div>
          </div>

          {activeStep === 1 && isCalibrating ? (
            <div className="flex flex-col items-center gap-1">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#E6F1FB" strokeWidth="6"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke="#185FA5" strokeWidth="6"
                  strokeDasharray={circumference} strokeDashoffset={circumference - offset}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <text x="40" y="45" textAnchor="middle" fontSize="18" fontWeight="500" fill="#185FA5">{calibCountdown}s</text>
              </svg>
              <span className="text-[11px] text-gray-400">Remaining</span>
            </div>
          ) : activeStep === 2 ? (
            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-blue-50">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l7 7 13-13" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] text-blue-600 mt-1">Saved</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleStart}
                disabled={!cameraReady || !landmarksDetected}
                className="px-4 py-2 bg-blue-600 text-white text-[12px] font-medium rounded-lg disabled:opacity-40 hover:bg-blue-700 transition-colors"
              >
                Start 10s calibration
              </button>
              <button
                onClick={handleSkip}
                disabled={!landmarksDetected}
                className="px-4 py-2 bg-blue-50 text-blue-700 text-[12px] font-medium rounded-lg disabled:opacity-40 hover:bg-blue-100 transition-colors"
              >
                ⚡ Use current angle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status / saved baseline info */}
      {activeStep === 2 && savedBaseline !== null ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2a3 3 0 100 6 3 3 0 000-6zM3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-medium text-blue-800">Baseline set to {savedBaseline}°</div>
              <div className="text-[12px] text-blue-600 mt-0.5">Posture scoring is now active on the Dashboard.</div>
            </div>
          </div>
          <button
            onClick={handleRecalibrate}
            className="text-[12px] text-blue-600 font-medium hover:underline"
          >
            Recalibrate
          </button>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2a3 3 0 100 6 3 3 0 000-6zM3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-medium text-blue-800">
              {baseline ? `Previous baseline: ${baseline}°` : 'No baseline set yet'}
            </div>
            <div className="text-[12px] text-blue-600 mt-0.5">
              {baseline ? 'New calibration will replace this.' : 'Complete calibration to start scoring.'}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
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
