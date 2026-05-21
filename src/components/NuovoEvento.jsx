import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './Modal.module.css'

export default function NuovoEvento({ dipendenteId, onClose, onSaved }) {
  const [form, setForm] = useState({ tipo:'aumento', data:'', livello_precedente:'', livello_nuovo:'', stipendio_precedente:'', stipendio_nuovo:'', note:'' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.data) return
    setSaving(true)
    await supabase.from('storico_retributivo').insert([{
      dipendente_id: dipendenteId,
      tipo: form.tipo,
      data: form.data,
      livello_precedente: form.livello_precedente || null,
      livello_nuovo: form.livello_nuovo || null,
      stipendio_precedente: form.stipendio_precedente || null,
      stipendio_nuovo: form.stipendio_nuovo || null,
      note: form.note
    }])
    onSaved()
  }

  const f = (k, v) => setForm(p => ({...p, [k]: v}))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Nuovo evento retributivo</h3>
          <button className={styles.closeBtn} onClick={onClose}><i className="ti ti-x" style={{fontSize:18}}></i></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Tipo evento</label>
              <select className={styles.input} value={form.tipo} onChange={e => f('tipo', e.target.value)}>
                <option value="aumento">Aumento stipendio</option>
                <option value="passaggio_livello">Passaggio di livello</option>
                <option value="assunzione">Assunzione</option>
                <option value="altro">Altro</option>
              </select>
            </div>
            <div className={styles.field}><label className={styles.label}>Data *</label><input className={styles.input} type="date" value={form.data} onChange={e => f('data', e.target.value)} /></div>
            {(form.tipo === 'passaggio_livello' || form.tipo === 'assunzione') && <>
              <div className={styles.field}><label className={styles.label}>Livello precedente</label><input className={styles.input} type="number" min={1} max={8} value={form.livello_precedente} onChange={e => f('livello_precedente', e.target.value)} /></div>
              <div className={styles.field}><label className={styles.label}>Livello nuovo</label><input className={styles.input} type="number" min={1} max={8} value={form.livello_nuovo} onChange={e => f('livello_nuovo', e.target.value)} /></div>
            </>}
            {(form.tipo === 'aumento' || form.tipo === 'assunzione') && <>
              <div className={styles.field}><label className={styles.label}>Stipendio precedente (€)</label><input className={styles.input} type="number" value={form.stipendio_precedente} onChange={e => f('stipendio_precedente', e.target.value)} /></div>
              <div className={styles.field}><label className={styles.label}>Stipendio nuovo (€)</label><input className={styles.input} type="number" value={form.stipendio_nuovo} onChange={e => f('stipendio_nuovo', e.target.value)} /></div>
            </>}
            <div className={styles.field} style={{gridColumn:'1/-1'}}><label className={styles.label}>Note</label><textarea className={styles.textarea} value={form.note} onChange={e => f('note', e.target.value)} rows={2} placeholder="Motivazione, dettagli…" /></div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Annulla</button>
          <button className={styles.saveBtn} onClick={save} disabled={saving}>{saving ? 'Salvataggio…' : 'Salva evento'}</button>
        </div>
      </div>
    </div>
  )
}
