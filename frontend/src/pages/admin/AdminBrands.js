import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import TableauAdmin from './components/TableauAdmin'

const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }

const VIDE = { nom:'', slug:'', description:'', is_featured:0, image:null }

export default function AdminBrands() {
  const [brands, setBrands]       = useState([])
  const [recherche, setRecherche] = useState('')
  const [modal, setModal]         = useState(false)
  const [edit, setEdit]           = useState(null)
  const [form, setForm]           = useState(VIDE)
  const [apercu, setApercu]       = useState(null)
  const [message, setMessage]     = useState('')
  const [erreur, setErreur]       = useState('')

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { charger() }, [])

  const charger = () => {
    axios.get('http://localhost:8000/api/admin/brands', { headers })
      .then(res => setBrands(res.data.data || []))
      .catch(() => setBrands([]))
  }

  const ouvrirAjout = () => {
    setEdit(null)
    setForm(VIDE)
    setApercu(null)
    setModal(true)
  }

  const ouvrirModif = (brand) => {
    setEdit(brand)
    setForm({
      nom:         brand.nom         || '',
      slug:        brand.slug        || '',
      description: brand.description || '',
      is_featured: brand.is_featured || 0,
      image:       null,
    })
    setApercu(brand.image_url || null)
    setModal(true)
  }

  const handleChange = (e) => {
  const { name, value, files } = e.target

  if (name === 'image') {
    if (files && files.length > 0) {
      setForm({ ...form, image: files[0] })
      setApercu(URL.createObjectURL(files[0]))
    }
  } else {
    setForm({ ...form, [name]: value })
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    const data = new FormData()
    Object.entries(form).forEach(([k,v]) => {
      if (v !== null && v !== '') data.append(k, v)
    })
    try {
      if (edit) {
        await axios.post(`http://localhost:8000/api/admin/brands/${edit.id}`, data, { headers })
        afficherMessage('Brand modifiée !')
      } else {
        await axios.post('http://localhost:8000/api/admin/brands', data, { headers })
        afficherMessage('Brand ajoutée !')
      }
      setModal(false)
      charger()
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur serveur')
    }
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette brand ?')) return
    await axios.delete(`http://localhost:8000/api/admin/brands/${id}`, { headers })
    afficherMessage('Brand supprimée !')
    charger()
  }

  const afficherMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const donneesFiltrees = brands.filter(b =>
    b.nom?.toLowerCase().includes(recherche.toLowerCase())
  )

  const colonnes = [
    { key:'id',          label:'ID'          },
    { key:'nom',         label:'Nom',         render: v => <span style={{ fontWeight:'500' }}>{v}</span> },
    { key:'slug',        label:'Slug'         },
    { key:'is_featured', label:'En vedette',  render: v => (
      <span style={{ background: v ? '#eaf3de' : '#ffeaea', color: v ? '#3B6D11' : '#cc4444', padding:'2px 8px', borderRadius:'10px', fontSize:'10px' }}>
        {v ? 'Oui' : 'Non'}
      </span>
    )},
    { key:'description', label:'Description'  },
  ]

  const inputStyle = { width:'100%', border:'1px solid #d4c4b0', borderRadius:'5px', padding:'8px 10px', fontSize:'12px', fontFamily:'Georgia,serif', color:'#3d1010' }
  const labelStyle = { fontSize:'11px', color: C.brd, marginBottom:'3px', display:'block' }

  return (
    <AdminLayout titre="Brands">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h1 style={{ color: C.brd, fontWeight:'normal', fontSize:'20px' }}>Gestion des brands</h1>
        <button onClick={ouvrirAjout}
          style={{ background: C.brd, color: C.beige, border:'none', padding:'9px 18px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
          + Ajouter une brand
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
          <div style={{ background:'#fff', borderRadius:'10px', padding:'26px', width:'100%', maxWidth:'460px', border:'1px solid #e0c8a0' }}>
            <h2 style={{ color: C.brd, fontWeight:'normal', marginBottom:'18px', fontSize:'17px' }}>
              {edit ? `Modifier : ${edit.nom}` : 'Ajouter une brand'}
            </h2>

            {erreur && (
              <div style={{ background:'#ffeaea', color:'#cc4444', padding:'8px', borderRadius:'5px', fontSize:'12px', marginBottom:'12px' }}>
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input name="nom" value={form.nom} onChange={handleChange} required style={inputStyle} placeholder="Ex: Oud Collection"/>
                </div>
                <div>
                  <label style={labelStyle}>Slug</label>
                  <input name="slug" value={form.slug} onChange={handleChange} style={inputStyle} placeholder="oud-collection"/>
                </div>
                <div>
                  <label style={labelStyle}>En vedette</label>
                  <select name="is_featured" value={form.is_featured} onChange={handleChange} style={inputStyle}>
                    <option value={0}>Non</option>
                    <option value={1}>Oui</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Image</label>
                  <input name="image" type="file" accept="image/*" onChange={handleChange} style={{ ...inputStyle, padding:'4px' }}/>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize:'none' }} placeholder="Description de la brand..."/>
                </div>
              </div>

              {apercu && (
                <img src={apercu} alt="aperçu" style={{ width:'80px', height:'80px', objectFit:'cover', borderRadius:'6px', marginTop:'10px', border:'1px solid #e0c8a0' }}/>
              )}

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