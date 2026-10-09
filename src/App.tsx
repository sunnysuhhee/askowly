import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { ArtDefs } from './components/art/ArtDefs'
import { Icon } from './components/art/Icon'
import { OwlyFace } from './components/art/Owly'
import { OfflineBanner } from './components/OfflineBanner'
import { ReminderWatcher } from './features/meds/ReminderWatcher'
import { AskScreen } from './features/home/AskScreen'
import { MedList } from './features/meds/MedList'
import { AddMed } from './features/meds/AddMed'
import { MedDetail } from './features/meds/MedDetail'
import { ShareSummary } from './features/meds/ShareSummary'
import { MobilityHome } from './features/mobility/MobilityHome'
import { RoutinePlayer } from './features/mobility/RoutinePlayer'
import { Places } from './features/mobility/Places'
import { CheckMessage } from './features/scam/CheckMessage'
import { ScamLibrary } from './features/scam/ScamLibrary'
import { ReportFCC } from './features/scam/ReportFCC'
import { Settings } from './features/settings/Settings'

const FEATURES: Record<string, string | undefined> = { meds: 'meds', move: 'move', scam: 'scam' }

export function App() {
  const { pathname } = useLocation()
  const atHome = pathname === '/'
  // Each helper has its own color (see tokens.css). Home and Settings keep the brand orange.
  const feature = FEATURES[pathname.split('/')[1]]

  // Every new screen starts at the top, and focus moves to its heading for screen readers.
  useEffect(() => {
    window.scrollTo(0, 0)
    document.querySelector<HTMLElement>('main h1')?.focus()
  }, [pathname])

  return (
    <div className="app">
      <ArtDefs />
      <header className="topbar no-print">
        <Link to="/" className="brand" aria-label="AskOwly, go to Home">
          <OwlyFace />
          <span aria-hidden="true">
            Ask<span className="brand-owly">Owly</span>
          </span>
        </Link>
        <nav className="topbar-actions" aria-label="Main">
          {!atHome && (
            <Link to="/" className="btn btn-secondary">
              <Icon name="home" /> Home
            </Link>
          )}
          <Link to="/settings" className="btn btn-secondary" aria-current={pathname === '/settings' ? 'page' : undefined}>
            <Icon name="settings" /> Settings
          </Link>
        </nav>
      </header>
      <OfflineBanner />
      <ReminderWatcher />
      <main className="page" id="main" data-feature={feature}>
        <Routes>
          <Route path="/" element={<AskScreen />} />
          <Route path="/meds" element={<MedList />} />
          <Route path="/meds/add" element={<AddMed />} />
          <Route path="/meds/share" element={<ShareSummary />} />
          <Route path="/meds/:id" element={<MedDetail />} />
          <Route path="/move" element={<MobilityHome />} />
          <Route path="/move/places" element={<Places />} />
          <Route path="/move/:id" element={<RoutinePlayer />} />
          <Route path="/scam" element={<CheckMessage />} />
          <Route path="/scam/library" element={<ScamLibrary />} />
          <Route path="/scam/report" element={<ReportFCC />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<AskScreen />} />
        </Routes>
      </main>
    </div>
  )
}
