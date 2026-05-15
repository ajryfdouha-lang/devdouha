import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLang } from '../i18n/LangContext'


const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg width="17" height="17" viewBox="0 0 24 24"
    fill={filled ? '#c0392b' : 'none'} stroke={filled ? '#c0392b' : 'currentColor'} strokeWidth="1.6">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconBag = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconPlus = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const BottlePlaceholder = ({ color = '#c9a96e' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
    <div style={{ width: 20, height: 10, background: color, borderRadius: '3px 3px 0 0', opacity: .9 }} />
    <div style={{ width: 14, height: 22, background: color, opacity: .75 }} />
    <div style={{ width: 66, height: 100, background: color, opacity: .65, borderRadius: '4px 4px 6px 6px' }} />
  </div>
);
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
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

const BOTTLE_COLORS = ['#c49a6a', '#3a2010', '#8b1a2a', '#1a3a5c', '#2a3a1a', '#5c3a6e', '#1a4a3a'];

export default function Home() {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [addedId, setAddedId]           = useState(null);
  const [activeSize, setActiveSize]     = useState({});
  const { user, deconnexion }           = useAuth();
  const [panierOuvert, setPanierOuvert] = useState(false);
  const favKey = user ? `favoris_${user.id}` : 'favoris_guest';
const [wishlist, setWishlist] = useState(
  JSON.parse(localStorage.getItem(favKey) || '[]').map(f => f.id)
);
  const navigate                        = useNavigate();
  
  const { panier, ajouterAuPanier, total, changerQuantite, supprimerDuPanier, nbArticles } = useCart();
  const { t, lang, setLang, langues } = useLang()
  
  
  useEffect(() => {
  const favKey = user ? `favoris_${user.id}` : 'favoris_guest';
  const data = JSON.parse(localStorage.getItem(favKey) || '[]').map(f => f.id);
  setWishlist(data);
}, [user]); // ← se recharge à chaque changement d'utilisateur
  
  
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/produits')
      .then(res => { setProducts(res.data.data || []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // ✅ APRÈS
const toggleWishlist = (produit) => {
  const favKey = user ? `favoris_${user.id}` : 'favoris_guest';
  const favorisActuels = JSON.parse(localStorage.getItem(favKey) || '[]');
  const existe = favorisActuels.find(f => f.id === produit.id);
  let nouveaux;
  if (existe) {
    nouveaux = favorisActuels.filter(f => f.id !== produit.id);
  } else {
    nouveaux = [...favorisActuels, {
      id:                produit.id,
      nom:               produit.nom,
      image_url:         produit.image_url,
      prix_30ml:         produit.prix_30ml,
      prix_50ml:         produit.prix_50ml,
      prix_100ml:        produit.prix_100ml,
      genre:             produit.genre,
      famille_olfactive: produit.famille_olfactive,
      brand:             produit.brand,
    }];
  }
  localStorage.setItem(favKey, JSON.stringify(nouveaux));
  setWishlist(nouveaux.map(f => f.id));
};

  const getSizeForProduct = (p) => {
    const chosen = activeSize[p.id];
    if (chosen) return chosen;
    if (p.prix_30ml)  return '30ml';
    if (p.prix_50ml)  return '50ml';
    if (p.prix_100ml) return '100ml';
    return null;
  };

  const getPriceForSize = (p, size) => {
    const map = { '30ml': p.prix_30ml, '50ml': p.prix_50ml, '100ml': p.prix_100ml };
    return map[size] ? Number(map[size]).toFixed(2) : null;
  };

  const handleAddToCart = (product, size) => {
    const ml = size || getSizeForProduct(product);
    ajouterAuPanier({
      id:         product.id,
      nom:        product.nom,
      image_url:  product.image_url,
      prix_30ml:  product.prix_30ml,
      prix_50ml:  product.prix_50ml,
      prix_100ml: product.prix_100ml,
    }, ml);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 700);
  };

  const filtered = products.filter(p => {
    const str = searchTerm.toLowerCase();
    const matchSearch = !str ||
      p.nom?.toLowerCase().includes(str) ||
      p.brand?.nom?.toLowerCase().includes(str) ||
      p.famille_olfactive?.toLowerCase().includes(str) ||
      p.genre?.toLowerCase().includes(str);
    const matchFilter =
      activeFilter === 'All'   ? true :
      activeFilter === 'Femme' ? p.genre?.toLowerCase() === 'femme' :
      activeFilter === 'Homme' ? p.genre?.toLowerCase() === 'homme' :
      activeFilter === 'Mixte' ? p.genre?.toLowerCase() === 'mixte' : true;
    return matchSearch && matchFilter;
  });

  if (loading) return (
    <div style={s.loader}>
      <div style={s.loaderDot} />
      <span style={{ fontSize: 13, letterSpacing: 3, color: '#8a7e74' }}>LOADING FRAGRANCES</span>
    </div>
  );

  if (error) return (
    <div style={s.errorPage}>
      <p style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#c9a96e' }}>Could not reach the store</p>
      <p style={{ fontSize: 13, color: '#888' }}>Make sure Laravel is running at <strong>http://127.0.0.1:8000</strong></p>
    </div>
  );

  return (
    <div style={s.page}>

      {/* ── NAVBAR ── */}
      
      <nav style={s.navbar}>
        <div style={s.logo}>PERLE <span style={{ color: '#c9a96e' }}>D&K</span></div>

        <div style={s.searchWrap}>
          <span style={s.searchIconWrap}><IconSearch /></span>
          <input type="text" placeholder="Search brand, fragrance, family..."
            style={s.searchInput} value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} />
        </div>

        <div style={s.navRight}>

          {/* Auth */}
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
          {/* Favoris navbar */}
          <button style={s.iconBtn} onClick={() => navigate('/favoris')} title="Favoris">
            <IconHeart filled={wishlist.length > 0} />
            {wishlist.length > 0 && <span style={s.navBadge}>{wishlist.length}</span>}
          </button>

          {/* Panier dropdown */}
          <div style={{ position:'relative' }}>
            <button style={{ ...s.iconBtn, position:'relative' }} onClick={() => setPanierOuvert(!panierOuvert)}>
              <IconBag />
              {nbArticles > 0 && <span style={s.navBadge}>{nbArticles}</span>}
            </button>
           



            {panierOuvert && (
              <div style={{ position:'absolute', top:'calc(100% + 12px)', right:0, width:'360px', background:'#fff', borderRadius:'8px', border:'1px solid #e8e2d9', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:999 }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e2d9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:'Georgia,serif', fontSize:'14px', fontWeight:'500' }}>Votre panier ({nbArticles})</span>
                  <button onClick={() => setPanierOuvert(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'18px', color:'#888' }}>×</button>
                </div>
                <div style={{ maxHeight:'320px', overflowY:'auto', padding:'8px 0' }}>
                  {panier.length === 0 ? (
                    <p style={{ textAlign:'center', padding:'30px 20px', color:'#8a7e74', fontSize:'13px' }}>Votre panier est vide</p>
                  ) : panier.map(item => (
                    <div key={`${item.id}-${item.ml}`} style={{ display:'flex', gap:'12px', padding:'12px 20px', borderBottom:'1px solid #f5f0ea', alignItems:'center' }}>
                      <div style={{ width:'60px', height:'60px', background:'#faf8f5', borderRadius:'4px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                        {item.image_url ? <img src={item.image_url} alt={item.nom} style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e => e.target.style.display='none'} /> : <div style={{ width:'20px', height:'40px', background:'#c9a96e', borderRadius:'2px 2px 4px 4px' }}/>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:'12px', fontWeight:'500', color:'#111', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.nom}</p>
                        <p style={{ fontSize:'11px', color:'#8a7e74', marginBottom:'4px' }}>{item.ml}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                          <button onClick={() => changerQuantite(item.id, item.ml, item.quantite-1)} style={{ width:'22px', height:'22px', border:'1px solid #e0dcd6', background:'#fff', borderRadius:'3px', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}>-</button>
                          <span style={{ fontSize:'12px', minWidth:'16px', textAlign:'center' }}>{item.quantite}</span>
                          <button onClick={() => changerQuantite(item.id, item.ml, item.quantite+1)} style={{ width:'22px', height:'22px', border:'1px solid #e0dcd6', background:'#fff', borderRadius:'3px', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                        </div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ fontSize:'13px', fontWeight:'600', color:'#111', marginBottom:'6px' }}>{(item.prix * item.quantite).toFixed(2)} MAD</p>
                        <button onClick={() => supprimerDuPanier(item.id, item.ml)} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:'11px' }}>× Retirer</button>
                      </div>
                    </div>
                  ))}
                </div>
                {panier.length > 0 && (
                  <div style={{ padding:'16px 20px', borderTop:'1px solid #e8e2d9' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                      <span style={{ fontSize:'12px', color:'#8a7e74' }}>Sous-total</span>
                      <span style={{ fontSize:'13px', fontWeight:'500' }}>{total.toFixed(2)} MAD</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                      <span style={{ fontSize:'12px', color:'#8a7e74' }}>Livraison</span>
                      <span style={{ fontSize:'12px', color:'#2e7d32', fontWeight:'500' }}>Gratuite</span>
                    </div>
                    <button onClick={() => { setPanierOuvert(false); navigate('/panier'); }}
                      style={{ width:'100%', background:'#6B1515', color:'#F5E6C8', border:'none', padding:'13px', borderRadius:'5px', fontSize:'13px', cursor:'pointer', marginBottom:'8px' }}>
                      {t('Valider la commande')}
                    </button>
                    <button onClick={() => setPanierOuvert(false)}
                      style={{ width:'100%', background:'transparent', color:'#444', border:'1px solid #e0dcd6', padding:'10px', borderRadius:'5px', fontSize:'12px', cursor:'pointer' }}>
                      {t('Continuer les achats')}
                    </button>
                    
                  </div>
                  
                )}

              </div>
              
            )}
          </div>
          {/* Sélecteur langue */}
<select
  value={lang}
  onChange={e => setLang(e.target.value)}
  style={{ background:'transparent', border:'1px solid #e0dcd6', color:'#444', padding:'4px 8px', borderRadius:'3px', fontSize:'11px', cursor:'pointer', fontFamily:'inherit' }}>
  {langues.map(l => (
    <option key={l} value={l}>{l.toUpperCase()}</option>
  ))}
</select>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={s.hero}>
        <div>
          <p style={s.heroEyebrow}>{t('Exclusive Collection 2025')}</p>
          <h1 style={s.heroTitle}>{t('The Art of')}<br /><em style={{ color: '#c9a96e', fontStyle: 'italic' }}>{t('Rare Fragrance')}</em></h1>
          <p style={s.heroSub}>{t('Curated luxury perfumes · Authentic brands')}</p>
        </div>
        <div style={s.heroBottles}>
          {['#c49a6a', '#3a2010', '#8b1a2a'].map((c, i) => (
            <div key={i} style={{ width: 60+i*8, height: 90+i*20, background: c, borderRadius: '30px 30px 6px 6px', opacity: .7, alignSelf: 'flex-end' }} />
          ))}
        </div>
      </div>

      {/* ── FILTRES ── */}
      <div style={s.filterBar}>
        {['All', 'Femme', 'Homme', 'Mixte'].map(f => (
          <button key={f} style={{ ...s.filterTab, ...(activeFilter===f ? s.filterTabActive : {}) }} onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
        <span style={s.resultCount}>{filtered.length} {t('fragrance')} {filtered.length !== 1 ? t('s') : ''}</span>
      </div>

      {/* ── GRILLE PRODUITS ── */}
      <main style={s.grid}>
        {filtered.length === 0 ? (
          <div style={s.empty}>{t('No fragrances found for "')} {searchTerm} {t('"')}</div>
        ) : filtered.map((product, i) => {
          const chosenSize   = getSizeForProduct(product);
          const displayPrice = getPriceForSize(product, chosenSize);
          const isWished     = wishlist.includes(product.id);
          const justAdded    = addedId === product.id;
          const bc           = BOTTLE_COLORS[i % BOTTLE_COLORS.length];
          const sizes        = [
            product.prix_30ml  ? '30ml'  : null,
            product.prix_50ml  ? '50ml'  : null,
            product.prix_100ml ? '100ml' : null,
          ].filter(Boolean);

          return (
            <div key={product.id} style={s.card}>

              {/* Zone image */}
              <div style={s.imgArea}>
                {/* Badges */}
                <div style={s.badges}>
                  {i < 4 && <span style={s.badgeNew}>{t('NEW')}</span>}
                  {product.brand?.nom && <span style={s.badgeLux}>{t('LUXURY')}</span>}
                </div>

                {/* Bouton cœur */}
                <button
                  style={{ position:'absolute', top:12, right:12, background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', alignItems:'center', zIndex:2 }}
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                  title="Ajouter aux favoris">
                  <IconHeart filled={isWished} />
                </button>

                {/* Image */}
                {product.image_url ? (
                  <img src={product.image_url} alt={product.nom} style={s.productImg}
                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                ) : null}
                <div style={{ display: product.image_url ? 'none' : 'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%' }}>
                  <BottlePlaceholder color={bc} />
                </div>
              </div>

              {/* Corps carte */}
              <div style={s.cardBody}>
                <span style={s.brandName}>{product.brand?.nom || 'Collection'}</span>
                <h3 style={s.perfumeName}>{product.nom}</h3>
                <p style={s.genre}>{product.genre}{product.famille_olfactive ? ` · ${product.famille_olfactive}` : ''}</p>

                {sizes.length > 1 && (
                  <div style={s.sizeRow}>
                    {sizes.map(sz => (
                      <button key={sz}
                        style={{ ...s.sizePill, ...(chosenSize===sz ? s.sizePillActive : {}) }}
                        onClick={() => setActiveSize(prev => ({ ...prev, [product.id]: sz }))}>
                        {sz}
                      </button>
                    ))}
                  </div>
                )}

                <div style={s.cardFooter}>
                  <div>
                    <span style={s.price}>{displayPrice ? `${displayPrice} MAD` : 'Sur devis'}</span>
                    <br />
                    <span style={s.sizeLabel}>{chosenSize || ''}</span>
                  </div>
                  <button
                    style={{ ...s.addBtn, background: justAdded ? '#c9a96e' : '#111' }}
                    onClick={() => handleAddToCart(product, chosenSize)}>
                    <IconPlus />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* ── FOOTER ── */}
      <footer style={s.pageFooter}>
        <span style={s.logo}>PERLE <span style={{ color: '#c9a96e' }}>D&K</span></span>
        <span style={{ fontSize: 11, color: '#8a7e74', letterSpacing: 1 }}>© 2025 · All rights reserved</span>
      </footer>
    </div>
  );
}

const s = {
  page:          { backgroundColor: '#f8f5f0', minHeight: '100vh', fontFamily: "'Jost','Helvetica Neue',sans-serif", color: '#2a2320' },
  loader:        { display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8f5f0' },
  loaderDot:     { width: 8, height: 8, borderRadius: '50%', background: '#c9a96e' },
  errorPage:     { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 40, background: '#f8f5f0' },
  navbar:        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 5%', background: '#fff', borderBottom: '1px solid #e8e2d9', position: 'sticky', top: 0, zIndex: 100, gap: 20 },
  logo:          { fontSize: 20, fontWeight: 700, letterSpacing: 3, fontFamily: 'Georgia,serif', color: '#111', whiteSpace: 'nowrap' },
  searchWrap:    { position: 'relative', flex: 1, maxWidth: 440 },
  searchIconWrap:{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' },
  searchInput:   { width: '100%', padding: '9px 9px 9px 28px', border: 'none', borderBottom: '1.5px solid #e8e2d9', background: 'transparent', fontFamily: 'inherit', fontSize: 13, letterSpacing: .5, color: '#2a2320', outline: 'none' },
  navRight:      { display: 'flex', gap: 20, alignItems: 'center' },
  iconBtn:       { background: 'none', border: 'none', cursor: 'pointer', color: '#444', position: 'relative', padding: 4, display: 'flex', alignItems: 'center' },
  navBadge:      { position: 'absolute', top: -4, right: -4, background: '#111', color: '#fff', fontSize: 9, minWidth: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  hero:          { background: 'linear-gradient(135deg,#1a1208 0%,#2d1e0e 60%,#1a1208 100%)', padding: '52px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' },
  heroEyebrow:   { fontSize: 10, letterSpacing: 4, color: '#c9a96e', textTransform: 'uppercase', marginBottom: 12 },
  heroTitle:     { fontFamily: 'Georgia,serif', fontSize: 46, fontWeight: 300, color: '#fff', lineHeight: 1.1, margin: '0 0 14px' },
  heroSub:       { fontSize: 12, letterSpacing: 2, color: 'rgba(255,255,255,.45)' },
  heroBottles:   { display: 'flex', gap: 16, alignItems: 'flex-end', opacity: .6 },
  filterBar:     { display: 'flex', alignItems: 'center', padding: '0 5%', background: '#fff', borderBottom: '1px solid #e8e2d9', gap: 0, overflowX: 'auto' },
  filterTab:     { padding: '13px 22px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#8a7e74', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' },
  filterTabActive:{ color: '#111', borderBottomColor: '#c9a96e' },
  resultCount:   { marginLeft: 'auto', fontSize: 11, color: '#aaa', letterSpacing: 1, paddingRight: 4, whiteSpace: 'nowrap' },
  grid:          { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1px', background: '#e8e2d9', padding: '0 5% 5%' },
  empty:         { gridColumn: '1/-1', padding: '80px 20px', textAlign: 'center', color: '#8a7e74', fontSize: 14, letterSpacing: 1 },
  card:          { background: '#fff', position: 'relative', cursor: 'pointer' },
  imgArea:       { height: 310, background: '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  productImg:    { maxHeight: '80%', maxWidth: '75%', objectFit: 'contain' },
  badges:        { position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 5 },
  badgeNew:      { background: '#fff', color: '#111', fontSize: 9, letterSpacing: 2, padding: '4px 8px', border: '1px solid #e0dcd6', display: 'inline-block' },
  badgeLux:      { background: '#111', color: '#fff', fontSize: 9, letterSpacing: 2, padding: '4px 8px', display: 'inline-block' },
  cardBody:      { padding: '18px 20px 20px' },
  brandName:     { fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: '#8a7e74', display: 'block' },
  perfumeName:   { fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 400, color: '#111', margin: '5px 0 3px' },
  genre:         { fontSize: 11, color: '#aaa', letterSpacing: .5, textTransform: 'capitalize' },
  sizeRow:       { display: 'flex', gap: 5, marginTop: 10 },
  sizePill:      { fontSize: 9, letterSpacing: 1, padding: '3px 9px', border: '1px solid #e0dcd6', background: 'none', color: '#aaa', cursor: 'pointer', fontFamily: 'inherit' },
  sizePillActive:{ borderColor: '#111', color: '#111' },
  cardFooter:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  price:         { fontSize: 20, fontWeight: 600, color: '#111' },
  sizeLabel:     { fontSize: 10, color: '#bbb', letterSpacing: .5 },
  addBtn:        { background: '#111', color: '#fff', border: 'none', width: 38, height: 38, borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pageFooter:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 5%', background: '#fff', borderTop: '1px solid #e8e2d9', marginTop: 1 },
};