import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './Modal.module.css'

const REPARTI = ['vigna','cantina','ospitalita','amministrazione','altro']
const repartoLabel = { vigna:'Vigna', cantina:'Cantina', ospitalita:'Ospitalità', amministrazione:'Amministrazione', altro:'Altro' }

export default function NuovoDipendenteModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ nome:'', cognome:'', email:'', ruolo:'', reparto:'vigna', livello_contrattuale:1, data_assunzione:'', stipendio_base:'', note:'' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    if (!form.nome || !form.cognome || !form.email || !form.ruolo) { setError('Compila i campi obbligatori.'); return }
    setSaving(true)
    const { error: err } = await supabase.from('profiles').insert([{ ...form, stipendio_base: form.stipendio_base || null }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  const f = (k, v) => setForm(p => ({...p, [k]: v}))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Nuovo dipendente</h3>
          <button className={styles.closeBtn} onClick={onClose}><i className="ti ti-x" style={{fontSize:18}}></i></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.grid2}>
            <div className={styles.field}><label className={styles.label}>Nome *</label><input className={styles.input} value={form.nome} onChange={e => f('nome', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Cognome *</label><input className={styles.input} value={form.cognome} onChange={e => f('cognome', e.target.value)} /></div>
            <div className={styles.field} style={{gridColumn:'1/-1'}}><label className={styles.label}>Email *</label><input className={styles.input} type="email" value={form.email} onChange={e => f('email', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Ruolo *</label><input className={styles.input} value={form.ruolo} onChange={e => f('ruolo', e.target.value)} placeholder="es. Operaio viticolo" /></div>
            <div className={styles.field}>
              <label className={styles.label}>Reparto</label>
              <select className={styles.input} value={form.reparto} onChange={e => f('reparto', e.target.value)}>
                {REPARTI.map(r => <option key={r} value={r}>{repartoLabel[r]}</option>)}
              </select>
            </div>
            <div className={styles.field}><label className={styles.label}>Livello contrattuale</label><input className={styles.input} type="number" min={1} max={8} value={form.livello_contrattuale} onChange={e => f('livello_contrattuale', parseInt(e.target.value))} /></div>
            <div className={styles.field}><label className={styles.label}>Data assunzione</label><input className={styles.input} type="date" value={form.data_assunzione} onChange={e => f('data_assunzione', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Stipendio base (€)</label><input className={styles.input} type="number" value={form.stipendio_base} onChange={e => f('stipendio_base', e.target.value)} /></div>
            <div className={styles.field} style={{gridColumn:'1/-1'}}><label className={styles.label}>Note</label><textarea className={styles.textarea} value={form.note} onChange={e => f('note', e.target.value)} rows={2} /></div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Annulla</button>
          <button className={styles.saveBtn} onClick={save} disabled={saving}>{saving ? 'Salvataggio…' : 'Salva dipendente'}</button>
        </div>
      </div>
    </div>
  )
}
