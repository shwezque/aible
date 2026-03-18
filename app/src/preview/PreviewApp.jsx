import { Routes, Route, Link, useLocation } from 'react-router-dom'
import ChatScreen from './ChatScreen'

const SCREENS = [
  { path: '/preview/chat', label: 'S-06: Chat Session', component: ChatScreen },
  // More screens will be added here as we build them
]

function PreviewIndex() {
  return (
    <div className="min-h-full bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Aible Screen Preview</h1>
      <p className="text-sm text-gray-500 mb-6">Tap a screen to preview. These are static mockups — no logic, no API.</p>
      <div className="space-y-3">
        {SCREENS.map((s) => (
          <Link
            key={s.path}
            to={s.path}
            className="block bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <p className="text-base font-semibold text-gray-900">{s.label}</p>
            <p className="text-sm text-gray-500 mt-0.5">Tap to preview →</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
        <p className="text-sm text-purple-800 font-medium">Preview Mode</p>
        <p className="text-xs text-purple-600 mt-1">Screens are added one by one for review. Check back as more are built.</p>
      </div>
    </div>
  )
}

export default function PreviewApp() {
  return (
    <Routes>
      <Route path="/preview" element={<PreviewIndex />} />
      {SCREENS.map((s) => (
        <Route key={s.path} path={s.path} element={<s.component />} />
      ))}
    </Routes>
  )
}
