import { useState, useEffect } from 'react'
import axios from 'axios'

const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }

export default function ModalProduit({ produit, onFermer, onSauvegarde }) {
  const [form, setForm] = useState({
    nom:'', description:'', famille_olfactive:'floral',
    genre:'femme', prix_30ml:'', prix_50ml:'',
    prix_100ml:'', stock:'', brand_id:'', image:null
  })
  const [apercu, setApercu]   = useState(null)
  const [erreur, setErreur]   = useState('')
  const [brands, setBrands]   = useState([])
  const [loading, setLoading] = useState(false)

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  // ── Charger les brands ───────────────────────────────────────────────────
  useEffect(() => {
    axios.get('http://localhost:8000/api/brands')
      .then(res => {
        const liste = res.data.data || []
        setBrands(liste)
        // si brand_id vide et brands disponibles → prendre le premier
        if (!form.brand_id && liste.length > 0) {
          setForm(prev => ({ ...prev, brand_id: String(liste[0].id) }))
        }
      })
      .catch(() => setBrands([]))
  }, [])

  // ── Pré-remplir le formulaire si modification ────────────────────────────
useEffect(() => {
  if (produit) {
    setForm({
      nom:               produit.nom               || '',
      description:       produit.description       || '',
      famille_olfactive: produit.famille_olfactive || 'floral',
      genre:             produit.genre             || 'femme',
      prix_30ml:         produit.prix_30ml         || '',
      prix_50ml:         produit.prix_50ml         || '',
      prix_100ml:        produit.prix_100ml        || '',
      stock:             produit.stock             || '',
      brand_id:          String(produit.brand_id)  || '',  // ← forcer String
      image:             null,
    })
    setApercu(produit.image_url || null)
  }
}, [produit])

  // ── Gestion des champs ───────────────────────────────────────────────────
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

  // ── Soumission ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)

    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== '') data.append(k, v)
    })

    try {
      if (produit) {
        await axios.post(
          `http://localhost:8000/api/admin/produits/${produit.id}`,
          data, { headers }
        )
      } else {
        await axios.post(
          'http://localhost:8000/api/admin/produits',
          data, { headers }
        )
      }
      onSauvegarde()
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        const premier = Object.values(errors)[0]
        setErreur(Array.isArray(premier) ? premier[0] : premier)
      } else {
        setErreur(err.response?.data?.message || 'Erreur serveur')
      }
    }
    setLoading(false)
  }

  const inputStyle = {
    width:'100%', border:'1px solid #d4c4b0',
    borderRadius:'5px', padding:'8px 10px',
    fontSize:'12px', fontFamily:'Georgia,serif',
    color:'#3d1010', boxSizing:'border-box'
  }
  const labelStyle = {
    fontSize:'11px', color: C.brd,
    marginBottom:'3px', display:'block'
  }

  return (
    <div style={{ background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'500px', borderRadius:'8px', marginTop:'16px' }}>
      <div style={{ background:'#fff', borderRadius:'10px', padding:'26px', width:'100%', maxWidth:'520px', border:'1px solid #e0c8a0' }}>

        <h2 style={{ color: C.brd, fontWeight:'normal', marginBottom:'18px', fontSize:'17px' }}>
          {produit ? `Modifier : ${produit.nom}` : 'Ajouter un produit'}
        </h2>

        {erreur && (
          <div style={{ background:'#ffeaea', color:'#cc4444', padding:'8px', borderRadius:'5px', fontSize:'12px', marginBottom:'12px' }}>
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>

            {/* Nom */}
            <div>
              <label style={labelStyle}>Nom *</label>
              <input name="nom" value={form.nom} onChange={handleChange}
                required style={inputStyle} placeholder="Ex: Type Angel"/>
            </div>

            {/* Genre */}
            <div>
              <label style={labelStyle}>Genre *</label>
              <select name="genre" value={form.genre} onChange={handleChange} style={inputStyle}>
                {['femme','homme','mixte','pack'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Famille olfactive */}
            <div>
              <label style={labelStyle}>Famille olfactive</label>
              <select name="famille_olfactive" value={form.famille_olfactive} onChange={handleChange} style={inputStyle}>
                {['floral','boisé','oriental','frais','épicé','musqué'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label style={labelStyle}>Stock</label>
              <input name="stock" type="number" min="0"
                value={form.stock} onChange={handleChange}
                style={inputStyle} placeholder="0"/>
            </div>

            {/* Prix 30ml */}
            <div>
              <label style={labelStyle}>Prix 30ml (dh) *</label>
              <input name="prix_30ml" type="number" step="0.01"
                value={form.prix_30ml} onChange={handleChange}
                required style={inputStyle} placeholder="50"/>
            </div>

            {/* Prix 50ml */}
            <div>
              <label style={labelStyle}>Prix 50ml (dh)</label>
              <input name="prix_50ml" type="number" step="0.01"
                value={form.prix_50ml} onChange={handleChange}
                style={inputStyle} placeholder="80"/>
            </div>

            {/* Prix 100ml */}
            <div>
              <label style={labelStyle}>Prix 100ml (dh)</label>
              <input name="prix_100ml" type="number" step="0.01"
                value={form.prix_100ml} onChange={handleChange}
                style={inputStyle} placeholder="140"/>
            </div>

            {/* ── BRAND SELECT ── */}
                      <div>
              <label style={labelStyle}>Brand *</label>
              <select
                name="brand_id"
                value={String(form.brand_id)}   // ← forcer String ici aussi
                onChange={handleChange}
                required
                style={inputStyle}>
                <option value="">-- Choisir une brand --</option>
                {brands.map(b => (
                  <option key={b.id} value={String(b.id)}>   {/* ← forcer String */}
                    {b.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label style={labelStyle}>Image</label>
              <input name="image" type="file" accept="image/*"
                onChange={handleChange}
                style={{ ...inputStyle, padding:'4px' }}/>
            </div>

            {/* Description pleine largeur */}
            <div style={{ gridColumn:'1/-1' }}>
              <label style={labelStyle}>Description *</label>
              <textarea name="description" value={form.description}
                onChange={handleChange} rows={2} required
                style={{ ...inputStyle, resize:'none' }}
                placeholder="Description du parfum..."/>
            </div>

          </div>

          {/* Aperçu image */}
          {apercu && (
            <div style={{ marginTop:'12px' }}>
              <label style={labelStyle}>Aperçu image actuelle</label>
              <img src={apercu} alt="aperçu"
                style={{ width:'80px', height:'80px', objectFit:'cover', borderRadius:'6px', border:'1px solid #e0c8a0', display:'block' }}
                onError={e => e.target.style.display='none'} />
            </div>
          )}

          {/* Boutons */}
          <div style={{ display:'flex', gap:'8px', marginTop:'18px' }}>
            <button type="submit" disabled={loading}
              style={{ background: C.brd, color: C.beige, border:'none', padding:'10px 22px', borderRadius:'6px', fontSize:'13px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Georgia,serif', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Enregistrement...' : produit ? 'Enregistrer les modifications' : 'Ajouter le produit'}
            </button>
            <button type="button" onClick={onFermer}
              style={{ background:'transparent', border:`1px solid ${C.brd}`, color: C.brd, padding:'10px 22px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}