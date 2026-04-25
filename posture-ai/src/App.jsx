import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './screens/Dashboard'
import Analytics from './screens/Analytics'
import Calibrate from './screens/Calibrate'
import Streaks from './screens/Streaks'
import ResetRoutine from './screens/ResetRoutine'

const screens = {
  dashboard: Dashboard,
  analytics: Analytics,
  calibrate: Calibrate,
  streaks:   Streaks,
  reset:     ResetRoutine,
}

export default function App() {
  const [active, setActive] = useState('dashboard')
  const Screen = screens[active]

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="w-full max-w-4xl h-[680px] bg-white rounded-2xl border border-blue-100 overflow-hidden flex">
        <Sidebar active={active} onNav={setActive} />
        <main className="flex-1 overflow-hidden bg-page">
          <Screen />
        </main>
      </div>
      <button
        onClick={() => setActive('reset')}
        className="fixed bottom-5 right-5 bg-blue-600 text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Trigger Reset Routine
      </button>
    </div>
  )
}
