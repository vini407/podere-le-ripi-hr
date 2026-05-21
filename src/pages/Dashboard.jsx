import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [stats, setStats] = useState({ dipendenti: 0, scadenze: 0, houses: 0, bollette: 0 })
  const [scadenze, setScadenze] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('attivo', true),
      supabase.from('staff_houses').select('id', { count: 'exact' }),
      supabase.from('bollette').select('importo').eq('pagata', false),
      supabase.from('attestati').select('*, profiles(nome, cognome)').lte('data_scadenza', new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0]).gte('data_scadenza', new Date().toISOString().split('T')[0]),
      supabase.from('attestati').select('*, profiles(nome, cognome)').lt('data_scadenza', new Date().toISOString().split('T')[0])
    ]).then(([dip, houses, boll, inScadenza, scaduti]) => {
      const totBollette = (boll.data || []).reduce((s, b) => s + (b.importo || 0), 0)
      const tutteScadenze = [...(scaduti.data || []).map(a => ({...a, stato:'scaduto'})), ...(inScadenza.data || []).map(a => ({...a, stato:'in_scadenza'}))]
      setStats({
        dipendenti: dip.count || 0,
        scadenze: tutteScadenze.length,
        houses: houses.count || 0,
        bollette: totBollette
      })
      setScadenze(tutteScadenze.slice(0, 5))
      setLoading(false)
    })
  }, [])

  const tipoLabel = { haccp:'HACCP', sicurezza:'Sicurezza', patente_muletto:'Pat. Muletto', patente_trattore:'Pat. Trattore', medico:'Visita Medica', primo_soccorso:'Primo Soccorso', antincendio:'Antincendio', altro:'Altro' }

  const oggi = new Date()
  const oggi_str = oggi.toLocaleDateString('it-IT', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Buongiorno</h2>
          <p className={styles.sub}>{oggi_str.charAt(0).toUpperCase() + oggi_str.slice(1)}</p>
        </div>
        <Link to="/app/dipendenti" className={styles.newBtn}>
          <i className="ti ti-user-plus" style={{fontSize:14, marginRight:6, verticalAlign:-1}}></i>
          Nuovo dipendente
        </Link>
      </div>

      {loading ? <p style={{color:'#aaa', fontSize:14, padding:'0 2rem'}}>Caricamento…</p> : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <p className={styles.statLabel}>Dipendenti attivi</p>
              <p className={styles.statVal}>{stats.dipendenti}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statLabel}>Attestati in scadenza</p>
              <p className={styles.statVal} style={{color: stats.scadenze > 0 ? 'var(--terracotta)' : 'var(--sage)'}}>{stats.scadenze}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statLabel}>Staff Houses</p>
              <p className={styles.statVal}>{stats.houses}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statLabel}>Bollette non pagate</p>
              <p className={styles.statVal}>€ {stats.bollette.toFixed(0)}</p>
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>Avvisi attestati</p>
            {scadenze.length === 0 ? (
              <div className={styles.allGood}>
                <i className="ti ti-circle-check" style={{fontSize:28, color:'var(--sage)'}}></i>
                <p>Tutti gli attestati sono in regola</p>
              </div>
            ) : scadenze.map(a => (
              <div key={a.id} className={`${styles.alert} ${a.stato === 'scaduto' ? styles.alertRed : styles.alertAmber}`}>
                <div>
                  <p className={styles.alertTitle}>
                    {a.stato === 'scaduto' ? '⚠ ' : '⏰ '}
                    {tipoLabel[a.tipo] || a.tipo} — {a.profiles?.nome} {a.profiles?.cognome}
                  </p>
                  <p className={styles.alertSub}>
                    {a.stato === 'scaduto'
                      ? `Scaduto il ${new Date(a.data_scadenza).toLocaleDateString('it-IT')}`
                      : `Scade il ${new Date(a.data_scadenza).toLocaleDateString('it-IT')}`
                    }
                  </p>
                </div>
                <Link to={`/app/dipendenti/${a.dipendente_id}`} className={styles.alertLink}>
                  Vedi scheda <i className="ti ti-arrow-right" style={{fontSize:12}}></i>
                </Link>
              </div>
            ))}
          </div>

          <div className={styles.quickLinks}>
            <p className={styles.sectionLabel}>Accesso rapido</p>
            <div className={styles.quickGrid}>
              {[
                { to: '/app/dipendenti', icon: 'ti-users', label: 'Dipendenti', sub: 'Schede e attestati' },
                { to: '/app/staff-houses', icon: 'ti-home', label: 'Staff Houses', sub: 'Residenti e bollette' },
                { to: '/app/annunci', icon: 'ti-speakerphone', label: 'Annunci lavoro', sub: 'Gestisci posizioni aperte' },
                { to: '/app/onboarding', icon: 'ti-book', label: 'Onboarding', sub: 'Materiali per i nuovi' },
              ].map(q => (
                <Link key={q.to} to={q.to} className={styles.quickCard}>
                  <i className={`ti ${q.icon}`} style={{fontSize:22, color:'var(--earth)', marginBottom:8}}></i>
                  <p className={styles.quickLabel}>{q.label}</p>
                  <p className={styles.quickSub}>{q.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
