import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'

// ── Posture geometry ───────────────────────────────────────────────────────
const ZONE_THRESHOLDS = { AMBER: 10, RED: 25 }
export const ZONE_COLORS = {
  GREEN: '#4caf50', AMBER: '#ffc107', RED: '#f44336',
  UNCALIBRATED: '#3b82f6', UNKNOWN: '#888',
}

function getMidpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: ((a.z || 0) + (b.z || 0)) / 2 }
}

function calculateAngle(A, B, C) {
  const BA = { x: A.x - B.x, y: A.y - B.y, z: (A.z || 0) - (B.z || 0) }
  const BC = { x: C.x - B.x, y: C.y - B.y, z: (C.z || 0) - (B.z || 0) }
  const dot = BA.x * BC.x + BA.y * BC.y + BA.z * BC.z
  const mBA = Math.sqrt(BA.x ** 2 + BA.y ** 2 + BA.z ** 2)
  const mBC = Math.sqrt(BC.x ** 2 + BC.y ** 2 + BC.z ** 2)
  if (mBA === 0 || mBC === 0) return null
  return (Math.acos(Math.max(-1, Math.min(1, dot / (mBA * mBC)))) * 180) / Math.PI
}

function getPostureAngle(lm) {
  if (!lm || lm.length < 25) return null
  const ear = getMidpoint(lm[7], lm[8])
  const shoulder = getMidpoint(lm[11], lm[12])
  const hip = getMidpoint(lm[23], lm[24])
  return calculateAngle(ear, shoulder, hip)
}

export function classifyPosture(angle, baseline) {
  if (angle === null) return { zone: 'UNKNOWN', drop: null, score: null }
  if (!baseline) return { zone: 'UNCALIBRATED', drop: null, score: null }
  const drop = baseline - angle
  const zone = drop < ZONE_THRESHOLDS.AMBER ? 'GREEN' : drop < ZONE_THRESHOLDS.RED ? 'AMBER' : 'RED'
  const score = Math.max(0, Math.min(100, Math.round(100 - (drop / 40) * 100)))
  return { zone, drop: parseFloat(drop.toFixed(1)), score }
}

// ── Context ────────────────────────────────────────────────────────────────
const PostureContext = createContext(null)

export function PostureProvider({ videoRef, children }) {
  const [angle, setAngle] = useState(null)
  const [baseline, setBaseline] = useState(null)
  const [zone, setZone] = useState('UNCALIBRATED')
  const [score, setScore] = useState(null)
  const [drop, setDrop] = useState(null)
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [calibCountdown, setCalibCountdown] = useState(10)
  const [cameraReady, setCameraReady] = useState(false)
  const [landmarksDetected, setLandmarksDetected] = useState(false)

  // Refs for use inside MediaPipe callbacks (avoid stale closures)
  const canvasRef = useRef(null)
  const calibSamplesRef = useRef([])
  const lastLandmarksRef = useRef(null)
  const baselineRef = useRef(null)
  const isCalibRef = useRef(false)

  // ── Canvas drawing ─────────────────────────────────────────────────────
  const drawOverlay = useCallback((results, canvas) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    if (!results.poseLandmarks) return

    const lm = results.poseLandmarks
    const a = getPostureAngle(lm)
    const { zone: z } = classifyPosture(a, baselineRef.current)
    const color = ZONE_COLORS[z] || '#888'

    if (window.drawConnectors && window.POSE_CONNECTIONS) {
      window.drawConnectors(ctx, lm, window.POSE_CONNECTIONS, { color: '#33333366', lineWidth: 1 })
    }
    if (window.drawLandmarks) {
      window.drawLandmarks(ctx, lm, { color: '#44444455', lineWidth: 1, radius: 1 })
    }

    // Highlight key landmarks
    ;[7, 8, 11, 12, 23, 24].forEach(i => {
      const p = lm[i]
      if (!p) return
      ctx.beginPath()
      ctx.arc(p.x * W, p.y * H, 5, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.5
      ctx.stroke()
    })

    // Ear → Shoulder → Hip alignment line
    const mid = (a, b) => ({ x: (lm[a].x + lm[b].x) / 2 * W, y: (lm[a].y + lm[b].y) / 2 * H })
    const ear = mid(7, 8), sh = mid(11, 12), hip = mid(23, 24)
    ctx.beginPath()
    ctx.moveTo(ear.x, ear.y)
    ctx.lineTo(sh.x, sh.y)
    ctx.lineTo(hip.x, hip.y)
    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.setLineDash([5, 3])
    ctx.stroke()
    ctx.setLineDash([])
  }, [])

  // ── MediaPipe init ─────────────────────────────────────────────────────
  useEffect(() => {
    let camera = null

    const initMediaPipe = () => {
      if (!window.Pose || !window.Camera || !videoRef.current) return

      const pose = new window.Pose({
        locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${f}`,
      })
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      pose.onResults(results => {
        drawOverlay(results, canvasRef.current)

        if (results.poseLandmarks) {
          lastLandmarksRef.current = results.poseLandmarks
          setLandmarksDetected(true)
          const a = getPostureAngle(results.poseLandmarks)
          if (isCalibRef.current && a !== null) calibSamplesRef.current.push(a)
          if (a !== null) {
            const rounded = parseFloat(a.toFixed(1))
            setAngle(rounded)
            const result = classifyPosture(a, baselineRef.current)
            setZone(result.zone)
            setScore(result.score)
            setDrop(result.drop)
          }
        } else {
          setLandmarksDetected(false)
        }
      })

      camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) await pose.send({ image: videoRef.current })
        },
        width: 640,
        height: 480,
      })

      camera.start().then(() => setCameraReady(true)).catch(() => {})
    }

    if (window.Pose && window.Camera) {
      initMediaPipe()
    } else {
      const poll = setInterval(() => {
        if (window.Pose && window.Camera) { clearInterval(poll); initMediaPipe() }
      }, 100)
      return () => { clearInterval(poll); camera?.stop?.() }
    }

    return () => camera?.stop?.()
  }, [videoRef, drawOverlay])

  // ── Calibration ────────────────────────────────────────────────────────
  const startCalibration = useCallback(() => {
    calibSamplesRef.current = []
    isCalibRef.current = true
    setIsCalibrating(true)
    setCalibCountdown(10)

    let count = 10
    const interval = setInterval(() => {
      count--
      setCalibCountdown(count)
      if (count <= 0) clearInterval(interval)
    }, 1000)

    setTimeout(() => {
      isCalibRef.current = false
      setIsCalibrating(false)
      const samples = calibSamplesRef.current
      if (samples.length > 0) {
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length
        const rounded = parseFloat(avg.toFixed(1))
        baselineRef.current = rounded
        setBaseline(rounded)
      }
    }, 10000)
  }, [])

  const skipCalibration = useCallback(() => {
    const a = lastLandmarksRef.current ? getPostureAngle(lastLandmarksRef.current) : null
    if (a) {
      const rounded = parseFloat(a.toFixed(1))
      baselineRef.current = rounded
      setBaseline(rounded)
      return rounded
    }
    return null
  }, [])

  return (
    <PostureContext.Provider value={{
      angle, baseline, zone, score, drop,
      isCalibrating, calibCountdown, cameraReady, landmarksDetected,
      canvasRef, startCalibration, skipCalibration,
    }}>
      {children}
    </PostureContext.Provider>
  )
}

export const usePosture = () => useContext(PostureContext)
