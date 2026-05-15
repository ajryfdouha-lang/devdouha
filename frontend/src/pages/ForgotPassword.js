import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const C = { bordeaux: '#6B1515', beige: '#F5E6C8', or: '#C4922A' }

export default function ForgotPassword() {
  const [email, setEmail]       = useState('')
  const [message, setMessage]   = useState('')
  const [erreur, setErreur]     = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setErreur('')
    setMessage('')
    try {
      const res = await axios.post('http://localhost:8000/api/forgot-password', { email })
      setMessage(res.data.message)
    } catch (e) {
      setErreur(e.response?.data?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif' }}>
      <div style={{ background: '#fff', border: '1px solid #e8e2d9', borderRadius: '8px', padding: '40px', width: '360px' }}>
        <h2 style={{ color: C.bordeaux, fontWeight: 'normal', textAlign: 'center', marginBottom: '24px' }}>
          Mot de passe oublié
        </h2>

        <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </p>

        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', border: '1px solid #e0dcd6', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '16px' }}
        />

        {message && <p style={{ color: 'green', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{message}</p>}
        {erreur  && <p style={{ color: 'red',   fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{erreur}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', background: C.bordeaux, color: C.beige, border: 'none', padding: '12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>
          {loading ? 'Envoi...' : 'Envoyer le lien'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '16px', color: '#888', cursor: 'pointer' }}
          onClick={() => navigate('/login')}>
          ← Retour à la connexion
        </p>
      </div>
    </div>
  )
}