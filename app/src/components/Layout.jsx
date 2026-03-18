import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const tabs = [
  { path: '/home', label: 'Learn', icon: '📚', activeIcon: '📚' },
  { path: '/practice', label: 'Practice', icon: '🔄', activeIcon: '🔄' },
  { path: '/badges', label: 'Badges', icon: '🏆', activeIcon: '🏆' },
  { path: '/profile', label: 'Profile', icon: '👤', activeIcon: '👤' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-surface border-t border-line pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-14">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1"
              >
                <motion.span
                  className="text-xl"
                  whileTap={{ scale: 0.9 }}
                >
                  {isActive ? tab.activeIcon : tab.icon}
                </motion.span>
                {isActive && (
                  <span className="text-[10px] font-semibold text-primary">
                    {tab.label}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
