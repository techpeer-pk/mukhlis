import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const user = useAuth()

  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-purple-400">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
