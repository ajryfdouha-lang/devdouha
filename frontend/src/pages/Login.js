import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import logo from '../assets/logo.png'
import { useLang } from '../i18n/LangContext'

const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A', beige2:'#FAF0DC' }

export default function Login() {
  const { t } = useLang()
  const { connexion } = useAuth()
  const navigate      = useNavigate()

  // ── Connexion ────────────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email:'', password:'' })
  const [loginErreur, setLoginErreur] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // ── Inscription ──────────────────────────────────────────────────────────
  const [regForm, setRegForm] = useState({
    nom:'', email:'', telephone:'',
    adresse:'', ville:'', password:'',
    newsletter: false,
  })
  const [regErreurs, setRegErreurs]   = useState({})
  const [regLoading, setRegLoading]   = useState(false)
  const [regSucces, setRegSucces]     = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)

  // ── Validation mot de passe ──────────────────────────────────────────────
  const validations = {
    longueur:   regForm.password.length >= 6,
    majuscule:  /[A-Z]/.test(regForm.password),
    chiffre:    /[0-9]/.test(regForm.password),
  }

  // ── Connexion submit ─────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginErreur('')
    try {
      const user = await connexion(loginForm.email, loginForm.password)
      if (user.role === 'admin') navigate('/admin/produits')
      else navigate('/')
    } catch (err) {
      setLoginErreur(err.response?.data?.message || 'Email ou mot de passe incorrect')
    }
    setLoginLoading(false)
  }

  // ── Inscription submit ───────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setRegErreurs({})
    setRegLoading(true)

    // Validation côté client
    const errs = {}
    if (!regForm.nom)       errs.nom       = 'Nom requis'
    if (!regForm.email)     errs.email     = 'Email requis'
    if (!regForm.telephone) errs.telephone = 'Téléphone requis'
    if (!regForm.password)  errs.password  = 'Mot de passe requis'
    if (!validations.longueur || !validations.majuscule || !validations.chiffre) {
      errs.password = 'Mot de passe invalide'
    }

    if (Object.keys(errs).length > 0) {
      setRegErreurs(errs)
      setRegLoading(false)
      return
    }

    try {
      await axios.post('http://localhost:8000/api/register', {
        nom:       regForm.nom,
        email:     regForm.email,
        telephone: regForm.telephone,
        adresse:   regForm.adresse,
        ville:     regForm.ville,
        password:  regForm.password,
      })
      setRegSucces(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const errors = err.response?.data?.errors || {}
      setRegErreurs(errors)
    }
    setRegLoading(false)
  }

  const inputStyle = {
    width:'100%', border:'1px solid #e0ddd8',
    borderRadius:'6px', padding:'11px 14px',
    fontSize:'13px', fontFamily:'Georgia,serif',
    color:'#2a1e14', outline:'none',
    boxSizing:'border-box',
    background:'#fff',
  }

  const labelStyle = {
    fontSize:'12px', color:'#6B1515',
    marginBottom:'4px', display:'block',
    fontFamily:'Georgia,serif',
  }

  const errStyle = {
    fontSize:'11px', color:'#cc4444',
    marginTop:'3px', display:'block'
  }

  return (
    <div style={{ background: C.beige2, minHeight:'100vh', fontFamily:'Georgia,serif' }}>

       
      {/* Header avec logo */}
      <div style={{ background: C.brd, padding:'14px 32px', display:'flex', alignItems:'center' }}>
        <Link to="/">
          <img src={logo} alt="Perle D&K" style={{ height:'44px' }} />
        </Link>
      </div>

      {/* Contenu principal — deux colonnes */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100vh - 72px)', maxWidth:'1100px', margin:'0 auto' }}>

        {/* ── COLONNE GAUCHE — Connexion ── */}
        <div style={{ padding:'48px 48px', borderRight:`1px solid #e0c8a0` }}>
          <h2 style={{ color: C.brd, fontWeight:'normal', fontSize:'22px', marginBottom:'6px' }}>
            {t('connexion')}
          </h2>
          <p style={{ fontSize:'12px', color:'#8B5520', marginBottom:'28px' }}>
            {t('Accédez à votre compte Perle D&K')}
          </p>

          {loginErreur && (
            <div style={{ background:'#ffeaea', border:'1px solid #cc4444', borderRadius:'6px', padding:'10px 14px', marginBottom:'16px', fontSize:'12px', color:'#cc4444' }}>
              {loginErreur}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={loginForm.email} required
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="votre@email.com" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{t('Mot de passe *')}</label>
              <div style={{ position:'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password} required
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight:'44px' }} />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8B5520', padding:'0' }}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ textAlign:'right' }}>
            <p onClick={() => navigate('/forgot-password')}
      style={{ textAlign: 'center', fontSize: '12px', color: '#888', cursor: 'pointer', marginTop: '12px' }}>
      {t('Mot de passe oublié ?')}
    </p>
            </div>

            <button type="submit" disabled={loginLoading}
              style={{ background: C.brd, color: C.beige, border:'none', padding:'13px', borderRadius:'6px', fontSize:'14px', cursor: loginLoading ? 'not-allowed' : 'pointer', fontFamily:'Georgia,serif', marginTop:'6px', opacity: loginLoading ? 0.7 : 1 }}>
              {loginLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* ── COLONNE DROITE — Inscription ── */}
        <div style={{ padding:'48px 48px', background:'#fff' }}>
          <h2 style={{ color: C.brd, fontWeight:'normal', fontSize:'22px', marginBottom:'6px' }}>
            {t('Créer un compte')}
          </h2>
          <p style={{ fontSize:'12px', color:'#8B5520', marginBottom:'28px' }}>
            {t('Rejoignez Perle D&K et profitez de nos offres exclusives')}
          </p>

          {regSucces && (
            <div style={{ background:'#eafff0', border:'1px solid #4caf50', borderRadius:'6px', padding:'12px 14px', marginBottom:'16px', fontSize:'13px', color:'#2e7d32' }}>
              {t('Compte créé avec succès ! Redirection en cours...')}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

            {/* Nom complet */}
            <div>
              <label style={labelStyle}>{t('Nom complet')} *</label>
              <input type="text" value={regForm.nom}
                onChange={e => setRegForm({...regForm, nom: e.target.value})}
                placeholder="Prénom et Nom" style={inputStyle} />
              {regErreurs.nom && <span style={errStyle}>{regErreurs.nom}</span>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>{t('Email')} *</label>
              <input type="email" value={regForm.email}
                onChange={e => setRegForm({...regForm, email: e.target.value})}
                placeholder="votre@email.com" style={inputStyle} />
              {regErreurs.email && <span style={errStyle}>{regErreurs.email}</span>}
            </div>

            {/* Téléphone */}
            <div>
              <label style={labelStyle}>{t('Téléphone')} *</label>
              <input type="tel" value={regForm.telephone}
                onChange={e => setRegForm({...regForm, telephone: e.target.value})}
                placeholder="+212 6XX XXX XXX" style={inputStyle} />
              {regErreurs.telephone && <span style={errStyle}>{regErreurs.telephone}</span>}
            </div>

            {/* Adresse + Ville */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <div>
                <label style={labelStyle}>{t('Adresse')}</label>
                <input type="text" value={regForm.adresse}
                  onChange={e => setRegForm({...regForm, adresse: e.target.value})}
                  placeholder="Rue, N°..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ville</label>
                <input type="text" value={regForm.ville}
                  onChange={e => setRegForm({...regForm, ville: e.target.value})}
                  placeholder="Casablanca" style={inputStyle} />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label style={labelStyle}>{t('Mot de passe')} *</label>
              <div style={{ position:'relative' }}>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regForm.password}
                  onChange={e => setRegForm({...regForm, password: e.target.value})}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight:'44px' }} />
                <button type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8B5520', padding:'0' }}>
                  {showRegPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              {/* Validation mot de passe */}
              {regForm.password && (
                <div style={{ marginTop:'8px', display:'flex', flexDirection:'column', gap:'4px' }}>
                  {[
                    { ok: validations.longueur,  label:'Au moins 6 caractères' },
                    { ok: validations.majuscule, label:'Au moins 1 lettre majuscule' },
                    { ok: validations.chiffre,   label:'Au moins 1 chiffre' },
                  ].map(v => (
                    <div key={v.label} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', color: v.ok ? '#2e7d32' : '#cc4444' }}>
                      <span style={{ fontSize:'13px' }}>{v.ok ? '✓' : '✗'}</span>
                      {v.label}
                    </div>
                  ))}
                </div>
              )}
              {regErreurs.password && <span style={errStyle}>{regErreurs.password}</span>}
            </div>

            {/* Newsletter */}
            <label style={{ display:'flex', alignItems:'flex-start', gap:'10px', cursor:'pointer', fontSize:'12px', color:'#5a3a2a', lineHeight:'1.5' }}>
              <input type="checkbox"
                checked={regForm.newsletter}
                onChange={e => setRegForm({...regForm, newsletter: e.target.checked})}
                style={{ marginTop:'2px', flexShrink:0 }} />
                {t('Oui, envoyez-moi les actualités et offres exclusives Perle D&K. Je peux me désinscrire à tout moment.')}
            </label>

            <button type="submit" disabled={regLoading}
              style={{ background: C.or, color:'#fff', border:'none', padding:'13px', borderRadius:'6px', fontSize:'14px', cursor: regLoading ? 'not-allowed' : 'pointer', fontFamily:'Georgia,serif', marginTop:'4px', opacity: regLoading ? 0.7 : 1 }}>
              {regLoading ? 'Création...' : t("S'inscrire gratuitement")}
            </button>

          </form>
        </div>

      </div>

      {/* Footer simple */}
      <div style={{ background: C.brd, padding:'16px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
        <span style={{ color:'#c4906a', fontSize:'11px', letterSpacing:'1px' }}>
          © 2025 PERLE D&K PARFUMS
        </span>
        <div style={{ display:'flex', gap:'20px' }}>
          {['Conditions générales', 'Mentions légales', 'Protection des données'].map(l => (
            <span key={l} style={{ color:'#f0ddb8', fontSize:'11px', cursor:'pointer' }}>{l}</span>
          ))}
        </div>
      </div>

    </div>
  )
}