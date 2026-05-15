import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const C = { bordeaux: '#6B1515', beige: '#F5E6C8', or: '#C4922A' }

export default function ResetPassword() {
  const [searchParams]              = useSearchParams()
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [message, setMessage]       = useState('')
  const [erreur, setErreur]         = useState('')
  const [loading, setLoading]       = useState(false)
  const navigate                    = useNavigate()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const handleSubmit = async () => {
    setLoading(true)
    setErreur('')
    setMessage('')
    try {
      const res = await axios.post('http://localhost:8000/api/reset-password', {
        token,
        email,
        password,
        password_confirmation: confirm,
      })
      setMessage(res.data.message)
      setTimeout(() => navigate('/login'), 2000)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Token invalide ou expiré')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif' }}>
      <div style={{ background: '#fff', border: '1px solid #e8e2d9', borderRadius: '8px', padding: '40px', width: '360px' }}>
        <h2 style={{ color: C.bordeaux, fontWeight: 'normal', textAlign: 'center', marginBottom: '24px' }}>
          Nouveau mot de passe
        </h2>

        <input type="password" placeholder="Nouveau mot de passe" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', border: '1px solid #e0dcd6', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '12px' }} />

        <input type="password" placeholder="Confirmer le mot de passe" value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={{ width: '100%', border: '1px solid #e0dcd6', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '16px' }} />

        {message && <p style={{ color: 'green', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{message}</p>}
        {erreur  && <p style={{ color: 'red',   fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{erreur}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', background: C.bordeaux, color: C.beige, border: 'none', padding: '12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>
          {loading ? 'Chargement...' : 'Réinitialiser'}
        </button>
      </div>
    </div>
  )
}