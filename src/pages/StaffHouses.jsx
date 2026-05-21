import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import styles from './StaffHouses.module.css'

export default function StaffHouses() {
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [bollette, setBollette] = useState([])
  const [residenti, setResidenti] = useState([])

  const load = async () => {
    const { data } = await supabase.from('staff_houses').select('*, residenti(*, profiles(nome, cognome))').order('nome')
    setHouses(data || [])
    if (data?.length && !selected) setSelected(data[0].id)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!selected) return
    Promise.all([
      supabase.from('bollette').select('*').eq('house_id', selected).order('anno', {ascending:false}).order('mese', {ascending:false}),
      supabase.from('residenti').select('*, profiles(nome, cognome)').eq('house_id', selected).order('data_ingresso', {ascending:false})
    ]).then(([b, r]) => { setBollette(b.data || []); setResidenti(r.data || []) })
  }, [selected])

  const house = houses.find(h => h.id === selected)
  const residentiAttivi = residenti.filter(r => !r.data_uscita)
  const totBollette = bollette.filter(b => !b.pagata).reduce((s,b) => s + (b.importo||0), 0)
  const tipoLabel = { luce:'Luce', gas:'Gas', acqua:'Acqua', internet:'Internet', altro:'Altro' }
  const mesiLabel = ['','Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Staff Houses</h2>
          <p className={styles.sub}>Residenti, chiavi e bollette per ogni alloggio</p>
        </div>
      </div>

      {loading ? <p style={{color:'#aaa', fontSize:14}}>Caricamento…</p> : (
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            {houses.map(h => {
              const attivi = h.residenti?.filter(r => !r.data_uscita).length || 0
              return (
                <button key={h.id} className={`${styles.houseBtn} ${selected === h.id ? styles.houseBtnActive : ''}`} onClick={() => setSelected(h.id)}>
                  <div className={styles.houseName}>{h.nome}</div>
                  <div className={styles.houseOcc}>{attivi}/{h.posti_totali} occupati</div>
                  <div className={styles.houseBar}>
                    <div className={styles.houseBarFill} style={{width: `${(attivi/h.posti_totali)*100}%`}}></div>
                  </div>
                </button>
              )
            })}
          </div>

          {house && (
            <div className={styles.detail}>
              <div className={styles.detailHeader}>
                <h3>{house.nome}</h3>
                {house.indirizzo && <p className={styles.addr}><i className="ti ti-map-pin" style={{fontSize:13, marginRight:4, verticalAlign:-1}}></i>{house.indirizzo}</p>}
              </div>

              <div className={styles.statsRow}>
                <div className={styles.miniStat}>
                  <p className={styles.miniLabel}>Occupanti attuali</p>
                  <p className={styles.miniVal}>{residentiAttivi.length} / {house.posti_totali}</p>
                </div>
                <div className={styles.miniStat}>
                  <p className={styles.miniLabel}>Bollette da pagare</p>
                  <p className={styles.miniVal} style={{color: totBollette > 0 ? 'var(--terracotta)' : 'var(--sage)'}}>€ {totBollette.toFixed(0)}</p>
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionLabel}>Residenti attuali</p>
                {residentiAttivi.length === 0 && <p style={{color:'#aaa', fontSize:13}}>Nessun residente attivo.</p>}
                {residentiAttivi.map(r => (
                  <div key={r.id} className={styles.resident}>
                    <div className={styles.resAvatar}>{r.profiles?.nome?.[0]}{r.profiles?.cognome?.[0]}</div>
                    <div className={styles.resInfo}>
                      <p className={styles.resName}>{r.profiles?.nome} {r.profiles?.cognome} {r.ha_chiavi && <span className={styles.keyBadge}><i className="ti ti-key" style={{fontSize:11}}></i> chiavi</span>}</p>
                      <p className={styles.resDates}>Da: {new Date(r.data_ingresso).toLocaleDateString('it-IT')}</p>
                    </div>
                    {r.note && <p className={styles.resNote}>{r.note}</p>}
                  </div>
                ))}
              </div>

              <div className={styles.section}>
                <div className={styles.sectionRow}>
                  <p className={styles.sectionLabel}>Bollette</p>
                </div>
                {bollette.length === 0 && <p style={{color:'#aaa', fontSize:13}}>Nessuna bolletta registrata.</p>}
                <div className={styles.bollList}>
                  {bollette.map(b => (
                    <div key={b.id} className={styles.boll}>
                      <div className={styles.bollLeft}>
                        <span className={styles.bollTipo}>{tipoLabel[b.tipo]}</span>
                        <span className={styles.bollPeriodo}>{mesiLabel[b.mese]} {b.anno}</span>
                      </div>
                      <div className={styles.bollRight}>
                        <span className={styles.bollImporto}>€ {Number(b.importo).toFixed(2)}</span>
                        <span className={`${styles.bollStatus} ${b.pagata ? styles.bollPagata : styles.bollDaPagare}`}>
                          {b.pagata ? 'Pagata' : 'Da pagare'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionLabel}>Storico residenti</p>
                {residenti.filter(r => r.data_uscita).map(r => (
                  <div key={r.id} className={styles.resident} style={{opacity:0.6}}>
                    <div className={styles.resAvatar} style={{background:'#F1EFE8'}}>{r.profiles?.nome?.[0]}{r.profiles?.cognome?.[0]}</div>
                    <div className={styles.resInfo}>
                      <p className={styles.resName}>{r.profiles?.nome} {r.profiles?.cognome}</p>
                      <p className={styles.resDates}>{new Date(r.data_ingresso).toLocaleDateString('it-IT')} → {new Date(r.data_uscita).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
