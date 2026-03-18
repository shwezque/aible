import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import Welcome from './screens/Welcome'
import Onboarding from './screens/Onboarding'
import Lesson from './screens/Lesson'
import LessonComplete from './screens/LessonComplete'
import Signup from './screens/Signup'
import DailyGoalSelect from './screens/DailyGoalSelect'
import Home from './screens/Home'
import Practice from './screens/Practice'
import Badges from './screens/Badges'
import Profile from './screens/Profile'
import Paywall from './screens/Paywall'
import Layout from './components/Layout'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/lesson/:lessonId" element={<Lesson />} />
        <Route path="/lesson-complete" element={<LessonComplete />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/daily-goal" element={<DailyGoalSelect />} />
        <Route path="/paywall" element={<Paywall />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
