import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

function TabLayout() {
  const { user } = useStore()
  const location = useLocation()

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <TabBar streak={user.streak} />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const { user } = useStore()

  if (location.pathname.startsWith('/preview')) {
    return <PreviewApp />
  }

  const isNew = !user.onboardingComplete

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Onboarding */}
        <Route path="/" element={
          isNew ? <PageTransition><Welcome /></PageTransition> : <Navigate to="/home" replace />
        } />
        <Route path="/learn-style" element={<PageTransition><Preferences /></PageTransition>} />
        <Route path="/pick-topic" element={<PageTransition><PickTopic /></PageTransition>} />

        {/* Full-screen (no tabs) */}
        <Route path="/chat/:topicId" element={<PageTransition><Chat /></PageTransition>} />
        <Route path="/upgrade" element={<PageTransition><Paywall /></PageTransition>} />

        {/* Tabbed pages */}
        <Route element={<TabLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/today" element={<Today />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
