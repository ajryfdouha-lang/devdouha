import { useState } from 'react'

const C = { brd:'#6B1515', beige:'#F5E6C8', or:'#C4922A' }

export default function TableauAdmin({
  colonnes, donnees, onModifier, onSupprimer,
  recherche, setRecherche, filtres = []
}) {
  const [colsVisibles, setColsVisibles] = useState(
    Object.fromEntries(colonnes.map(c => [c.key, true]))
  )
  const [afficherFiltres, setAfficherFiltres] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 8

  const colsActives = colonnes.filter(c => colsVisibles[c.key])
  const total = Math.ceil(donnees.length / perPage)
  const slice = donnees.slice((page-1)*perPage, page*perPage)

  return (
    <div>
      {/* Barre de recherche + filtres */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'10px', flexWrap:'wrap', alignItems:'center' }}>
        <input
          value={recherche}
          onChange={e => { setRecherche(e.target.value); setPage(1) }}
          placeholder="Rechercher..."
          style={{ flex:1, minWidth:'150px', border:'1px solid #d4c4b0', borderRadius:'5px', padding:'7px 10px', fontSize:'12px', fontFamily:'Georgia,serif' }}
        />
        {filtres.map(f => (
          <select key={f.key} onChange={e => f.onChange(e.target.value)}
            style={{ border:'1px solid #d4c4b0', borderRadius:'5px', padding:'7px 10px', fontSize:'12px', fontFamily:'Georgia,serif' }}>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
        <button onClick={() => setAfficherFiltres(!afficherFiltres)}
          style={{ background:'transparent', border:`1px solid ${C.brd}`, color: C.brd, padding:'7px 12px', borderRadius:'5px', fontSize:'12px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
          Colonnes
        </button>
      </div>

      {/* Filtre colonnes */}
      {afficherFiltres && (
        <div style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'8px', padding:'10px 14px', marginBottom:'10px', display:'flex', gap:'10px', flexWrap:'wrap' }}>
          {colonnes.map(c => (
            <label key={c.key} style={{ fontSize:'11px', color: C.brd, display:'flex', alignItems:'center', gap:'4px', cursor:'pointer' }}>
              <input type="checkbox" checked={colsVisibles[c.key]}
                onChange={() => setColsVisibles(prev => ({ ...prev, [c.key]: !prev[c.key] }))} />
              {c.label}
            </label>
          ))}
        </div>
      )}

      {/* Tableau */}
      <div style={{ background:'#fff', border:'1px solid #e0c8a0', borderRadius:'8px', overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
          <thead>
            <tr style={{ background: C.brd }}>
              {colsActives.map(c => (
                <th key={c.key} style={{ padding:'10px 12px', textAlign:'left', color: C.beige, fontWeight:'normal', whiteSpace:'nowrap' }}>
                  {c.label}
                </th>
              ))}
              <th style={{ padding:'10px 12px', color: C.beige, fontWeight:'normal', textAlign:'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr key={row.id} style={{ background: i%2===0 ? '#fff' : '#fdf8f0', borderBottom:'1px solid #f0e0cc' }}>
                {colsActives.map(c => (
                  <td key={c.key} style={{ padding:'9px 12px', color:'#3d1010', maxWidth:'150px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
                <td style={{ padding:'9px 12px', textAlign:'center' }}>
                  <div style={{ display:'flex', gap:'4px', justifyContent:'center' }}>
                    <button onClick={() => onModifier(row)}
                      style={{ background:'#e6f1fb', color:'#185FA5', border:'1px solid #185FA5', padding:'4px 10px', borderRadius:'4px', fontSize:'11px', cursor:'pointer' }}>
                      Modifier
                    </button>
                    <button onClick={() => onSupprimer(row.id)}
                      style={{ background:'#ffeaea', color:'#cc4444', border:'1px solid #cc4444', padding:'4px 10px', borderRadius:'4px', fontSize:'11px', cursor:'pointer' }}>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr><td colSpan={colsActives.length+1} style={{ textAlign:'center', padding:'30px', color:'#8B5520' }}>
                Aucun résultat
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div style={{ display:'flex', gap:'4px', marginTop:'10px', justifyContent:'flex-end' }}>
          {Array.from({length:total},(_,i)=>i+1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ padding:'4px 10px', borderRadius:'4px', fontSize:'11px', cursor:'pointer', fontFamily:'Georgia,serif', border:'1px solid #d4c4b0', background: p===page ? C.brd : '#fff', color: p===page ? C.beige : C.brd }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}