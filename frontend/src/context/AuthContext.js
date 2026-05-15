import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [chargement, setChargement] = useState(true)

  // Récupérer user au démarrage si token existe
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get('http://localhost:8000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setChargement(false))
    } else {
      setChargement(false)
    }
  }, [])

  const connexion = async (email, password) => {
    const res = await axios.post('http://localhost:8000/api/login', {
      email, password
    })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  const deconnexion = async () => {
  const token = localStorage.getItem('token')
  try {
    await axios.post('http://localhost:8000/api/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (e) {
    // ignorer l'erreur 401
  } finally {
    localStorage.removeItem('token')
    setUser(null)
  }
}

  return (
    <AuthContext.Provider value={{ user, connexion, deconnexion, chargement }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)