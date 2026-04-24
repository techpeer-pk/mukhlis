import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import InstallPrompt from './components/InstallPrompt'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import ReportPage from './pages/ReportPage'
import SearchPage from './pages/SearchPage'
import MyReports from './pages/MyReports'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/report" element={
              <ProtectedRoute><ReportPage /></ProtectedRoute>
            } />
            <Route path="/my-reports" element={
              <ProtectedRoute><MyReports /></ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
