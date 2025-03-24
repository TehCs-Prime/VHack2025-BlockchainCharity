import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
