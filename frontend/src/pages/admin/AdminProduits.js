import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import TableauAdmin from './components/TableauAdmin'
import ModalProduit from './components/ModalProduit'

const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }

// ── Composant SelectBrand ────────────────────────────────────────────────────
function SelectBrand({ value, produitId, onChanger }) {
  const [brands, setBrands] = useState([])
  const [valeur, setValeur] = useState(String(value))  // ← forcer String dès le début
  const [saving, setSaving] = useState(false)

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
   

  useEffect(() => {
    setValeur(String(value))
  }, [value])
  useEffect(() => {
    axios.get('http://localhost:8000/api/brands')
      .then(res => setBrands(res.data.data || []))
      .catch(() => {})
  }, [])

  const handleChange = async (e) => {
    const newBrandId = e.target.value
    setValeur(newBrandId)
    setSaving(true)
    try {
      await axios.patch(
        `http://localhost:8000/api/admin/produits/${produitId}/brand`,
        { brand_id: newBrandId },
        { headers }
      )
    } catch (err) {
      console.error('Erreur changement brand:', err)
    }
    setSaving(false)
    onChanger()
  }

  return (
    <select
      value={valeur}
      onChange={handleChange}
      disabled={saving}
      style={{
        border:'1px solid #d4c4b0', borderRadius:'5px',
        padding:'4px 8px', fontSize:'11px',
        fontFamily:'Georgia,serif', color:'#3d1010',
        background: saving ? '#f5f5f5' : '#fff',
        cursor: saving ? 'not-allowed' : 'pointer',
        maxWidth:'130px',
      }}>
      {brands.map(b => (
        <option key={b.id} value={String(b.id)}>{b.nom}</option>
      ))}
    </select>
  )
}

