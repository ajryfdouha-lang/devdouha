import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }

const menus = [
  { label:'Produits',          path:'/admin/produits'  },
  { label:'Brands',            path:'/admin/brands'    },
  { label:'Variantes',         path:'/admin/variantes' },
  { label:'Commandes',         path:'/admin/commandes' },
  { label:'Rapports & XML',   path:'/admin/rapports'  },
  
]

export default function AdminLayout({ children, titre }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, deconnexion } = useAuth()

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'Georgia,serif' }}>

      {/* Sidebar */}
      <div style={{ width:'200px', background: C.brd, flexShrink:0 }}>
        <div style={{ padding:'16px', borderBottom:'1px solid #8B2020', marginBottom:'8px' }}>
          <div style={{ color: C.or, fontSize:'15px' }}>Perle D&K</div>
          <div style={{ color:'#c4906a', fontSize:'10px', marginTop:'2px' }}>Administration</div>
        </div>

        {menus.map(m => (
          <div key={m.path} onClick={() => navigate(m.path)}
            style={{
              padding:'10px 16px', fontSize:'12px', cursor:'pointer',
              color: location.pathname === m.path ? C.beige : '#f0ddb8',
              background: location.pathname === m.path ? '#8B2020' : 'transparent',
              borderLeft: location.pathname === m.path ? `3px solid ${C.or}` : '3px solid transparent',
            }}>
            {m.label}
          </div>
        ))}

        <div style={{ position:'absolute', bottom:'20px', padding:'12px 16px', borderTop:'1px solid #8B2020', width:'200px' }}>
          <div style={{ color:'#c4906a', fontSize:'11px' }}>{user?.email}</div>
          <div onClick={deconnexion}
            style={{ color:'#f0ddb8', fontSize:'10px', marginTop:'4px', cursor:'pointer', textDecoration:'underline' }}>
            Déconnexion
          </div>
        </div>
      </div>

<div style={{ flex:1, background:'#FAF0DC', padding:'24px', overflow:'auto' }}>

  {/* Bouton retour accueil */}
  <div style={{ marginBottom:'16px' }}>
    <button
      onClick={() => navigate('/')}
      style={{
        background:'transparent',
        border:'1px solid #6B1515',
        color:'#6B1515',
        padding:'6px 16px',
        borderRadius:'5px',
        fontSize:'12px',
        cursor:'pointer',
        fontFamily:'Georgia,serif',
        display:'flex',
        alignItems:'center',
        gap:'6px',
      }}>
      {/* Flèche retour */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
      Retour à l'accueil
    </button>
  </div>
 {/* Contenu principal */}
      <div style={{ flex:1, background:'#FAF0DC', padding:'24px', overflow:'auto' }}>
        {children}
      </div>

</div>




     
    </div>
  )
}