import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './DipendenteProfilo.module.css'
import NuovoAttestato from '../components/NuovoAttestato'
import NuovoEvento from '../components/NuovoEvento'

const tipoLabel = { haccp:'HACCP', sicurezza:'Sicurezza', patente_muletto:'Pat. Muletto', patente_trattore:'Pat. Trattore', medico:'Visita Medica', primo_soccorso:'Primo Soccorso', antincendio:'Antincendio', altro:'Altro' }
const repartoLabel = { vigna:'Vigna', cantina:'Cantina', ospitalita:'Ospitalità', amministrazione:'Amministrazione', altro:'Altro' }
const eventoLabel = { aumento:'Aumento', passaggio_livello:'Passaggio livello', assunzione:'Assunzione', altro:'Altro' }

export default function DipendenteProfilo() {
  const { id } = useParams()
  const [dip, setDip] = useState(null)
  const [attestati, setAttestati] = useState([])
  const [storico, setStorico] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('info')
  const [showAttModal, setShowAttModal] = useState(false)
  const [showEvModal, setShowEvModal] = useState(false)

  const load = async () => {
    const [d, a, s] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('attestati').select('*').eq('dipendente_id', id).order('data_scadenza'),
      supabase.from('storico_retributivo').select('*').eq('dipendente_id', id).order('data', { ascending: false })
    ])
    setDip(d.data)
    setAttestati(a.data || [])
    setStorico(s.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const toggleAccesso = async () => {
    await supabase.from('profiles').update({ accesso_portale: !dip.accesso_portale }).eq('id', id)
    setDip(prev => ({ ...prev, accesso_portale: !prev.accesso_portale }))
  }

  const oggi = new Date().toISOString().split('T')[0]
  const tra30 = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  const attStatus = (a) => {
    if (!a.data_scadenza) return 'ok'
    if (a.data_scadenza < oggi) return 'expired'
    if (a.data_scadenza <= tra30) return 'warning'
    return 'ok'
  }

  if (loading) return <div style={{padding:'2rem', color:'#aaa'}}>Caricamento…</div>
  if (!dip) return <div style={{padding:'2rem', color:'#aaa'}}>Dipendente non trovato.</div>

  return (
    <div className={styles.page}>
      <Link to="/app/dipendenti" className={styles.back}>
        <i className="ti ti-arrow-left" style={{fontSize:14, marginRight:6, verticalAlign:-1}}></i>
        Dipendenti
      </Link>

      <div className={styles.topCard}>
        <div className={styles.avatarLg}>{dip.nome?.[0]}{dip.cognome?.[0]}</div>
        <div className={styles.topInfo}>
          <h2>{dip.nome} {dip.cognome}</h2>
          <p className={styles.topRole}>{dip.ruolo} · {repartoLabel[dip.reparto]} · Livello {dip.livello_contrattuale}</p>
          {dip.data_assunzione && <p className={styles.topSince}>In azienda dal {new Date(dip.data_assunzione).toLocaleDateString('it-IT')}</p>}
        </div>
        <div className={styles.topActions}>
          <div className={`${styles.accessBadge} ${dip.accesso_portale ? styles.accessOn : styles.accessOff}`}>
            <i className={`ti ${dip.accesso_portale ? 'ti-lock-open' : 'ti-lock'}`} style={{fontSize:13, marginRight:5, verticalAlign:-1}}></i>
            {dip.accesso_portale ? 'Accesso attivo' : 'Accesso bloccato'}
          </div>
          <button className={styles.toggleBtn} onClick={toggleAccesso}>
            {dip.accesso_portale ? 'Revoca accesso' : 'Abilita accesso'}
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        {['info','attestati','storico'].map(t => (
          <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
            {t === 'info' ? 'Informazioni' : t === 'attestati' ? `Attestati (${attestati.length})` : `Storico retributivo (${storico.length})`}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className={styles.infoGrid}>
          {[
            { label: 'Email', val: dip.email, icon: 'ti-mail' },
            { label: 'Reparto', val: repartoLabel[dip.reparto], icon: 'ti-building' },
            { label: 'Livello contrattuale', val: `Livello ${dip.livello_contrattuale}`, icon: 'ti-certificate' },
            { label: 'Data assunzione', val: dip.data_assunzione ? new Date(dip.data_assunzione).toLocaleDateString('it-IT') : '—', icon: 'ti-calendar' },
            { label: 'Fine contratto', val: dip.data_fine_contratto ? new Date(dip.data_fine_contratto).toLocaleDateString('it-IT') : 'Tempo indeterminato', icon: 'ti-calendar-off' },
            { label: 'Stipendio base', val: dip.stipendio_base ? `€ ${Number(dip.stipendio_base).toLocaleString('it-IT')}` : '—', icon: 'ti-coin-euro' },
          ].map(f => (
            <div key={f.label} className={styles.infoField}>
              <p className={styles.infoLabel}><i className={`ti ${f.icon}`} style={{fontSize:13, marginRight:5, verticalAlign:-1}}></i>{f.label}</p>
              <p className={styles.infoVal}>{f.val || '—'}</p>
            </div>
          ))}
          {dip.note && (
            <div className={styles.infoField} style={{gridColumn:'1/-1'}}>
              <p className={styles.infoLabel}><i className="ti ti-notes" style={{fontSize:13, marginRight:5, verticalAlign:-1}}></i>Note</p>
              <p className={styles.infoVal}>{dip.note}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'attestati' && (
        <div>
          <div className={styles.tabHeader}>
            <p className={styles.tabSub}>{attestati.length} attestati registrati</p>
            <button className={styles.addBtn} onClick={() => setShowAttModal(true)}>
              <i className="ti ti-plus" style={{fontSize:13, marginRight:5, verticalAlign:-1}}></i>
              Aggiungi attestato
            </button>
          </div>
          {attestati.length === 0 && <p style={{color:'#aaa', fontSize:14}}>Nessun attestato registrato.</p>}
          <div className={styles.attGrid}>
            {attestati.map(a => {
              const st = attStatus(a)
              const colors = { ok: { bg:'#EAF3DE', col:'#3B6D11' }, warning: { bg:'#FAEEDA', col:'#BA7517' }, expired: { bg:'#FCEBEB', col:'#A32D2D' } }
              const c = colors[st]
              return (
                <div key={a.id} className={styles.attCard} style={{borderTop: `3px solid ${c.col}`}}>
                  <div className={styles.attType} style={{color: c.col}}>{tipoLabel[a.tipo] || a.tipo}</div>
                  {a.nome_documento && <p className={styles.attName}>{a.nome_documento}</p>}
                  <div className={styles.attDates}>
                    {a.data_rilascio && <span>Rilasciato: {new Date(a.data_rilascio).toLocaleDateString('it-IT')}</span>}
                    {a.data_scadenza && <span style={{color: c.col, fontWeight: 500}}>Scade: {new Date(a.data_scadenza).toLocaleDateString('it-IT')}</span>}
                  </div>
                  <div className={styles.attStatus} style={{background: c.bg, color: c.col}}>
                    {st === 'ok' ? '✓ Valido' : st === 'warning' ? '⏰ In scadenza' : '⚠ Scaduto'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'storico' && (
        <div>
          <div className={styles.tabHeader}>
            <p className={styles.tabSub}>{storico.length} eventi registrati</p>
            <button className={styles.addBtn} onClick={() => setShowEvModal(true)}>
              <i className="ti ti-plus" style={{fontSize:13, marginRight:5, verticalAlign:-1}}></i>
              Aggiungi evento
            </button>
          </div>
          {storico.length === 0 && <p style={{color:'#aaa', fontSize:14}}>Nessun evento registrato.</p>}
          <div className={styles.timeline}>
            {storico.map((s, i) => (
              <div key={s.id} className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                {i < storico.length - 1 && <div className={styles.timelineLine}></div>}
                <div className={styles.timelineContent}>
                  <p className={styles.timelineDate}>{new Date(s.data).toLocaleDateString('it-IT')}</p>
                  <p className={styles.timelineTitle}>{eventoLabel[s.tipo] || s.tipo}</p>
                  {s.tipo === 'aumento' && s.stipendio_nuovo && (
                    <p className={styles.timelineSub}>
                      {s.stipendio_precedente ? `€ ${Number(s.stipendio_precedente).toLocaleString('it-IT')} → ` : ''}
                      <strong>€ {Number(s.stipendio_nuovo).toLocaleString('it-IT')}</strong>
                    </p>
                  )}
                  {s.tipo === 'passaggio_livello' && (
                    <p className={styles.timelineSub}>
                      {s.livello_precedente ? `Livello ${s.livello_precedente} → ` : ''}
                      <strong>Livello {s.livello_nuovo}</strong>
                    </p>
                  )}
                  {s.note && <p className={styles.timelineNote}>{s.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAttModal && <NuovoAttestato dipendenteId={id} onClose={() => setShowAttModal(false)} onSaved={() => { setShowAttModal(false); load() }} />}
      {showEvModal && <NuovoEvento dipendenteId={id} onClose={() => setShowEvModal(false)} onSaved={() => { setShowEvModal(false); load() }} />}
    </div>
  )
}
