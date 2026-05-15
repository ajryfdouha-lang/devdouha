import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'


export default function Navbar() {
  return null
}
// const C = { bordeaux:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }

// export default function Navbar() {
//   const { t, lang, setLang, langues } = useLang()
//   const { nbArticles } = useCart()
//   const { user, deconnexion } = useAuth()
//   const navigate = useNavigate()

//   return (
//     <nav style={{
//       background: C.bordeaux,
//       padding:'10px 28px',
//       display:'flex',
//       alignItems:'center',
//       justifyContent:'space-between',
//       flexWrap:'wrap',
//       gap:'10px'
//     }}>

//       {/* Logo */}
//       <Link to="/">
//         <img src={logo} alt="Perle D&K Parfums" style={{ height:'48px' }} />
//       </Link>

//       {/* Liens navigation */}
//       <div style={{ display:'flex', gap:'20px', alignItems:'center' }}>
//         {[
//           ['/',        t('accueil')],
//           ['/femmes',  t('femmes') ],
//           ['/hommes',  t('hommes') ],
//           ['/packs',   t('packs')  ],
//           ['/contact', t('contact')],
//         ].map(([path, label]) => (
//           <Link key={path} to={path}
//             style={{ color:'#f0ddb8', fontSize:'12px', textDecoration:'none', letterSpacing:'1px' }}>
//             {label}
//           </Link>
//         ))}
//       </div>

//       {/* Droite — langue + favoris + connexion + panier */}
//       <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>

//         {/* Sélecteur langue */}
//         <select
//           value={lang}
//           onChange={e => setLang(e.target.value)}
//           style={{
//             background:'transparent', border:`1px solid ${C.or}`,
//             color: C.or, padding:'4px 8px', borderRadius:'4px',
//             fontSize:'11px', cursor:'pointer'
//           }}>
//           {langues.map(l => (
//             <option key={l} value={l} style={{ background: C.bordeaux }}>
//               {l.toUpperCase()}
//             </option>
//           ))}
//         </select>

//         {/* Favoris */}
//         {/* <button onClick={() => navigate('/favoris')}
//           style={{ background:'transparent', border:'none', cursor:'pointer', padding:'4px', position:'relative' }}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0ddb8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
//           </svg>
//         </button> */}

//         {/* Connexion ou nom + déconnexion */}
//         {user ? (
//           <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
//             {/* Lien admin si admin */}
//             {user.role === 'admin' && (
//               <Link to="/admin/produits"
//                 style={{ background: C.or, color: C.bordeaux, padding:'4px 10px', borderRadius:'4px', fontSize:'11px', textDecoration:'none', fontWeight:'500' }}>
//                 Admin
//               </Link>
//             )}
//             <span style={{ color:'#f0ddb8', fontSize:'11px' }}>
//               {user.nom || user.name}
//             </span>
//             <button onClick={deconnexion}
//               style={{ background:'transparent', border:`1px solid #f0ddb8`, color:'#f0ddb8', padding:'4px 10px', borderRadius:'4px', fontSize:'11px', cursor:'pointer' }}>
//               {t('deconnexion') || 'Déconnexion'}
//             </button>
//           </div>
//         ) : (
//           <button onClick={() => navigate('/login')}
//             style={{ background:'transparent', border:`1px solid #f0ddb8`, color:'#f0ddb8', padding:'5px 12px', borderRadius:'4px', fontSize:'11px', cursor:'pointer' }}>
//             {t('connexion')}
//           </button>
//         )}

//         {/* Panier */}
//         <button onClick={() => navigate('/panier')}
//           style={{ background: C.or, color: C.bordeaux, border:'none', padding:'6px 16px', borderRadius:'20px', fontSize:'12px', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'6px' }}>
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.bordeaux} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
//             <line x1="3" y1="6" x2="21" y2="6"/>
//             <path d="M16 10a4 4 0 0 1-8 0"/>
//           </svg>
//           {nbArticles > 0 && (
//             <span style={{ background: C.bordeaux, color: C.beige, borderRadius:'50%', width:'18px', height:'18px', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold' }}>
//               {nbArticles}
//             </span>
//           )}
//         </button>

//       </div>
//     </nav>
//   )
// }