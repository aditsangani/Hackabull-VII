PostureAI
A real-time posture monitoring app built for HackABull VII. Detects tech neck using your webcam and MediaPipe pose estimation, tracks posture patterns over time, and coaches you back to better habits.
Built for the Health Care & Wellness track by SASE.

What it does

Detects tech neck by calculating the ear → shoulder → hip angle in real time
Alerts you after 10+ minutes of poor posture with a 30-second reset routine
Personalizes thresholds through a 10-second calibration flow
Tracks hourly posture scores and identifies fatigue patterns (e.g. the 2 PM slump)
Gamifies good posture with Spine Streaks and achievements
Runs entirely on-device — video never leaves your RAM


Tech stack

React + Vite — frontend framework
Tailwind CSS v3 — styling
MediaPipe Pose — landmark detection (ear, shoulder, hip)
Browser Notification API — posture alerts
localStorage — session data persistence


Getting started
bash# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

Project structure
src/
├── components/
│   └── Sidebar.jsx          # Navigation sidebar
├── screens/
│   ├── Dashboard.jsx        # Live detection + hourly breakdown
│   ├── Analytics.jsx        # Fatigue curve + weekly overview
│   ├── Calibrate.jsx        # Personalized baseline setup
│   ├── Streaks.jsx          # Gamification + leaderboard
│   └── ResetRoutine.jsx     # 30-second guided break
└── App.jsx                  # Root component + routing

How the detection works
MediaPipe returns x, y, z coordinates for 33 body landmarks. We extract three:

Nose (landmark 0) — approximates ear position
Left shoulder (landmark 11)
Left hip (landmark 23)

We calculate the angle between these three points using the dot product formula:
angle = arccos((AB · BC) / (|AB| * |BC|))
Where:

AB = vector from shoulder to nose
BC = vector from shoulder to hip

Normal posture → angle close to 180°
Tech neck → angle drops below 150°
This landmark-based approach is more CPU-efficient than full-frame analysis — we only process skeleton data, not raw pixels.

Calibration
Users sit in their best posture for 10 seconds. The app averages the angle readings and sets that as the personal baseline threshold. This accounts for different heights, chair types, and camera positions.

Privacy
All video processing happens locally in the browser. The camera feed is never saved to disk or sent to any server. During the reset routine, the camera feed is paused entirely.

Team
Built at HackABull VII — University of South Florida

Demo flow

Open the app and run calibration (sit straight for 10 seconds)
Watch the live angle reading on the dashboard
Slowly slouch — score drops, icon turns warning
Hit Trigger Reset Routine (bottom right) to demo the break flow
Show the Analytics screen to highlight the 2 PM fatigue pattern
