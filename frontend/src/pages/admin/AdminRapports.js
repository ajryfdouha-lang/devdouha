import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import ModalProduit from './components/ModalProduit'
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts'


const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }

export default function AdminRapports() {
  const [stats, setStats]                     = useState(null)
  const [top, setTop]                         = useState([])
  const [alertes, setAlertes]                 = useState([])
  const [message, setMessage]                 = useState('')
  const [importing, setImporting]             = useState(false)
  const [importingBrands, setImportingBrands] = useState(false)
const [produits, setProduits] = useState([])
  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
const [graphData, setGraphData] = useState({
parGenre:    [],
parMois:     [],
parFamille:  [],
})
  useEffect(() => {
    const fetchData = async () => {
        try {
            await Promise.all([
                chargerStats(),
                chargerTop(),
                chargerAlertes()
            ]);
        } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    };
    
    fetchData();
}, []);
useEffect(() => {
  axios.get('http://localhost:8000/api/produits')
    .then(res => setProduits(res.data.data || []))
}, [])
useEffect(() => {
  axios.get('http://localhost:8000/api/admin/rapports/graphiques', { headers })
    .then(res => setGraphData(res.data))
    .catch(() => {})
}, [])

  const chargerStats = () => {
    axios.get('http://localhost:8000/api/admin/rapports/stats', { headers })
      .then(res => setStats(res.data.data))
      .catch(() => {})
      if (!stats || stats.length === 0) {
    return <div>Chargement des données en cours...</div>;
}
  }

  const chargerTop = () => {
    axios.get('http://localhost:8000/api/admin/rapports/top-produits', { headers })
      .then(res => setTop(res.data.data || []))
      .catch(() => {})
  }

  const chargerAlertes = () => {
    axios.get('http://localhost:8000/api/admin/rapports/alertes-stock', { headers })
      .then(res => setAlertes(res.data.data || []))
      .catch(() => {})
  }

  const afficherMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 4000)
  }

  // ── Export catalogue produits ────────────────────────────────────────────
  const exporterXML = () => {
    fetch('http://localhost:8000/api/admin/export/xml', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href     = url
      a.download = `catalogue-perledk-${new Date().toISOString().split('T')[0]}.xml`
      a.click()
      URL.revokeObjectURL(url)
      afficherMessage('Catalogue exporté avec succès !')
    })
    .catch(() => afficherMessage('Erreur export XML'))
  }

  // ── Export brands ────────────────────────────────────────────────────────
  const exporterBrandsXML = () => {
    fetch('http://localhost:8000/api/admin/export/xml/brands', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href     = url
      a.download = `brands-perledk-${new Date().toISOString().split('T')[0]}.xml`
      a.click()
      URL.revokeObjectURL(url)
      afficherMessage('Brands exportées avec succès !')
    })
    .catch(() => afficherMessage('Erreur export brands'))
  }

  // ── Import produits XML ──────────────────────────────────────────────────
  const importerXML = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    const data = new FormData()
    data.append('xml_file', file)
    try {
      const res = await axios.post(
        'http://localhost:8000/api/admin/import/xml',
        data,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      afficherMessage(`Import réussi — ${res.data.importes} ajoutés, ${res.data.modifies} modifiés, ${res.data.ignores} ignorés`)
      chargerStats()
    } catch (err) {
      afficherMessage('Erreur import : ' + (err.response?.data?.message || 'Problème serveur'))
    }
    setImporting(false)
    e.target.value = ''
  }

  // ── Import brands XML ────────────────────────────────────────────────────
  const importerBrandsXML = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImportingBrands(true)
    const data = new FormData()
    data.append('xml_file', file)
    try {
      const res = await axios.post(
        'http://localhost:8000/api/admin/import/xml/brands',
        data,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      afficherMessage(`Brands importées — ${res.data.importes} ajoutées, ${res.data.modifies} modifiées`)
    } catch (err) {
      afficherMessage('Erreur import brands : ' + (err.response?.data?.message || ''))
    }
    setImportingBrands(false)
    e.target.value = ''
  }

  // ── Télécharger modèle XML ───────────────────────────────────────────────
  const telechargerModele = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<catalogue version="1.0" source="Perle D&amp;K">
  <produit id="1">
    <nom>Type Angel</nom>
    <description>Notes gourmandes et sucrées</description>
    <famille_olfactive>oriental</famille_olfactive>
    <genre>femme</genre>
    <prix_30ml>50</prix_30ml>
    <prix_50ml>80</prix_50ml>
    <prix_100ml>140</prix_100ml>
    <stock>20</stock>
    <image>produits/default.jpg</image>
    <brand><nom>Chanel</nom></brand>
  </produit>
  <produit id="2">
    <nom>Acqua di Gio</nom>
    <description>Notes marines et boisées</description>
    <famille_olfactive>frais</famille_olfactive>
    <genre>homme</genre>
    <prix_30ml>50</prix_30ml>
    <prix_50ml>80</prix_50ml>
    <prix_100ml>140</prix_100ml>
    <stock>18</stock>
    <image>produits/aquaGioH.jpeg</image>
    <brand><nom>Giorgio Armani</nom></brand>
  </produit>
