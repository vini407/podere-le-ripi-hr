import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import styles from './Annunci.module.css'

const REPARTI = ['vigna','cantina','ospitalita','cucina','marketing','hr','amministrazione','altro']
const repartoLabel = { vigna:'Vigna', cantina:'Cantina', ospitalita:'Ospitalità', cucina:'Cucina', marketing:'Marketing', hr:'HR', amministrazione:'Amm.', altro:'Altro' }

export default function Annunci() {
  const [annunci, setAnnunci] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titolo:'', reparto:'vigna', descrizione:'', requisiti:'', tipo_contratto:'', data_inizio:'', attivo:true })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('annunci').select('*').order('created_at', { ascending: false })
    setAnnunci(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.titolo) return
    setSaving(true)
    await supabase.from('annunci').insert([form])
    setSaving(false)
    setShowForm(false)
    setForm({ titolo:'', reparto:'vigna', descrizione:'', requisiti:'', tipo_contratto:'', data_inizio:'', attivo:true })
    load()
  }

  const toggleAttivo = async (id, val) => {
    await supabase.from('annunci').update({ attivo: !val }).eq('id', id)
    load()
  }

  const elimina = async (id) => {
    if (!confirm('Eliminare questo annuncio?')) return
    await supabase.from('annunci').delete().eq('id', id)
    load()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Annunci di lavoro</h2>
          <p className={styles.sub}>Visibili pubblicamente sulla pagina "Lavora con noi"</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(!showForm)}>
          <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'}`} style={{fontSize:14, marginRight:6, verticalAlign:-1}}></i>
          {showForm ? 'Annulla' : 'Nuovo annuncio'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Nuovo annuncio</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Titolo posizione *</label>
              <input className={styles.input} value={form.titolo} onChange={e => setForm(p=>({...p, titolo:e.target.value}))} placeholder="es. Operaio viticolo" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Reparto</label>
              <select className={styles.input} value={form.reparto} onChange={e => setForm(p=>({...p, reparto:e.target.value}))}>
                {REPARTI.map(r => <option key={r} value={r}>{repartoLabel[r]}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Tipo contratto</label>
              <input className={styles.input} value={form.tipo_contratto} onChange={e => setForm(p=>({...p, tipo_contratto:e.target.value}))} placeholder="es. Tempo determinato" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Data inizio</label>
              <input className={styles.input} type="date" value={form.data_inizio} onChange={e => setForm(p=>({...p, data_inizio:e.target.value}))} />
            </div>
            <div className={styles.field} style={{gridColumn:'1/-1'}}>
              <label className={styles.label}>Descrizione</label>
              <textarea className={styles.textarea} value={form.descrizione} onChange={e => setForm(p=>({...p, descrizione:e.target.value}))} placeholder="Descrivi la posizione e le responsabilità…" rows={3} />
            </div>
            <div className={styles.field} style={{gridColumn:'1/-1'}}>
              <label className={styles.label}>Requisiti</label>
              <textarea className={styles.textarea} value={form.requisiti} onChange={e => setForm(p=>({...p, requisiti:e.target.value}))} placeholder="Esperienza richiesta, lingue, patenti…" rows={2} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={save} disabled={saving}>{saving ? 'Salvataggio…' : 'Pubblica annuncio'}</button>
          </div>
        </div>
      )}

      {loading ? <p style={{color:'#aaa', fontSize:14}}>Caricamento…</p> : (
        <div className={styles.list}>
          {annunci.length === 0 && <p style={{color:'#aaa', fontSize:14}}>Nessun annuncio. Creane uno con il pulsante in alto.</p>}
          {annunci.map(a => (
            <div key={a.id} className={`${styles.annuncioCard} ${!a.attivo ? styles.inattivo : ''}`}>
              <div className={styles.annLeft}>
                <div className={styles.annTag}>{repartoLabel[a.reparto]} · {a.tipo_contratto}</div>
                <div className={styles.annTitolo}>{a.titolo}</div>
                {a.descrizione && <p className={styles.annDesc}>{a.descrizione}</p>}
                <p className={styles.annData}>Creato il {new Date(a.created_at).toLocaleDateString('it-IT')}</p>
              </div>
              <div className={styles.annActions}>
                <span className={`${styles.statusPill} ${a.attivo ? styles.pillOn : styles.pillOff}`}>
                  {a.attivo ? 'Pubblicato' : 'Non pubblicato'}
                </span>
                <button className={styles.iconBtn} onClick={() => toggleAttivo(a.id, a.attivo)} title={a.attivo ? 'Nascondi' : 'Pubblica'}>
                  <i className={`ti ${a.attivo ? 'ti-eye-off' : 'ti-eye'}`} style={{fontSize:16}}></i>
                </button>
                <button className={styles.iconBtn} style={{color:'#E24B4A'}} onClick={() => elimina(a.id)} title="Elimina">
                  <i className="ti ti-trash" style={{fontSize:16}}></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