// ── Page principale ──────────────────────────────────────────────────────────
export default function AdminProduits() {
  const [produits, setProduits]       = useState([])
  const [recherche, setRecherche]     = useState('')
  const [filtreGenre, setFiltreGenre] = useState('')
  const [filtreStock, setFiltreStock] = useState('')
  const [modal, setModal]             = useState(false)
  const [produitEdit, setProduitEdit] = useState(null)
  const [message, setMessage]         = useState('')
  const [chargement, setChargement]   = useState(true)

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { charger() }, [])

  const charger = () => {
    setChargement(true)
    axios.get('http://localhost:8000/api/produits')
      .then(res => {
        const liste = res.data.data || res.data || []
        setProduits(liste)
        setChargement(false)
      })
      .catch(err => {
        console.error('Erreur chargement produits:', err)
        setChargement(false)
      })
  }

  const modifierStock = async (id, quantite) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/admin/produits/${id}/stock`,
        { quantite },
        { headers }
      )
      afficherMessage('Stock mis à jour !')
      charger()
    } catch (err) {
      afficherMessage('Erreur stock : ' + (err.response?.data?.message || ''))
    }
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    try {
      await axios.delete(
        `http://localhost:8000/api/admin/produits/${id}`,
        { headers }
      )
      afficherMessage('Produit supprimé !')
      charger()
    } catch (err) {
      afficherMessage('Erreur suppression : ' + (err.response?.data?.message || ''))
    }
  }

  const ouvrirModif = (produit) => { setProduitEdit(produit); setModal(true) }
  const ouvrirAjout = ()        => { setProduitEdit(null);    setModal(true) }

  const afficherMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const donneesFiltrees = produits.filter(p => {
    const ok1 = p.nom?.toLowerCase().includes(recherche.toLowerCase())
    const ok2 = !filtreGenre || p.genre === filtreGenre
    const ok3 = !filtreStock
                || (filtreStock === 'low'  && p.stock < 5)
                || (filtreStock === 'zero' && p.stock === 0)
                || (filtreStock === 'ok'   && p.stock >= 5)
    return ok1 && ok2 && ok3
  })

  const stats = [
    { label:'Total produits', val: produits.length },
    { label:'Femme',          val: produits.filter(p => p.genre==='femme').length },
    { label:'Homme',          val: produits.filter(p => p.genre==='homme').length },
    { label:'Stock faible',   val: produits.filter(p => p.stock < 5).length },
    { label:'Rupture stock',  val: produits.filter(p => p.stock === 0).length },
    { label:'Stock total',    val: produits.reduce((a,p) => a + (p.stock||0), 0) },
  ]

  const colonnes = [
    { key:'id', label:'ID' },
    {
      key:'image_url', label:'Image',
      render: (v, row) => (
        <img src={v} alt={row.nom}
          style={{ width:'40px', height:'40px', objectFit:'cover', borderRadius:'5px', border:'1px solid #e0c8a0' }}
          onError={e => e.target.src='https://placehold.co/40x40/F5E6C8/6B1515?text=P'} />
      )
    },
    { key:'nom', label:'Nom', render: v => <span style={{ fontWeight:'500' }}>{v}</span> },
    {
      key:'genre', label:'Genre',
      render: v => {
        const styles = {
          femme: { bg:'#fbeaf0', color:'#993556' },
          homme: { bg:'#e6f1fb', color:'#185FA5' },
          mixte: { bg:'#eaf3de', color:'#3B6D11' },
          pack:  { bg:'#faeeda', color:'#633806' },
        }
        const s = styles[v] || { bg:'#f1efe8', color:'#5f5e5a' }
        return (
          <span style={{ background:s.bg, color:s.color, padding:'2px 8px', borderRadius:'10px', fontSize:'10px' }}>
            {v}
          </span>
        )
      }
    },
    { key:'famille_olfactive', label:'Famille' },
    { key:'prix_30ml',  label:'30ml',  render: v => v ? `${v} dh` : '—' },
    { key:'prix_50ml',  label:'50ml',  render: v => v ? `${v} dh` : '—' },
    { key:'prix_100ml', label:'100ml', render: v => v ? `${v} dh` : '—' },
    {
      key:'stock', label:'Stock',
      render: (v, row) => (
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <button onClick={() => modifierStock(row.id, -1)}
            style={{ width:'22px', height:'22px', background:'#ffeaea', color:'#cc4444', border:'1px solid #cc4444', borderRadius:'50%', cursor:'pointer', fontSize:'14px', lineHeight:'1', padding:'0' }}>
            -
          </button>
          <span style={{
            background: v === 0 ? '#ffeaea' : v < 5 ? '#faeeda' : '#eaf3de',
            color:      v === 0 ? '#cc4444' : v < 5 ? '#633806' : '#3B6D11',
            padding:'3px 8px', borderRadius:'10px', fontSize:'11px',
            fontWeight:'500', minWidth:'40px', textAlign:'center'
          }}>
            {v === 0 ? 'Rupture' : v}
          </span>
          <button onClick={() => modifierStock(row.id, 1)}
            style={{ width:'22px', height:'22px', background:'#eaf3de', color:'#3B6D11', border:'1px solid #3B6D11', borderRadius:'50%', cursor:'pointer', fontSize:'14px', lineHeight:'1', padding:'0' }}>
            +
          </button>
        </div>
      )
    },

    // ── Colonne Brand avec select ──────────────────────────────────────────
    {
      key:'brand_id', label:'Brand',
      render: (v, row) => (
        <SelectBrand
          value={v}
          produitId={row.id}
          onChanger={charger}
        />
      )
    },
  ]

  return (
    <AdminLayout titre="Produits">

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'18px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'8px', padding:'12px 14px' }}>
            <div style={{ fontSize:'11px', color:'#8B5520', marginBottom:'4px' }}>{s.label}</div>
            <div style={{ fontSize:'22px', fontWeight:'500', color: C.brd }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Titre + bouton */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
        <h1 style={{ color: C.brd, fontWeight:'normal', fontSize:'20px' }}>
          Gestion des produits
        </h1>
        <button onClick={ouvrirAjout}
          style={{ background: C.brd, color: C.beige, border:'none', padding:'9px 18px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
          + Ajouter un produit
        </button>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          background: message.includes('Erreur') ? '#ffeaea' : '#eafff0',
          border: `1px solid ${message.includes('Erreur') ? '#cc4444' : '#4caf50'}`,
          borderRadius:'6px', padding:'10px', marginBottom:'12px',
          fontSize:'12px',
          color: message.includes('Erreur') ? '#cc4444' : '#2e7d32'
        }}>
          {message}
        </div>
      )}

      {/* Tableau */}
      {chargement ? (
        <div style={{ textAlign:'center', padding:'40px', color: C.brd, fontSize:'14px' }}>
          Chargement des produits...
        </div>
      ) : (
        <TableauAdmin
          colonnes={colonnes}
          donnees={donneesFiltrees}
          onModifier={ouvrirModif}
          onSupprimer={supprimer}
          recherche={recherche}
          setRecherche={setRecherche}
          filtres={[
            {
              key:'genre',
              onChange: setFiltreGenre,
              options:[
                { value:'',      label:'Tous les genres' },
                { value:'femme', label:'Femme'           },
                { value:'homme', label:'Homme'           },
                { value:'mixte', label:'Mixte'           },
                { value:'pack',  label:'Pack'            },
              ]
            },
            {
              key:'stock',
              onChange: setFiltreStock,
              options:[
                { value:'',     label:'Tout le stock'     },
                { value:'zero', label:'Rupture (0)'       },
                { value:'low',  label:'Stock faible (<5)' },
                { value:'ok',   label:'Stock OK (≥5)'     },
              ]
            },
          ]}
        />
      )}

      {/* Modal */}
      {modal && (
        <ModalProduit
          produit={produitEdit}
          onFermer={() => setModal(false)}
          onSauvegarde={() => {
            setModal(false)
            charger()
            afficherMessage(produitEdit ? 'Produit modifié !' : 'Produit ajouté !')
          }}
        />
      )}

    </AdminLayout>
  )
}