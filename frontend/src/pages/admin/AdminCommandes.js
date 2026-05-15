import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import TableauAdmin from './components/TableauAdmin'

const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }
const STATUTS = ['en_attente','en_cours','livree','annulee']

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([])
  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('')
  const [detailCommande, setDetailCommande] = useState(null) // ✅ commande entière
  const [message, setMessage] = useState('')

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { charger() }, [])

  const charger = () => {
    axios.get('http://localhost:8000/api/admin/commandes', { headers })
      .then(res => setCommandes(res.data.data || []))
      .catch(err => console.log('Erreur commandes:', err.response?.data))
  }

  // ✅ Plus besoin d'appel API — les items sont dans la commande
  const voirDetail = (commande) => {
    setDetailCommande(commande)
  }

  const changerStatut = async (id, statut) => {
    await axios.patch(
      `http://localhost:8000/api/admin/commandes/${id}/statut`,
      { statut },
      { headers }
    )
    afficherMessage('Statut mis à jour !')
    charger()
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette commande ?')) return
    await axios.delete(`http://localhost:8000/api/admin/commandes/${id}`, { headers })
    afficherMessage('Commande supprimée !')
    charger()
  }

  const afficherMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const donneesFiltrees = commandes.filter(c => {
    const ok1 = c.user_nom?.toLowerCase().includes(recherche.toLowerCase()) || String(c.id).includes(recherche)
    const ok2 = !filtreStatut || c.statut === filtreStatut
    return ok1 && ok2
  })

  const colonnes = [
    { key:'id',               label:'ID',      render: v => `#${v}` },
    { key:'user_nom',         label:'Client',  render: v => <span style={{ fontWeight:'500' }}>{v}</span> },
    { key:'total_centimes',   label:'Total',   render: v => `${(v/100).toFixed(2)} dh` },
    { key:'statut',           label:'Statut',  render: (v, row) => (
      <select value={v} onChange={e => changerStatut(row.id, e.target.value)}
        style={{ border:'1px solid #d4c4b0', borderRadius:'4px', padding:'3px 6px', fontSize:'11px', fontFamily:'Georgia,serif', cursor:'pointer' }}>
        {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
    { key:'adresse_livraison', label:'Adresse' },
    { key:'telephone',         label:'Téléphone' }, // ✅ nouvelle colonne
    { key:'created_at',        label:'Date' },
  ]

  return (
    <AdminLayout titre="Commandes">

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'16px' }}>
        {STATUTS.map(s => (
          <div key={s} style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'8px', padding:'12px 14px' }}>
            <div style={{ fontSize:'11px', color:'#8B5520', marginBottom:'4px' }}>{s}</div>
            <div style={{ fontSize:'20px', fontWeight:'500', color: C.brd }}>
              {commandes.filter(c => c.statut === s).length}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h1 style={{ color: C.brd, fontWeight:'normal', fontSize:'20px' }}>Gestion des commandes</h1>
      </div>

      {message && (
        <div style={{ background:'#eafff0', border:'1px solid #4caf50', borderRadius:'6px', padding:'10px', marginBottom:'12px', fontSize:'12px', color:'#2e7d32' }}>
          {message}
        </div>
      )}

      <TableauAdmin
        colonnes={colonnes}
        donnees={donneesFiltrees}
        onModifier={voirDetail}
        onSupprimer={supprimer}
        recherche={recherche}
        setRecherche={setRecherche}
        filtres={[{
          key:'statut',
          onChange: setFiltreStatut,
          options:[
            {value:'',label:'Tous les statuts'},
            ...STATUTS.map(s => ({ value:s, label:s }))
          ]
        }]}
      />

      {/* ✅ Détail commande — items depuis JSON */}
      {detailCommande && (
        <div style={{ background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'300px', borderRadius:'8px', marginTop:'16px' }}>
          <div style={{ background:'#fff', borderRadius:'10px', padding:'24px', width:'100%', maxWidth:'500px', border:'1px solid #e0c8a0' }}>
            <h2 style={{ color: C.brd, fontWeight:'normal', marginBottom:'8px', fontSize:'17px' }}>
              Détail commande #{detailCommande.id}
            </h2>
            <p style={{ fontSize:'12px', color:'#666', marginBottom:'4px' }}>
              Client : <strong>{detailCommande.user_nom}</strong>
            </p>
            <p style={{ fontSize:'12px', color:'#666', marginBottom:'4px' }}>
              Téléphone : {detailCommande.telephone}
            </p>
            <p style={{ fontSize:'12px', color:'#666', marginBottom:'16px' }}>
              Adresse : {detailCommande.adresse_livraison}
            </p>

            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
              <thead>
                <tr style={{ background: C.brd }}>
                  <th style={{ padding:'8px 10px', color: C.beige, fontWeight:'normal', textAlign:'left' }}>Produit</th>
                  <th style={{ padding:'8px 10px', color: C.beige, fontWeight:'normal', textAlign:'left' }}>Taille</th>
                  <th style={{ padding:'8px 10px', color: C.beige, fontWeight:'normal', textAlign:'left' }}>Qté</th>
                  <th style={{ padding:'8px 10px', color: C.beige, fontWeight:'normal', textAlign:'left' }}>Prix</th>
                  <th style={{ padding:'8px 10px', color: C.beige, fontWeight:'normal', textAlign:'left' }}>Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {/* ✅ items depuis JSON */}
                {(detailCommande.items || []).map((item, i) => (
                  <tr key={i} style={{ background: i%2===0?'#fff':'#fdf8f0', borderBottom:'1px solid #f0e0cc' }}>
                    <td style={{ padding:'8px 10px' }}>{item.nom}</td>
                    <td style={{ padding:'8px 10px' }}>{item.ml}</td>
                    <td style={{ padding:'8px 10px' }}>{item.quantite}</td>
                    <td style={{ padding:'8px 10px' }}>{Number(item.prix).toFixed(2)} dh</td>
                    <td style={{ padding:'8px 10px', fontWeight:'500', color: C.or }}>
                      {(item.prix * item.quantite).toFixed(2)} dh
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop:'2px solid #e0c8a0' }}>
                  <td colSpan="4" style={{ padding:'8px 10px', fontWeight:'600', textAlign:'right' }}>Total</td>
                  <td style={{ padding:'8px 10px', fontWeight:'700', color: C.brd }}>
                    {detailCommande.total_dh} dh
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{ display:'flex', gap:'10px', marginTop:'16px' }}>
              <button onClick={() => setDetailCommande(null)}
                style={{ background:'transparent', border:`1px solid ${C.brd}`, color: C.brd, padding:'8px 18px', borderRadius:'6px', fontSize:'12px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
                Fermer
              </button>
              <button onClick={() => {
                window.open(`http://localhost:8000/api/admin/pdf/facture/${detailCommande.id}?token=${token}`, '_blank')
              }}
                style={{ background:'#e6f1fb', color:'#185FA5', border:'1px solid #185FA5', padding:'8px 18px', borderRadius:'6px', fontSize:'12px', cursor:'pointer' }}>
                PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}