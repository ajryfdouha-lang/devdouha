import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import TableauAdmin from './components/TableauAdmin'

const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }

const VIDE = { produit_id:'', contenance:'30ml', prix_centimes:'', stock:'' }

export default function AdminVariantes() {
  const [variantes, setVariantes] = useState([])
  const [produits, setProduits]   = useState([])
  const [recherche, setRecherche] = useState('')
  const [modal, setModal]         = useState(false)
  const [edit, setEdit]           = useState(null)
  const [form, setForm]           = useState(VIDE)
  const [message, setMessage]     = useState('')
  const [erreur, setErreur]       = useState('')

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    charger()
    axios.get('http://localhost:8000/api/produits')
      .then(res => setProduits(res.data.data || []))
  }, [])

  const charger = () => {
    axios.get('http://localhost:8000/api/admin/variantes', { headers })
      .then(res => setVariantes(res.data.data || []))
      .catch(() => setVariantes([]))
  }

  const ouvrirAjout = () => { setEdit(null); setForm(VIDE); setModal(true) }

  const ouvrirModif = (v) => {
    setEdit(v)
    setForm({
      produit_id:    v.produit_id    || '',
      contenance:    v.contenance    || '30ml',
      prix_centimes: v.prix_centimes || '',
      stock:         v.stock         || '',
    })
    setModal(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    try {
      if (edit) {
        await axios.put(`http://localhost:8000/api/admin/variantes/${edit.id}`, form, { headers })
        afficherMessage('Variante modifiée !')
      } else {
        await axios.post('http://localhost:8000/api/admin/variantes', form, { headers })
        afficherMessage('Variante ajoutée !')
      }
      setModal(false)
      charger()
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur serveur')
    }
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette variante ?')) return
    await axios.delete(`http://localhost:8000/api/admin/variantes/${id}`, { headers })
    afficherMessage('Variante supprimée !')
    charger()
  }

  const afficherMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const donneesFiltrees = variantes.filter(v =>
    v.produit_nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    v.contenance?.toLowerCase().includes(recherche.toLowerCase())
  )

  const colonnes = [
    { key:'id',            label:'ID'             },
    { key:'produit_nom',   label:'Produit',        render: v => <span style={{ fontWeight:'500' }}>{v}</span> },
    { key:'contenance',    label:'Contenance',     render: v => (
      <span style={{ background:'#faeeda', color:'#633806', padding:'2px 8px', borderRadius:'10px', fontSize:'10px' }}>{v}</span>
    )},
    { key:'prix_centimes', label:'Prix (centimes)', render: v => `${v} cts` },
    { key:'stock',         label:'Stock',           render: v => (
      <span style={{ color: v<5?'#cc4444':'#2e7d32', fontWeight:'500' }}>{v}</span>
    )},
  ]

  const inputStyle = { width:'100%', border:'1px solid #d4c4b0', borderRadius:'5px', padding:'8px 10px', fontSize:'12px', fontFamily:'Georgia,serif', color:'#3d1010' }
  const labelStyle = { fontSize:'11px', color: C.brd, marginBottom:'3px', display:'block' }

  return (
    <AdminLayout titre="Variantes">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h1 style={{ color: C.brd, fontWeight:'normal', fontSize:'20px' }}>Gestion des variantes</h1>
        <button onClick={ouvrirAjout}
          style={{ background: C.brd, color: C.beige, border:'none', padding:'9px 18px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
          + Ajouter une variante
        </button>
      </div>

      {message && (
        <div style={{ background:'#eafff0', border:'1px solid #4caf50', borderRadius:'6px', padding:'10px', marginBottom:'12px', fontSize:'12px', color:'#2e7d32' }}>
          {message}
        </div>
      )}

      <TableauAdmin
        colonnes={colonnes}
        donnees={donneesFiltrees}
        onModifier={ouvrirModif}
        onSupprimer={supprimer}
        recherche={recherche}
        setRecherche={setRecherche}
      />

      {modal && (
        <div style={{ background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px', borderRadius:'8px', marginTop:'16px' }}>
          <div style={{ background:'#fff', borderRadius:'10px', padding:'26px', width:'100%', maxWidth:'420px', border:'1px solid #e0c8a0' }}>
            <h2 style={{ color: C.brd, fontWeight:'normal', marginBottom:'18px', fontSize:'17px' }}>
              {edit ? 'Modifier la variante' : 'Ajouter une variante'}
            </h2>

            {erreur && (
              <div style={{ background:'#ffeaea', color:'#cc4444', padding:'8px', borderRadius:'5px', fontSize:'12px', marginBottom:'12px' }}>
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={labelStyle}>Produit *</label>
                  <select name="produit_id" value={form.produit_id} onChange={handleChange} required style={inputStyle}>
                    <option value="">Choisir un produit</option>
                    {produits.map(p => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Contenance *</label>
                  <select name="contenance" value={form.contenance} onChange={handleChange} style={inputStyle}>
                    {['30ml','50ml','100ml','200ml'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Prix (centimes) *</label>
                  <input name="prix_centimes" type="number" min="0" value={form.prix_centimes} onChange={handleChange} required style={inputStyle} placeholder="Ex: 5000"/>
                </div>
                <div>
                  <label style={labelStyle}>Stock *</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required style={inputStyle} placeholder="Ex: 20"/>
                </div>
              </div>

              <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
                <button type="submit" style={{ background: C.brd, color: C.beige, border:'none', padding:'10px 22px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
                  {edit ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => setModal(false)}
                  style={{ background:'transparent', border:`1px solid ${C.brd}`, color: C.brd, padding:'10px 22px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}