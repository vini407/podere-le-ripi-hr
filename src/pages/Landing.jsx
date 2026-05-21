import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './Landing.module.css'

export default function Landing() {
  const [annunci, setAnnunci] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('annunci').select('*').eq('attivo', true).order('created_at', { ascending: false })
      .then(({ data }) => { setAnnunci(data || []); setLoading(false) })
  }, [])

  const repartoLabel = { vigna: 'Vigna', cantina: 'Cantina', ospitalita: 'Ospitalità', amministrazione: 'Amministrazione', altro: 'Altro' }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>Podere Le <span>Ripi</span></div>
        <Link to="/login" className={styles.loginLink}>
          <i className="ti ti-lock" style={{fontSize:14, marginRight:6, verticalAlign:-1}}></i>
          Accesso staff
        </Link>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroPattern}></div>
        <p className={styles.eyebrow}>Montalcino · Toscana · Biodinamica</p>
        <h1>Unisciti al<br /><em>nostro Podere</em></h1>
        <div className={styles.divider}></div>
        <p className={styles.heroSub}>Un organismo vivente. Un podere. Una comunità.</p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>Posizioni aperte</p>
          <h2 className={styles.sectionTitle}>Cerchiamo persone speciali</h2>

          {loading && <p style={{color:'#999', fontSize:14}}>Caricamento annunci…</p>}

          {!loading && annunci.length === 0 && (
            <div className={styles.empty}>
              <i className="ti ti-seeding" style={{fontSize:32, color:'var(--sage)'}}></i>
              <p>Nessuna posizione aperta al momento.</p>
              <p style={{fontSize:13, color:'#aaa'}}>Torna a trovarci presto.</p>
            </div>
          )}

          <div className={styles.grid}>
            {annunci.map(a => (
              <div key={a.id} className={styles.card}>
                <p className={styles.cardTag}>{repartoLabel[a.reparto] || a.reparto} · {a.tipo_contratto}</p>
                <h3 className={styles.cardTitle}>{a.titolo}</h3>
                <p className={styles.cardDesc}>{a.descrizione}</p>
                {a.requisiti && <p className={styles.cardReq}><strong>Requisiti:</strong> {a.requisiti}</p>}
                <div className={styles.cardMeta}>
                  <span><i className="ti ti-map-pin" style={{fontSize:13, verticalAlign:-1, marginRight:4}}></i>{a.luogo}</span>
                  {a.data_inizio && <span><i className="ti ti-calendar" style={{fontSize:13, verticalAlign:-1, marginRight:4}}></i>{new Date(a.data_inizio).toLocaleDateString('it-IT')}</span>}
                </div>
                <a href={`mailto:lavoro@podereleripi.com?subject=Candidatura: ${a.titolo}`} className={styles.applyBtn}>
                  Candidati
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerLogo}>Podere Le Ripi</p>
        <p style={{fontSize:12, color:'rgba(245,240,232,0.4)'}}>Loc. Le Ripi · 53024 Montalcino (SI) · P.IVA 00974960528</p>
        <p style={{fontSize:11, color:'rgba(245,240,232,0.25)', marginTop:8}}>
          <a href="https://www.podereleripi.com" style={{color:'inherit'}}>podereleripi.com</a>
        </p>
      </footer>
    </div>
  )
}