</catalogue>`
    const blob = new Blob([xml], { type: 'application/xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'modele-import-perledk.xml'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout titre="Rapports">

      {/* ── Stats globales ── */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'24px' }}>
          {[
            { label:'Produits',         val: stats.total_produits,           couleur: C.brd    },
            { label:'Commandes',        val: stats.total_commandes,          couleur: C.brd    },
            { label:'Clients',          val: stats.total_clients,            couleur: C.brd    },
            { label:'Chiffre affaires', val: stats.chiffre_affaires + ' dh', couleur:'#2e7d32' },
            { label:'Stock faible',     val: stats.stock_faible,             couleur:'#cc8800' },
            { label:'Rupture stock',    val: stats.rupture_stock,            couleur:'#cc4444' },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'8px', padding:'14px 16px' }}>
              <div style={{ fontSize:'11px', color:'#8B5520', marginBottom:'4px' }}>{s.label}</div>
              <div style={{ fontSize:'22px', fontWeight:'500', color: s.couleur }}>{s.val}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Export / Import XML ── */}
      <div style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'10px', padding:'20px', marginBottom:'24px' }}>
        <h2 style={{ color: C.brd, fontWeight:'normal', fontSize:'17px', marginBottom:'16px' }}>
          Export / Import XML
          <span style={{ fontSize:'11px', color:'#8B5520', marginLeft:'8px', fontWeight:'normal' }}>
            (catalogue produits, brands, etc.)
          </span>
        </h2>

        {message && (
          <div style={{
            background: message.includes('Erreur') ? '#ffeaea' : '#eafff0',
            border: `1px solid ${message.includes('Erreur') ? '#cc4444' : '#4caf50'}`,
            borderRadius:'6px', padding:'12px', marginBottom:'14px',
            fontSize:'13px',
            color: message.includes('Erreur') ? '#cc4444' : '#2e7d32'
          }}>
            {message}
          </div>
        )}

        {/* Exports */}
        <div style={{ marginBottom:'20px' }}>
          <p style={{ fontSize:'13px', fontWeight:'500', color:'#333', marginBottom:'10px' }}>
            Export — Base de données → XML
          </p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            <button onClick={exporterXML}
              style={{ background: C.brd, color: C.beige, border:'none', padding:'10px 20px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif', display:'flex', alignItems:'center', gap:'8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exporter catalogue XML
            </button>
            <button onClick={exporterBrandsXML}
              style={{ background: C.or, color:'#fff', border:'none', padding:'10px 20px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif', display:'flex', alignItems:'center', gap:'8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exporter brands XML
            </button>
            
          </div>
        </div>

        {/* Imports */}
        <div style={{ borderTop:'1px solid #e0c8a0', paddingTop:'16px' }}>
          <p style={{ fontSize:'13px', fontWeight:'500', color:'#333', marginBottom:'10px' }}>
            Import — XML → Base de données (avec transaction)
          </p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'flex-start' }}>
            <div>
              <label style={{ background:'#e6f1fb', color:'#185FA5', border:'1px solid #185FA5', padding:'10px 16px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif', display:'inline-block' }}>
                {importing ? 'Import en cours...' : 'Importer produits XML'}
                <input type="file" accept=".xml" onChange={importerXML} style={{ display:'none' }} disabled={importing} />
              </label>
              <p style={{ fontSize:'11px', color:'#8B5520', marginTop:'4px' }}>Format : catalogue XML Perle D&K</p>
            </div>
            <div>
              <label style={{ background:'#eaf3de', color:'#3B6D11', border:'1px solid #3B6D11', padding:'10px 16px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif', display:'inline-block' }}>
                {importingBrands ? 'Import en cours...' : 'Importer brands XML'}
                <input type="file" accept=".xml" onChange={importerBrandsXML} style={{ display:'none' }} disabled={importingBrands} />
              </label>
              <p style={{ fontSize:'11px', color:'#8B5520', marginTop:'4px' }}>Format : brands XML Perle D&K</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop:'14px', background:'#fdf8f0', border:'1px solid #f0e0cc', borderRadius:'6px', padding:'10px 14px', fontSize:'12px', color:'#8B5520' }}>
          <strong>Point 17 — Transactions :</strong> L'import XML utilise une transaction MySQL.
          Si une erreur survient, toutes les insertions sont annulées automatiquement.
        </div>
      </div>

      {/* ── Top 5 produits — procédure stockée ── */}
      <div style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'10px', padding:'20px', marginBottom:'24px' }}>
        <h2 style={{ color: C.brd, fontWeight:'normal', fontSize:'17px', marginBottom:'16px' }}>
          Top 5 parfums les plus vendus
          <span style={{ fontSize:'11px', color:'#8B5520', marginLeft:'8px', fontWeight:'normal' }}>
            (via procédure stockée MySQL)
          </span>
        </h2>
        {top.length === 0 ? (
          <p style={{ color:'#8a7e74', fontSize:'13px' }}>Aucune vente enregistrée pour le moment.</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {top.map((p, i) => (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'10px 14px', background: i===0 ? '#fdf0dc' : '#fdf8f0', borderRadius:'8px', border:'1px solid #f0e0cc' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background: i===0 ? C.or : C.brd, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'500', flexShrink:0 }}>
                  {i + 1}
                </div>
                <img src={p.image_url} alt={p.nom}
                  style={{ width:'40px', height:'40px', objectFit:'cover', borderRadius:'5px' }}
                  onError={e => e.target.src='https://placehold.co/40x40/F5E6C8/6B1515?text=P'} />
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:'500', color:'#3d1010', fontSize:'13px', marginBottom:'2px' }}>{p.nom}</p>
                  <p style={{ fontSize:'11px', color:'#8B5520' }}>{p.genre}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontWeight:'500', color: C.brd, fontSize:'14px' }}>{p.total_vendus} vendus</p>
                  <p style={{ fontSize:'11px', color:'#8B5520' }}>{p.chiffre_affaires} dh</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Alertes stock — trigger ── */}
      <div style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'10px', padding:'20px' }}>
        <h2 style={{ color: C.brd, fontWeight:'normal', fontSize:'17px', marginBottom:'16px' }}>
          Alertes stock
          <span style={{ fontSize:'11px', color:'#8B5520', marginLeft:'8px', fontWeight:'normal' }}>
            (générées automatiquement par trigger MySQL)
          </span>
        </h2>
        {alertes.length === 0 ? (
          <p style={{ color:'#8a7e74', fontSize:'13px' }}>Aucune alerte pour le moment.</p>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead>
              <tr style={{ background: C.brd }}>
                {['Produit','Ancien stock','Nouveau stock','Type','Date'].map(h => (
                  <th key={h} style={{ padding:'8px 12px', color: C.beige, fontWeight:'normal', textAlign:'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alertes.map((a, i) => (
                <tr key={a.id} style={{ background: i%2===0?'#fff':'#fdf8f0', borderBottom:'1px solid #f0e0cc' }}>
                  <td style={{ padding:'8px 12px', fontWeight:'500', color:'#3d1010' }}>{a.produit_nom}</td>
                  <td style={{ padding:'8px 12px', color:'#8B5520' }}>{a.ancien_stock}</td>
                  <td style={{ padding:'8px 12px' }}>
                    <span style={{ color: a.nouveau_stock===0 ? '#cc4444' : '#cc8800', fontWeight:'500' }}>
                      {a.nouveau_stock}
                    </span>
                  </td>
                  <td style={{ padding:'8px 12px' }}>
                    <span style={{ background: a.type==='rupture'?'#ffeaea':'#faeeda', color: a.type==='rupture'?'#cc4444':'#633806', padding:'2px 8px', borderRadius:'10px', fontSize:'10px' }}>
                      {a.type}
                    </span>
                  </td>
                  <td style={{ padding:'8px 12px', color:'#8B5520', fontSize:'11px' }}>
                    {a.created_at?.split('T')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Graphiques */}
<div style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'10px', padding:'20px', marginBottom:'24px' }}>
  <h2 style={{ color: C.brd, fontWeight:'normal', fontSize:'17px', marginBottom:'20px' }}>
    Graphiques de synthèse
  </h2>

  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>

    {/* Histogramme — ventes par genre */}
    <div>
      <p style={{ fontSize:'13px', color:'#555', marginBottom:'10px', fontWeight:'500' }}>
        Ventes par genre (Histogramme)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={[
          { genre:'Femme', ventes: produits.filter(p=>p.genre==='femme').length },
          { genre:'Homme', ventes: produits.filter(p=>p.genre==='homme').length },
          { genre:'Mixte', ventes: produits.filter(p=>p.genre==='mixte').length },
          { genre:'Pack',  ventes: produits.filter(p=>p.genre==='pack').length  },
        ]}>
          <XAxis dataKey="genre" fontSize={11}/>
          <YAxis fontSize={11}/>
          <Tooltip/>
          <Bar dataKey="ventes" fill="#6B1515" radius={[4,4,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Secteur — répartition par famille */}
    <div>
      <p style={{ fontSize:'13px', color:'#555', marginBottom:'10px', fontWeight:'500' }}>
        Répartition par famille olfactive (Secteur)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={['floral','boisé','oriental','frais','épicé','musqué'].map(f => ({
              name: f,
              value: produits.filter(p => p.famille_olfactive === f).length || 0
            })).filter(d => d.value > 0)}
            cx="50%" cy="50%"
            outerRadius={70}
            dataKey="value"
            label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}
            labelLine={false}
            fontSize={10}
          >
            {['#6B1515','#C4922A','#1a3a5c','#2a3a1a','#5c3a6e','#1a4a3a'].map((color, i) => (
              <Cell key={i} fill={color}/>
            ))}
          </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Courbe — stock par produit */}
    <div style={{ gridColumn:'1/-1' }}>
      <p style={{ fontSize:'13px', color:'#555', marginBottom:'10px', fontWeight:'500' }}>
        Évolution du stock (Courbe)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={produits.slice(0, 10).map(p => ({
          nom:   p.nom?.substring(0, 12),
          stock: p.stock,
        }))}>
          <XAxis dataKey="nom" fontSize={10}/>
          <YAxis fontSize={11}/>
          <Tooltip/>
          <Legend/>
          <Line type="monotone" dataKey="stock" stroke="#C4922A" strokeWidth={2} dot={{ fill:'#6B1515' }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>

  </div>
</div>

    </AdminLayout>
  )
}