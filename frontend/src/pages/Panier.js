import { useState  , useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LangContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


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


export default function Panier() {
  const { panier, supprimerDuPanier, changerQuantite, total, viderPanier } = useCart()
  // const { user } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  
//  const navigate = useNavigate();
  const { ajouterAuPanier } = useCart();
  const { user, deconnexion } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Ajouter après les useState
const favKey = user ? `favoris_${user.id}` : 'favoris_guest';

// ✅ Ajouter ceci
useEffect(() => {
  const data = JSON.parse(localStorage.getItem(favKey) || '[]');
  setFavoris(data);
}, [favKey]);
  
  const [etape, setEtape]           = useState(1)
  const [paiement, setPaiement]     = useState('livraison')
  const [loading, setLoading]       = useState(false)
  const [message, setMessage]       = useState('')
  const [form, setForm]             = useState({
    nom:      user?.nom  || '',
    email:    user?.email || '',
    telephone:'',
    adresse:  user?.adresse || '',
    ville:    user?.ville   || '',
  })
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

const validerCommande = async () => {
  if (!localStorage.getItem('token')) {
    navigate('/login')
    return
  }
  if (!form.nom || !form.adresse || !form.telephone) {
    setMessage('Veuillez remplir tous les champs obligatoires')
    return
  }

  setLoading(true)
  setMessage('')

  try {
    await axios.post(
      'http://localhost:8000/api/commandes',
      {
        adresse_livraison: `${form.adresse}, ${form.ville}`,
        telephone:         form.telephone,
        paiement:          paiement,
        total_centimes:    Math.round(total * 100),
        items: panier.map(i => ({
          produit_id: i.id,
          ml:         i.ml,
          quantite:   i.quantite,
          prix:       i.prix,
          nom:        i.nom,
        })),
      },
      { headers: getHeaders() }   // ← correction ici
    )
    viderPanier()
    setEtape(3)
  } catch (err) {
    console.log('Erreur détail:', err.response?.data)
    const errors = err.response?.data?.errors
    if (errors) {
      const premier = Object.values(errors)[0]
      setMessage(Array.isArray(premier) ? premier[0] : premier)
    } else {
      setMessage(err.response?.data?.message || 'Erreur lors de la commande')
    }
  }
  setLoading(false)
}



  const inputStyle = {
    width:'100%', border:'1px solid #e0dcd6', borderRadius:'5px',
    padding:'10px 12px', fontSize:'13px', fontFamily:'Georgia,serif',
    color:'#2a1e14', boxSizing:'border-box', outline:'none',
  }
  const labelStyle = { fontSize:'12px', color:'#666', marginBottom:'4px', display:'block' }
 
  
  return (
    <div style={{ background:'#f8f5f0', minHeight:'100vh', fontFamily:"'Jost','Helvetica Neue',sans-serif" }}>

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




      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e8e2d9', padding:'14px 5%', display:'flex', alignItems:'center', gap:'16px' }}>
        <button onClick={() => navigate('/')}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#444', display:'flex', alignItems:'center', gap:'6px', fontSize:'13px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {t('Continuer les achats')}
        </button>
        <span style={{ fontSize:'18px', fontFamily:'Georgia,serif', fontWeight:'400' }}>
          Votre panier ({panier.reduce((a,i) => a+i.quantite, 0)})
        </span>
      </div>

      {/* Étapes */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e8e2d9', padding:'0 5%', display:'flex', gap:'0' }}>
        {[
          { n:1, label:t('Panier') },
          { n:2, label:t('Commande') },
          { n:3, label:t('Confirmation') },
        ].map((e, i) => (
          <div key={e.n} style={{ display:'flex', alignItems:'center' }}>
            <div style={{ padding:'14px 20px', fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase', color: etape===e.n ? '#111' : '#aaa', borderBottom: etape===e.n ? '2px solid #c9a96e' : '2px solid transparent', cursor: e.n < etape ? 'pointer' : 'default' }}
              onClick={() => e.n < etape && setEtape(e.n)}>
              <span style={{ marginRight:'6px', fontWeight:'600' }}>{e.n}</span>{e.label}
            </div>
            {i < 2 && <span style={{ color:'#ddd', fontSize:'16px' }}>›</span>}
          </div>
        ))}
      </div>

      {message && (
        <div style={{ background:'#ffeaea', color:'#cc4444', padding:'12px 5%', fontSize:'13px', borderBottom:'1px solid #ffcccc' }}>
          {message}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'24px', padding:'24px 5%', maxWidth:'1200px', margin:'0 auto' }}>

        {/* ── COLONNE GAUCHE ── */}
        <div>

          {/* ÉTAPE 1 — Panier */}
          {etape === 1 && (
            <div>
              {/* Alertes */}
              {panier.some(i => i.stock < 5) && (
                <div style={{ background:'#fff8e1', border:'1px solid #ffe082', borderRadius:'6px', padding:'12px 16px', marginBottom:'16px', fontSize:'12px', color:'#795548', display:'flex', gap:'8px', alignItems:'center' }}>
                  <span style={{ color:'#ff9800', fontSize:'16px' }}>⚡</span>
                  Un de vos produits est presque épuisé. Les articles ne sont pas réservés.
                </div>
              )}

              {/* Avantages */}
              <div style={{ background:'#fff', borderRadius:'8px', padding:'16px 20px', marginBottom:'16px', display:'flex', gap:'24px', flexWrap:'wrap' }}>
                {[
                  { icon:'🚚', label:t('Livraison rapide') },
                  { icon:'🔒', label:t('Paiement sécurisé') },
                  { icon:'↩️', label:t('Retour 30 jours') },
                ].map(a => (
                  <div key={a.label} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#666' }}>
                    <span style={{ fontSize:'18px' }}>{a.icon}</span>{a.label}
                  </div>
                ))}
              </div>

              {/* Liste articles */}
              {panier.length === 0 ? (
                <div style={{ background:'#fff', borderRadius:'8px', padding:'60px 20px', textAlign:'center' }}>
                  <p style={{ color:'#8a7e74', fontSize:'14px', marginBottom:'16px' }}>Votre panier est vide</p>
                  <button onClick={() => navigate('/')}
                    style={{ background:'#111', color:'#fff', border:'none', padding:'10px 24px', borderRadius:'4px', fontSize:'13px', cursor:'pointer' }}>
                    Découvrir nos parfums
                  </button>
                </div>
              ) : panier.map(item => (
                <div key={`${item.id}-${item.ml}`}
                  style={{ background:'#fff', borderRadius:'8px', padding:'20px', marginBottom:'12px', display:'flex', gap:'16px', alignItems:'flex-start' }}>

                  {/* Image */}
                  <div style={{ width:'90px', height:'90px', background:'#faf8f5', borderRadius:'4px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.nom}
                        style={{ width:'100%', height:'100%', objectFit:'contain' }}
                        onError={e => e.target.style.display='none'} />
                    ) : (
                      <div style={{ width:'24px', height:'50px', background:'#c9a96e', borderRadius:'3px 3px 5px 5px' }}/>
                    )}
                  </div>

                  {/* Infos */}
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'14px', fontWeight:'600', color:'#111', marginBottom:'3px' }}>{item.nom}</p>
                    <p style={{ fontSize:'12px', color:'#8a7e74', marginBottom:'3px' }}>Eau de Parfum</p>
                    <p style={{ fontSize:'12px', color:'#aaa', marginBottom:'10px' }}>1 × {item.ml}</p>

                    {/* Quantité */}
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ display:'flex', alignItems:'center', border:'1px solid #e0dcd6', borderRadius:'4px', overflow:'hidden' }}>
                        <button onClick={() => changerQuantite(item.id, item.ml, item.quantite - 1)}
                          style={{ width:'32px', height:'32px', background:'#f8f5f0', border:'none', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          −
                        </button>
                        <span style={{ width:'36px', textAlign:'center', fontSize:'13px', fontWeight:'500' }}>{item.quantite}</span>
                        <button onClick={() => changerQuantite(item.id, item.ml, item.quantite + 1)}
                          style={{ width:'32px', height:'32px', background:'#f8f5f0', border:'none', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          +
                        </button>
                      </div>

                      <button onClick={() => supprimerDuPanier(item.id, item.ml)}
                        style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:'12px', display:'flex', alignItems:'center', gap:'4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Retirer
                      </button>
                    </div>
                  </div>

                  {/* Prix */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <p style={{ fontSize:'16px', fontWeight:'600', color:'#111' }}>
                      {(item.prix * item.quantite).toFixed(2)} MAD
                    </p>
                    <p style={{ fontSize:'11px', color:'#aaa' }}>{item.prix} MAD / unité</p>
                  </div>
                </div>
              ))}

              {panier.length > 0 && (
                <button onClick={() => setEtape(2)}
                  style={{ width:'100%', background:'#111', color:'#fff', border:'none', padding:'14px', borderRadius:'5px', fontSize:'14px', cursor:'pointer', fontFamily:'inherit', marginTop:'8px' }}>
                  {t('Passer la commande →')}
                </button>
              )}
            </div>
          )}

          {/* ÉTAPE 2 — Formulaire commande */}
          {etape === 2 && (
            <div style={{ background:'#fff', borderRadius:'8px', padding:'24px' }}>
              <h2 style={{ fontFamily:'Georgia,serif', fontWeight:'normal', fontSize:'18px', marginBottom:'20px', color:'#111' }}>
                {t("Informations de livraison")}
              </h2>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={labelStyle}>{t('Nom complet')} *</label>
                  <input name="nom" value={form.nom} onChange={handleChange} style={inputStyle} placeholder="Prénom Nom"/>
                </div>
                <div>
                  <label style={labelStyle}>{t('Email')} *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="email@exemple.com"/>
                </div>
                <div>
                  <label style={labelStyle}>{t('Téléphone')} *</label>
                  <input name="telephone" value={form.telephone} onChange={handleChange} style={inputStyle} placeholder="+212 6XX XXX XXX"/>
                </div>
                <div>
                  <label style={labelStyle}>{t('Adresse')} *</label>
                  <input name="adresse" value={form.adresse} onChange={handleChange} style={inputStyle} placeholder="Rue, N°..."/>
                </div>
                <div>
                  <label style={labelStyle}>{t('Ville')} *</label>
                  <input name="ville" value={form.ville} onChange={handleChange} style={inputStyle} placeholder="Casablanca"/>
                </div>
              </div>

              {/* Résumé produits */}
              <div style={{ marginTop:'20px', background:'#f8f5f0', borderRadius:'6px', padding:'14px' }}>
                {panier.map(item => (
                  <div key={`${item.id}-${item.ml}`} style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'6px', color:'#555' }}>
                    <span>{item.nom} {item.ml} × {item.quantite}</span>
                    <span style={{ fontWeight:'500' }}>{(item.prix * item.quantite).toFixed(2)} MAD</span>
                  </div>
                ))}
              </div>

              {/* Choix paiement */}
              <div style={{ marginTop:'20px' }}>
                <p style={{ fontSize:'13px', fontWeight:'500', marginBottom:'10px', color:'#333' }}>Mode de paiement</p>
                {[
                  { val:'livraison', label:'Paiement à la livraison', desc:'Payez en espèces à la réception' },
                  { val:'virement',  label:'Virement bancaire',       desc:'Coordonnées envoyées par email' },
                ].map(p => (
                  <label key={p.val} style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'10px', cursor:'pointer', padding:'12px', border:`1px solid ${paiement===p.val ? '#111' : '#e0dcd6'}`, borderRadius:'6px', background: paiement===p.val ? '#faf8f5' : '#fff' }}>
                    <input type="radio" name="paiement" value={p.val} checked={paiement===p.val} onChange={() => setPaiement(p.val)} style={{ marginTop:'2px' }}/>
                    <div>
                      <p style={{ fontSize:'13px', fontWeight:'500', color:'#111' }}>{p.label}</p>
                      <p style={{ fontSize:'11px', color:'#888', marginTop:'2px' }}>{p.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
                <button onClick={() => setEtape(1)}
                  style={{ flex:1, background:'transparent', border:'1px solid #e0dcd6', color:'#444', padding:'12px', borderRadius:'5px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit' }}>
                  ← Retour
                </button>
                <button onClick={validerCommande} disabled={loading}
                  style={{ flex:2, background:'#111', color:'#fff', border:'none', padding:'12px', borderRadius:'5px', fontSize:'13px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'inherit', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Traitement...' : 'Confirmer la commande'}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Confirmation */}
          {etape === 3 && (
            <div style={{ background:'#fff', borderRadius:'8px', padding:'48px 24px', textAlign:'center' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'#eaf3de', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'28px' }}>
                ✓
              </div>
              <h2 style={{ fontFamily:'Georgia,serif', fontWeight:'normal', fontSize:'22px', marginBottom:'8px', color:'#111' }}>
                Merci pour votre commande !
              </h2>
              <p style={{ color:'#8a7e74', fontSize:'13px', marginBottom:'6px' }}>
                Un email de confirmation a été envoyé à <strong>{form.email}</strong>
              </p>
              <p style={{ color:'#8a7e74', fontSize:'13px', marginBottom:'24px' }}>
                Livraison prévue : 2-4 jours ouvrables
              </p>
              <button onClick={() => navigate('/')}
                style={{ background:'#111', color:'#fff', border:'none', padding:'12px 32px', borderRadius:'4px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit' }}>
                Continuer mes achats
              </button>
            </div>
          )}

        </div>

        {/* ── COLONNE DROITE — Résumé total ── */}
        {etape < 3 && (
          <div>
            <div style={{ background:'#fff', borderRadius:'8px', padding:'20px', position:'sticky', top:'80px' }}>
              <h3 style={{ fontFamily:'Georgia,serif', fontWeight:'normal', fontSize:'18px', marginBottom:'16px', color:'#111' }}>
                Total
              </h3>

              {/* Mini liste */}
              <div style={{ marginBottom:'16px', maxHeight:'200px', overflowY:'auto' }}>
                {panier.map(item => (
                  <div key={`${item.id}-${item.ml}`} style={{ display:'flex', gap:'10px', marginBottom:'10px', alignItems:'center' }}>
                    <div style={{ width:'44px', height:'44px', background:'#faf8f5', borderRadius:'3px', flexShrink:0, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.nom} style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e => e.target.style.display='none'}/>
                      ) : (
                        <div style={{ width:'14px', height:'28px', background:'#c9a96e', borderRadius:'2px 2px 3px 3px' }}/>
                      )}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:'11px', fontWeight:'500', color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.nom}</p>
                      <p style={{ fontSize:'10px', color:'#aaa' }}>{item.ml} · ×{item.quantite}</p>
                    </div>
                    <span style={{ fontSize:'12px', fontWeight:'500', flexShrink:0 }}>{(item.prix * item.quantite).toFixed(2)} MAD</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop:'1px solid #e8e2d9', paddingTop:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#666', marginBottom:'8px' }}>
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#666', marginBottom:'12px' }}>
                  <span>Livraison</span>
                  <span style={{ color:'#2e7d32', fontWeight:'500' }}>Gratuite</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'15px', fontWeight:'700', color:'#111', paddingTop:'10px', borderTop:'1px solid #e8e2d9', marginBottom:'16px' }}>
                  <span>Total TTC</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>

                {etape === 1 && panier.length > 0 && (
                  <button onClick={() => setEtape(2)}
                    style={{ width:'100%', background:'#6B1515', color:'#F5E6C8', border:'none', padding:'13px', borderRadius:'5px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif', marginBottom:'10px' }}>
                    {t("Valider ma commande")}
                  </button>
                )}

                {/* Sécurité */}
                <div style={{ display:'flex', alignItems:'center', gap:'6px', justifyContent:'center', color:'#aaa', fontSize:'11px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  {t("Paiement 100% sécurisé")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer avantages */}
      <div style={{ background:'#fff', borderTop:'1px solid #e8e2d9', padding:'20px 5%', display:'flex', gap:'24px', justifyContent:'center', flexWrap:'wrap' }}>
        {[
          { icon:'🏆', label:'Produits authentiques' },
          { icon:'🔒', label:'Paiement sécurisé'    },
          { icon:'↩️', label:'Retour 30 jours'      },
          { icon:'🚚', label:'Livraison 2-4 jours'  },
        ].map(a => (
          <div key={a.label} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#666' }}>
            <span>{a.icon}</span>{a.label}
          </div>
        ))}
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