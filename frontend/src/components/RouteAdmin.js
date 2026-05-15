import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function RouteAdmin({ children }) {
  const { user, chargement } = useAuth()

  if (chargement) {
    return (
      <div style={{ textAlign:'center', padding:'60px', fontFamily:'Georgia,serif', color:'#6B1515' }}>
        Chargement...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}