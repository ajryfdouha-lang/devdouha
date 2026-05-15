import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LangContext'
import axios from 'axios'

const C = { brd: '#6B1515', beige: '#F5E6C8', or: '#C4922A' }
const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconUserX = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <line x1="17" y1="3" x2="21" y2="7" />
    <line x1="21" y1="3" x2="17" y2="7" />
  </svg>
);

export default function MesCommandes() {
  const navigate = useNavigate()
  const { user, deconnexion } = useAuth()
  const { t } = useLang()
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading] = useState(true)
    const [favoris, setFavoris] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    axios.get('http://localhost:8000/api/mes-commandes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCommandes(res.data.data || []))
    .catch(() => setCommandes([]))
    .finally(() => setLoading(false))
  }, [])

  const statutColor = (s) => {
    if (s === 'livree')     return { bg: '#eafff0', color: '#2e7d32' }
    if (s === 'en_cours')   return { bg: '#fff8e1', color: '#f57c00' }
    if (s === 'annulee')    return { bg: '#ffeaea', color: '#cc4444' }
    return { bg: '#f0f0f0', color: '#666' }
  }

  const menuItems = [
    { label: t('apercu'),        path: '/'           },
    { label: t('mes_commandes'), path: '/commandes'  },
    { label: t('mes_favoris'),   path: '/favoris'    },
    { label: t('chg_mdp'),       path: '/password'   },
  ]

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh', fontFamily: "'Jost','Helvetica Neue',sans-serif" }}>

      {/* Navbar */}
      {/* Navbar simple */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e2d9', padding: '14px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '3px', fontFamily: 'Georgia,serif', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          PERLE <span style={{ color: C.or }}>D&K</span>
        </div>
        <div style={s.searchWrap}>
          <span style={s.searchIconWrap}><IconSearch /></span>
          <input type="text" placeholder="Search brand, fragrance, family..."
            style={s.searchInput} value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* User / Connexion */}
          {/* Auth */}
          {user ? (
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              {user.role === 'admin' && (
                <button onClick={() => navigate('/admin/produits')}
                  style={{ background:'#111', color:'#c9a96e', border:'none', padding:'5px 12px', borderRadius:'3px', fontSize:'10px', letterSpacing:'1px', cursor:'pointer', fontFamily:'inherit' }}>
                  ADMIN
                </button>
              )}
              <span style={{ fontSize:'12px', color:'#444' }}>{user.nom || user.name}</span>
              
              <button onClick={deconnexion} style={s.iconBtn} title="Déconnexion">
                <IconUserX />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} style={s.iconBtn} title="Connexion">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          )}

          {/* Favoris badge */}
          <button onClick={() => navigate('/favoris')}
  style={{ background: 'none', border: 'none', cursor: 'pointer', 
    color: '#444',  
    position: 'relative', display: 'flex', alignItems: 'center' }}>
  <svg width="18" height="18" viewBox="0 0 24 24" 
    fill="none"        
    stroke="#444"      
    strokeWidth="1.6">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
  {favoris.length > 0 && (
    <span style={{ position: 'absolute', top: -6, right: -6, background: C.brd, color: '#fff', fontSize: '9px', minWidth: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {favoris.length}
    </span>
  )}
</button>
          {/* Panier */}
          <button onClick={() => navigate('/panier')}
  style={{ background: 'none', border: 'none', cursor: 'pointer', 
    color: C.brd,  
    position: 'relative', display: 'flex', alignItems: 'center' }}>
  <svg width="18" height="18" viewBox="0 0 24 24" 
    fill="none" stroke={C.brd} strokeWidth="1.6">  {/* ← C.brd */}
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
</button>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px', padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Sidebar */}
        <div>
          <p style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '20px', fontFamily: 'Georgia,serif' }}>
            mon perle D&K
          </p>
          {menuItems.map(item => (
            <div key={item.label} onClick={() => navigate(item.path)}
              style={{
                padding: '10px 14px', fontSize: '13px', cursor: 'pointer',
                color: item.path === '/commandes' ? C.brd : '#555',
                fontWeight: item.path === '/commandes' ? '600' : '400',
                borderLeft: item.path === '/commandes' ? `3px solid ${C.brd}` : '3px solid transparent',
                marginBottom: '2px',
              }}>
              {item.label}
            </div>
          ))}
          <div style={{ borderTop: '1px solid #e8e2d9', marginTop: '12px', paddingTop: '12px' }}>
            <div style={{ padding: '10px 14px', fontSize: '13px', color: '#888', cursor: 'pointer' }}
              onClick={async () => { await deconnexion(); navigate('/login') }}>
              Se déconnecter
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontWeight: 'normal', fontSize: '24px', marginBottom: '24px', color: '#111' }}>
            Mes commandes
          </h1>

          {loading ? (
            <p style={{ color: '#888' }}>Chargement...</p>
          ) : commandes.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e8e2d9', borderRadius: '8px', padding: '60px 40px', textAlign: 'center' }}>
              <p style={{ color: '#8a7e74', fontSize: '15px', marginBottom: '20px' }}>Aucune commande pour le moment</p>
              <button onClick={() => navigate('/')}
                style={{ background: C.brd, color: C.beige, border: 'none', padding: '11px 28px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>
                Découvrir nos parfums
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {commandes.map(cmd => {
                const sc = statutColor(cmd.statut)
                return (
                  <div key={cmd.id} style={{ background: '#fff', border: '1px solid #e8e2d9', borderRadius: '8px', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>
                          Commande #{cmd.id}
                        </span>
                        <span style={{ fontSize: '12px', color: '#aaa', marginLeft: '12px' }}>
                          {cmd.created_at}
                        </span>
                      </div>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
                        {cmd.statut?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        <p style={{ margin: '2px 0' }}>📍 {cmd.adresse_livraison}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#111', margin: 0 }}>
                          {cmd.total_dh} MAD
                        </p>
                      </div>
                      {cmd.items && cmd.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#666' }}>
                        {item.nom} · {item.ml} × {item.quantite} — {(item.prix * item.quantite).toFixed(2)} MAD
                    </div>
                ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



const s = {
  page: {
    padding: '40px 20px',
    minHeight: '100vh',
    backgroundColor: '#faf8f5',
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: '#333'
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: '28px',
    fontWeight: 'normal',
    color: '#111',
    marginBottom: '30px',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #e0dcd6',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  cardBody: {
    padding: '18px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  brandName: {
    fontSize: '10px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#8a7e74',
    display: 'block',
    marginBottom: '4px'
  },
  perfumeName: {
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    fontWeight: '400',
    color: '#111',
    margin: '0 0 6px 0'
  },
  price: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid #f5f2eb'
  },
  addBtn: {
    background: '#111',
    color: '#fff',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#f9f6f0',
    border: '1px solid #e8e2d9',
    borderRadius: '4px',
    padding: '4px 12px',
    width: '280px'
  },
  searchIconWrap: {
    color: '#8a7e74',
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    padding: '6px 0',
    fontSize: '12px',
    width: '100%',
    fontFamily: 'inherit',
    color: '#111'
  },
  pageFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 5%',
    borderTop: '1px solid #e8e2d9',
    marginTop: '40px'
  },
  logo: {
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '2px',
    fontFamily: 'Georgia,serif'
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#444',
    padding: '4px',
    display: 'flex',
    alignItems: 'center'
  }
};




