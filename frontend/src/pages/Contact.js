import { useState } from 'react'
import { useLang } from '../i18n/LangContext'

const C = { bordeaux:'#6B1515', beige:'#F5E6C8', or:'#a88539', beige2:'#FAF0DC' }

export default function Contact() {
  const { t } = useLang()
  const [form, setForm] = useState({ nom:'', email:'', telephone:'', message:'' })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message envoyé !')
    setForm({ nom:'', email:'', telephone:'', message:'' })
  }

  return (
    <div style={{ background: C.beige2, minHeight:'100vh', padding:'40px 24px', fontFamily:'Georgia,serif' }}>
      <h1 style={{ textAlign:'center', color: C.bordeaux, fontWeight:'normal', marginBottom:'6px' }}>{t('contact')}</h1>
      <div style={{ width:'50px', height:'2px', background: C.or, margin:'0 auto 30px' }}></div>

      {/* Réseaux sociaux */}
      <div style={{ display:'flex', gap:'12px', justifyContent:'center', marginBottom:'30px', flexWrap:'wrap' }}>
        {[
          { nom:'Instagram', lien:'https://www.instagram.com/perle_dk_parfums?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
          { nom:'Facebook',  lien:'https://facebook.com' },
          { nom:'WhatsApp',  lien:'https://l.instagram.com/?u=https%3A%2F%2Fwa.me%2F212776054295%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnYuK_KOjWQApGjY0-tfQHAuJL4VSTfz9Te0Ugyj3LUVb4_rew-pb80ROj8qQ_aem_CeaBDbJL-17k793UNcDvmA&e=AT7Bn9-5JDs4z6QYAElVJslqaGtZ4aI1B-GBsp1fD10S9It63_9GhKNtY9XYYwM-JehhwSnGhfgRfhRzsrR_rI8WNusRo9N4IDHTh-sygg' },
        ].map(s => (
          <a key={s.nom} href={s.lien} target="_blank" rel="noreferrer"
            style={{ border:`1px solid ${C.bordeaux}`, color: C.bordeaux, background:'transparent', padding:'8px 20px', borderRadius:'20px', fontSize:'12px', textDecoration:'none', fontFamily:'Georgia,serif' }}>
            {s.nom}
          </a>
        ))}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit}
        style={{ maxWidth:'440px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'10px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
          <input placeholder={t('nom')}       value={form.nom}       onChange={e => setForm({...form, nom: e.target.value})}
            style={{ border:`1px solid #d4c4b0`, borderRadius:'6px', padding:'10px 12px', fontSize:'13px', fontFamily:'Georgia,serif' }} />
          <input placeholder={t('telephone')} value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})}
            style={{ border:`1px solid #d4c4b0`, borderRadius:'6px', padding:'10px 12px', fontSize:'13px', fontFamily:'Georgia,serif' }} />
        </div>
        <input placeholder={t('email')} value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          style={{ border:`1px solid #d4c4b0`, borderRadius:'6px', padding:'10px 12px', fontSize:'13px', fontFamily:'Georgia,serif' }} />
        <textarea placeholder={t('message')} value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5}
          style={{ border:`1px solid #d4c4b0`, borderRadius:'6px', padding:'10px 12px', fontSize:'13px', fontFamily:'Georgia,serif', resize:'none' }} />
        <button type="submit"
          style={{ background: C.bordeaux, color: C.beige, border:'none', padding:'12px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', fontFamily:'Georgia,serif' }}>
          {t('envoyer')}
        </button>
      </form>
    </div>
  )
}