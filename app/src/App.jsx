import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import { useStore } from './hooks/useStore'
import TabBar from './components/TabBar'
import Welcome from './pages/Welcome'
import PickTopic from './pages/PickTopic'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Today from './pages/Today'
import Profile from './pages/Profile'
import Paywall from './pages/Paywall'
import Preferences from './pages/Preferences'
import PreviewApp from './preview/PreviewApp'

function TabLayout() {
  const { user } = useStore()
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <TabBar streak={user.streak} />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const { user } = useStore()

  // Preview mode
  if (location.pathname.startsWith('/preview')) {
    return <PreviewApp />
  }

  const isNew = !user.onboardingComplete

  return (
    <Routes>
      {/* Onboarding */}
      <Route path="/" element={isNew ? <Welcome /> : <Navigate to="/home" replace />} />
      <Route path="/pick-topic" element={<PickTopic />} />
      <Route path="/preferences" element={<Preferences />} />

      {/* Full-screen (no tabs) */}
      <Route path="/chat/:topicId" element={<Chat />} />
      <Route path="/upgrade" element={<Paywall />} />

      {/* Tabbed pages */}
      <Route element={<TabLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/today" element={<Today />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
