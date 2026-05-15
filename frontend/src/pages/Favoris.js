import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n/LangContext'

const C = { brd: '#6B1515', beige: '#F5E6C8', or: '#C4922A' };

const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

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



export default function Favoris() {
  const navigate = useNavigate();
  const { ajouterAuPanier } = useCart();
  const { user, deconnexion } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Ajouter après les useState
const favKey = user ? `favoris_${user.id}` : 'favoris_guest';

//  Remplacer l'useEffect
useEffect(() => {
  const data = JSON.parse(localStorage.getItem(favKey) || '[]');
  setFavoris(data);
}, [favKey]);

//  Remplacer retirerFavori
const retirerFavori = (id) => {
  const nouveaux = favoris.filter(f => f.id !== id);
  localStorage.setItem(favKey, JSON.stringify(nouveaux));
  setFavoris(nouveaux);
};
  const { t } = useLang()

  const ajouterPanier = (produit) => {
    ajouterAuPanier({
      id: produit.id,
      nom: produit.nom,
      image_url: produit.image_url,
      prix_30ml: produit.prix_30ml,
      prix_50ml: produit.prix_50ml,
      prix_100ml: produit.prix_100ml,
    }, '30ml');
    setAddedId(produit.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const menuItems = [
{ label: t('apercu'),         path:'/'          },
{ label: t('mes_commandes'),  path:'/commandes' },
{ label: t('mes_favoris'),    path:'/favoris'   },
{ label: t('chg_mdp'),        path:'/password'  },
  ];

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh', fontFamily: "'Jost','Helvetica Neue',sans-serif", color: '#2a2320' }}>

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
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.brd, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={C.brd} stroke={C.brd} strokeWidth="1.6">
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
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px', padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Sidebar ── */}
        <div>
          <p style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '20px', fontFamily: 'Georgia,serif' }}>
            mon perle D&K
          </p>
          {menuItems.map(item => (
            <div key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                padding: '10px 14px', fontSize: '13px', cursor: 'pointer',
                color: item.path === '/favoris' ? C.brd : '#555',
                fontWeight: item.path === '/favoris' ? '600' : '400',
                borderLeft: item.path === '/favoris' ? `3px solid ${C.brd}` : '3px solid transparent',
                marginBottom: '2px',
              }}>
              {item.label}
            </div>
          ))}
          <div style={{ borderTop: '1px solid #e8e2d9', marginTop: '12px', paddingTop: '12px' }}>
            <div style={{ padding: '10px 14px', fontSize: '13px', color: '#888', cursor: 'pointer' }}
              onClick={async () => {
                await deconnexion();
                navigate('/login');
              }}>
              {t('Se déconnecter')}
            </div>
          </div>
        </div>

        {/* ── Contenu ── */}
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontWeight: 'normal', fontSize: '24px', marginBottom: '24px', color: '#111' }}>
            {t('Ma liste de souhaits')}
          </h1>

          {favoris.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e8e2d9', borderRadius: '8px', padding: '60px 40px', textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2" style={{ display: 'block', margin: '0 auto 16px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <p style={{ color: '#8a7e74', fontSize: '15px', marginBottom: '20px' }}>
                {t('Votre liste de souhaits est vide')}
              </p>
              <button onClick={() => navigate('/')}
                style={{ background: C.brd, color: C.beige, border: 'none', padding: '11px 28px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                {t('Découvrir nos parfums')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {favoris.map((p, i) => (
                <div key={p.id} style={{ background: '#fff', borderTop: i === 0 ? '1px solid #e8e2d9' : 'none', borderBottom: '1px solid #e8e2d9', borderLeft: '1px solid #e8e2d9', borderRight: '1px solid #e8e2d9', borderRadius: i === 0 ? '8px 8px 0 0' : i === favoris.length - 1 ? '0 0 8px 8px' : '0', padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

                  {/* Image avec badge */}
                  <div style={{ position: 'relative', width: '120px', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, background: C.brd, color: C.beige, fontSize: '9px', letterSpacing: '2px', padding: '4px 8px', zIndex: 1, fontWeight: '600' }}>
                      {t('NEW')}
                    </div>
                    <div style={{ width: '120px', height: '120px', background: '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.nom}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <div style={{ width: '30px', height: '60px', background: C.or, borderRadius: '4px 4px 6px 6px' }}/>
                      )}
                    </div>
                  </div>

                  {/* Infos produit */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '3px' }}>
                      {p.brand?.nom || 'Perle D&K'}
                    </p>
                    <p style={{ fontSize: '17px', fontFamily: 'Georgia,serif', color: '#111', marginBottom: '4px' }}>
                      {p.nom}
                    </p>
                    <p style={{ fontSize: '12px', color: '#8a7e74', marginBottom: '10px' }}>
                      Eau de Parfum · {p.genre} · {p.famille_olfactive}
                    </p>

                    {/* Achetés récemment */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fff8f0', border: '1px solid #fde0c0', borderRadius: '20px', padding: '5px 12px', fontSize: '11px', color: '#cc7700', marginBottom: '10px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#cc7700" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      {t('Acheté récemment')}
                    </div>

                    {/* Taille */}
                    <p style={{ fontSize: '12px', color: '#888' }}>
                      1 × {p.prix_30ml ? '30ml' : p.prix_50ml ? '50ml' : '100ml'}
                    </p>

                    {/* Étoiles */}
                    <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= 4 ? C.or : '#ddd'} stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Prix + actions */}
                  <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '130px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: '700', color: '#111' }}>
                        {p.prix_30ml ? `${Number(p.prix_30ml).toFixed(2)} MAD` : '—'}
                      </p>
                      {p.prix_50ml && (
                        <p style={{ fontSize: '11px', color: '#aaa', textDecoration: 'line-through' }}>
                          {Number(p.prix_50ml).toFixed(2)} MAD
                        </p>
                      )}
                    </div>

                    {/* Boutons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => ajouterPanier(p)}
                        title="Ajouter au panier"
                        style={{ width: '40px', height: '40px', border: '1px solid #e0dcd6', borderRadius: '4px', background: addedId === p.id ? '#eafff0' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {addedId === p.id ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6">
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                              <line x1="3" y1="6" x2="21" y2="6"/>
                              <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                            <span style={{ position: 'absolute', top: -4, right: -4, background: '#111', color: '#fff', fontSize: '8px', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</span>
                          </>
                        )}
                      </button>

                      <button onClick={() => retirerFavori(p.id)}
                        title="Retirer des favoris"
                        style={{ width: '40px', height: '40px', border: '1px solid #e0dcd6', borderRadius: '4px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={s.pageFooter}>
        <span style={s.logo}>PERLE <span style={{ color: '#c9a96e' }}>D&K</span></span>
        <span style={{ fontSize: 11, color: '#8a7e74', letterSpacing: 1 }}>© 2025 · All rights reserved</span>
      </footer>
    </div>
  );
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