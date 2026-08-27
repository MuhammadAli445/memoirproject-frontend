import { Routes, Route } from 'react-router-dom'
import BeginScreen from './pages/BeginScreen'
import GuideScreen from './pages/GuideScreen'
import WorkspaceScreen from './pages/WorkspaceScreen'
import DashboardHome from './pages/DashboardHome'
import RecordingScreen from './pages/RecordingScreen'
import ArchiveScreen from './pages/ArchiveScreen'
import MobileTimeline from './pages/MobileTimeline'
import CheckoutScreen from './pages/CheckoutScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BeginScreen />} />
      <Route path="/guide" element={<GuideScreen />} />
      <Route path="/workspace" element={<WorkspaceScreen />} />
      <Route path="/dashboard" element={<DashboardHome />} />
      <Route path="/recording" element={<RecordingScreen />} />
      <Route path="/archive" element={<ArchiveScreen />} />
      <Route path="/mobile" element={<MobileTimeline />} />
      <Route path="/checkout" element={<CheckoutScreen />} />
    </Routes>
  )
}
