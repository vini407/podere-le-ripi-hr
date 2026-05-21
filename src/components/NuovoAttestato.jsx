import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './Modal.module.css'

const TIPI = ['haccp','sicurezza','patente_muletto','patente_trattore','medico','primo_soccorso','antincendio','altro']
const tipoLabel = { haccp:'HACCP', sicurezza:'Sicurezza', patente_muletto:'Patente Muletto', patente_trattore:'Patente Trattore', medico:'Visita Medica', primo_soccorso:'Primo Soccorso', antincendio:'Antincendio', altro:'Altro' }

export default function NuovoAttestato({ dipendenteId, onClose, onSaved }) {
  const [form, setForm] = useState({ tipo:'haccp', nome_documento:'', data_rilascio:'', data_scadenza:'', note:'' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await supabase.from('attestati').insert([{ ...form, dipendente_id: dipendenteId }])
    onSaved()
  }

  const f = (k, v) => setForm(p => ({...p, [k]: v}))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Nuovo attestato</h3>
          <button className={styles.closeBtn} onClick={onClose}><i className="ti ti-x" style={{fontSize:18}}></i></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Tipo attestato</label>
              <select className={styles.input} value={form.tipo} onChange={e => f('tipo', e.target.value)}>
                {TIPI.map(t => <option key={t} value={t}>{tipoLabel[t]}</option>)}
              </select>
            </div>
            <div className={styles.field}><label className={styles.label}>Nome documento</label><input className={styles.input} value={form.nome_documento} onChange={e => f('nome_documento', e.target.value)} placeholder="es. Attestato HACCP 2024" /></div>
            <div className={styles.field}><label className={styles.label}>Data rilascio</label><input className={styles.input} type="date" value={form.data_rilascio} onChange={e => f('data_rilascio', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Data scadenza</label><input className={styles.input} type="date" value={form.data_scadenza} onChange={e => f('data_scadenza', e.target.value)} /></div>
            <div className={styles.field} style={{gridColumn:'1/-1'}}><label className={styles.label}>Note</label><textarea className={styles.textarea} value={form.note} onChange={e => f('note', e.target.value)} rows={2} /></div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Annulla</button>
          <button className={styles.saveBtn} onClick={save} disabled={saving}>{saving ? 'Salvataggio…' : 'Salva attestato'}</button>
        </div>
      </div>
    </div>
  )
}
