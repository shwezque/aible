import { createContext, useContext } from 'react'
import { useStore } from './useStore'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const store = useStore()
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
