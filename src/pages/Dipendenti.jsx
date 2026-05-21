import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './Dipendenti.module.css'
import NuovoDipendenteModal from '../components/NuovoDipendenteModal'

const REPARTI = ['tutti', 'vigna', 'cantina', 'ospitalita', 'amministrazione', 'altro']
const repartoLabel = { tutti:'Tutti', vigna:'Vigna', cantina:'Cantina', ospitalita:'Ospitalità', amministrazione:'Amm.', altro:'Altro' }

export default function Dipendenti() {
  const [dipendenti, setDipendenti] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('tutti')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*, attestati(tipo, data_scadenza)').eq('attivo', true).order('cognome')
    setDipendenti(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const oggi = new Date().toISOString().split('T')[0]
  const tra30 = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]

  const getAttStatus = (attestati) => {
    if (!attestati?.length) return 'missing'
    const scaduti = attestati.filter(a => a.data_scadenza && a.data_scadenza < oggi)
    const inScadenza = attestati.filter(a => a.data_scadenza && a.data_scadenza >= oggi && a.data_scadenza <= tra30)
    if (scaduti.length) return 'expired'
    if (inScadenza.length) return 'warning'
    return 'ok'
  }

  const filtered = dipendenti.filter(d => {
    const matchRep = filtro === 'tutti' || d.reparto === filtro
    const matchSearch = !search || `${d.nome} ${d.cognome}`.toLowerCase().includes(search.toLowerCase())
    return matchRep && matchSearch
  })

  const initials = (d) => `${d.nome?.[0] || ''}${d.cognome?.[0] || ''}`.toUpperCase()

  const statusColors = { ok: '#3B6D11', warning: '#BA7517', expired: '#A32D2D', missing: '#888' }
  const statusBg = { ok: '#EAF3DE', warning: '#FAEEDA', expired: '#FCEBEB', missing: '#F1EFE8' }
  const statusLabel = { ok: 'In regola', warning: 'In scadenza', expired: 'Scaduto', missing: 'Attestati mancanti' }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Dipendenti</h2>
          <p className={styles.sub}>Schede, attestati, livelli e storico retributivo</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowModal(true)}>
          <i className="ti ti-user-plus" style={{fontSize:14, marginRight:6, verticalAlign:-1}}></i>
          Nuovo dipendente
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {REPARTI.map(r => (
            <button key={r} className={`${styles.tab} ${filtro === r ? styles.tabActive : ''}`} onClick={() => setFiltro(r)}>
              {repartoLabel[r]}
            </button>
          ))}
        </div>
        <input
          className={styles.search}
          type="text"
          placeholder="Cerca dipendente…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? <p style={{color:'#aaa', fontSize:14}}>Caricamento…</p> : (
        <div className={styles.grid}>
          {filtered.map(d => {
            const st = getAttStatus(d.attestati)
            return (
              <Link key={d.id} to={`/app/dipendenti/${d.id}`} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.avatar}>{initials(d)}</div>
                  <div>
                    <p className={styles.name}>{d.nome} {d.cognome}</p>
                    <p className={styles.role}>{d.ruolo} · Liv. {d.livello_contrattuale}</p>
                  </div>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.reparto}>{repartoLabel[d.reparto] || d.reparto}</span>
                  {d.data_assunzione && <span className={styles.since}>dal {new Date(d.data_assunzione).toLocaleDateString('it-IT', {month:'short', year:'numeric'})}</span>}
                </div>
                <div className={styles.statusBadge} style={{background: statusBg[st], color: statusColors[st]}}>
                  {st === 'ok' && <i className="ti ti-circle-check" style={{fontSize:12, marginRight:4}}></i>}
                  {st === 'warning' && <i className="ti ti-clock" style={{fontSize:12, marginRight:4}}></i>}
                  {st === 'expired' && <i className="ti ti-alert-triangle" style={{fontSize:12, marginRight:4}}></i>}
                  {st === 'missing' && <i className="ti ti-file-x" style={{fontSize:12, marginRight:4}}></i>}
                  {statusLabel[st]}
                </div>
              </Link>
            )
          })}
          {filtered.length === 0 && (
            <p style={{color:'#aaa', fontSize:14, gridColumn:'1/-1'}}>Nessun dipendente trovato.</p>
          )}
        </div>
      )}

      {showModal && <NuovoDipendenteModal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); load() }} />}
    </div>
  )
}
