import { useCallback } from 'react'
import { usePosture, ZONE_COLORS } from '../context/PostureContext'

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

const ZONE_LABELS = { GREEN: 'Good', AMBER: 'Warning', RED: 'Tech neck', UNCALIBRATED: 'Not calibrated', UNKNOWN: '—' }

export default function Dashboard() {
  const { angle, zone, score, drop, baseline, landmarksDetected, cameraReady, canvasRef } = usePosture()

  // Callback ref: sets canvasRef.current so PostureContext draws onto this canvas
  const setCanvas = useCallback(el => { canvasRef.current = el }, [canvasRef])

  const zoneColor = ZONE_COLORS[zone] || ZONE_COLORS.UNCALIBRATED
  const scoreLabel = score !== null ? ZONE_LABELS[zone] : 'Not calibrated'
  const scoreDisplay = score !== null ? String(score) : '—'
  const angleDisplay = angle !== null ? `${angle}°` : '—°'
  const dropDisplay = drop !== null ? `${drop > 0 ? '+' : ''}${drop}°` : '—'

  const showAlert = zone === 'RED' && baseline !== null
  const showWarning = zone === 'AMBER' && baseline !== null

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-[18px] font-medium text-gray-900">Dashboard</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Today, Friday — Session active</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <MetricCard label="Posture score" value={scoreDisplay} badge={scoreLabel} />
        <MetricCard label="Angle" value={angleDisplay} badge={baseline ? `Baseline ${baseline}°` : 'Calibrate first'} />
        <MetricCard label="Drop from baseline" value={dropDisplay} badge={zone !== 'UNCALIBRATED' ? ZONE_LABELS[zone] : '—'} badgeStyle={zone === 'RED' ? 'gray' : 'blue'} />
      </div>

      {showAlert && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
          <div>
            <div className="text-[13px] font-medium text-red-800">Tech neck detected</div>
            <div className="text-[12px] text-red-600 mt-0.5">Head angle dropped {drop}° from baseline. Time for a 30-second shoulder reset.</div>
          </div>
        </div>
      )}

      {showWarning && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1 shrink-0" />
          <div>
            <div className="text-[13px] font-medium text-yellow-800">Posture drifting</div>
            <div className="text-[12px] text-yellow-600 mt-0.5">Angle dropped {drop}° from baseline — try to straighten up.</div>
          </div>
        </div>
      )}

      {!showAlert && !showWarning && baseline && zone === 'GREEN' && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
          <div>
            <div className="text-[13px] font-medium text-blue-800">Great posture — keep it up!</div>
            <div className="text-[12px] text-blue-600 mt-0.5">You're within {drop !== null ? Math.abs(drop) : 0}° of your baseline. Looking good.</div>
          </div>
        </div>
      )}

      {!baseline && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
          <div>
            <div className="text-[13px] font-medium text-blue-800">Calibrate to start scoring</div>
            <div className="text-[12px] text-blue-600 mt-0.5">Go to the Calibrate screen to set your posture baseline.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white border border-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-medium text-gray-900">Live detection</div>
            {cameraReady && (
              <span className="bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">LIVE</span>
            )}
          </div>

          {/* Camera canvas — PostureContext draws the skeleton overlay onto this */}
          <div
            className="bg-page rounded-lg overflow-hidden relative"
            style={{ height: 112, borderWidth: 2, borderStyle: 'solid', borderColor: zoneColor, borderRadius: 8, transition: 'border-color 0.4s' }}
          >
            <canvas
              ref={setCanvas}
              width={640}
              height={480}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] text-gray-400">Waiting for camera…</span>
              </div>
            )}
          </div>

          <div className="text-center mt-3">
            <div className="text-[26px] font-medium font-mono" style={{ color: zoneColor }}>
              {angleDisplay}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Ear → shoulder → hip angle</div>
            <div className="text-[11px] mt-1" style={{ color: zoneColor }}>
              {landmarksDetected ? (baseline ? ZONE_LABELS[zone] : 'Calibrate to score') : (cameraReady ? 'No landmarks — check framing' : 'Starting camera…')}
            </div>
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
