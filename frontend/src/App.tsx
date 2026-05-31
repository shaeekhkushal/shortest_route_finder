
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Header } from './components/common'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { RouteFinderPage } from './pages/RouteFinderPage'
import './index.css'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="bg-white dark:bg-gray-900">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/route" element={<RouteFinderPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
