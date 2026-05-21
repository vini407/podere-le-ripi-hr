import { useState } from 'react'
import styles from './Onboarding.module.css'

const SEZIONI = [
  {
    id: 'azienda',
    label: 'Chi siamo',
    icon: 'ti-seeding',
    titolo: 'Il sogno di Francesco Illy',
    contenuto: [
      { t: 'Le origini', c: 'Podere Le Ripi nasce nel 1998 quando Francesco Illy, fotografo naturalista di professione, si imbatte in questo angolo di Toscana. All\'epoca il podere era abitato da un pastore e dalle sue pecore. Francesco se ne innamora immediatamente: "Questo è il luogo della mia vita." Così inizia il sogno.' },
      { t: 'Cosa siamo oggi', c: 'Siamo 60 ettari sul versante est di Montalcino, a Castelnuovo dell\'Abate. Vigneti, oliveti, bosco, pascoli per un piccolo allevamento e un orto sinergico. Un organismo vivente. Un podere nel senso più pieno del termine: un luogo dove si produce, si vive, si abita.' },
      { t: 'I nostri valori', c: 'Bellezza, naturalità, comunità. Trattiamo ogni pianta, ogni animale, ogni persona con lo stesso rispetto. Non siamo solo un\'azienda vitivinicola — siamo un progetto di vita collettivo. Chi lavora qui è parte del podere, non solo dipendente.' },
    ]
  },
  {
    id: 'montalcino',
    label: 'Montalcino',
    icon: 'ti-mountain',
    titolo: 'Il territorio che ci circonda',
    contenuto: [
      { t: 'La storia', c: 'Montalcino è un borgo medievale della provincia di Siena, a circa 550 metri sul livello del mare. È famoso in tutto il mondo per essere la patria del Brunello, uno dei vini rossi più prestigiosi d\'Italia. Il centro storico è circondato da mura trecentesche perfettamente conservate.' },
      { t: 'I versanti', c: 'Il territorio di Montalcino è straordinariamente vario. Il versante ovest ha terreni alluvionali sabbiosi, ricchi di scheletro — vini più femminili e classici. Il versante est, dove siamo noi a Castelnuovo dell\'Abate, ha argille oceaniche di 5 milioni di anni — vini strutturati, minerali, longevi.' },
      { t: 'Cosa fare nei dintorni', c: 'L\'abbazia di Sant\'Antimo è a 5 minuti — un gioiello romanico del XII secolo. Siena è a 40 minuti. Il Monte Amiata a 30 minuti offre escursioni, funghi e in inverno sci. D\'estate il lago di Burano e le terme di Bagno Vignoni sono a portata di mano.' },
    ]
  },
  {
    id: 'vini',
    label: 'I nostri vini',
    icon: 'ti-bottle',
    titolo: 'Quello che produciamo',
    contenuto: [
      { t: 'Brunello Lupi e Sirene', c: 'Il nostro Brunello del versante est. Argille oceaniche, corpo strutturato, tannini importanti. Matura 36 mesi in botti grandi di rovere e almeno 4 mesi in bottiglia. È il vino che parla più di tutti del nostro terroir — austero da giovane, magnifico con il tempo.' },
      { t: 'Brunello Cielo d\'Ulisse', c: 'Il Brunello del versante ovest. Terreni alluvionali e galestro danno un vino più femminile, elegante, con tannini croccanti. La vera tradizione montalcinese: 4.500 piante per ettaro, cordone speronato.' },
      { t: 'Bonsai', c: 'La nostra rarità assoluta. Circa 600 bottiglie all\'anno da un vigneto di 1 ettaro con 62.500 piante — il vigneto più denso al mondo. Un esperimento di densità estrema: ogni pianta produce pochissimo, ma di qualità straordinaria. Non si trova quasi da nessuna parte.' },
      { t: 'Amore e Follia', c: 'L\'unico vino non Sangiovese. Syrah vinificato in modo biodinamico, con morbidezza tannica e buona mineralità. Un vino che sorprende sempre chi non se lo aspetta da Montalcino.' },
    ]
  },
  {
    id: 'biodinamica',
    label: 'Biodinamica',
    icon: 'ti-leaf',
    titolo: 'Come lavoriamo la terra',
    contenuto: [
      { t: 'Cosa significa biodinamica', c: 'L\'agricoltura biodinamica va oltre l\'organico: considera il podere come un organismo vivente autonomo. Utilizza il calendario biodinamico (giorni radice, fiore, frutto, foglia) per decidere quando potare, raccogliere, vinificare. I preparati biodinamici come il 500 e il 501 sostituiscono completamente i fitofarmaci.' },
      { t: 'In pratica', c: 'Niente diserbanti, niente pesticidi di sintesi, niente concimi chimici. Lavoriamo il suolo con i cavalli in alcune parcelle per non compattarlo. Abbiamo un allevamento di animali che produce il letame per i preparati. L\'orto sinergico fornisce verdure alla comunità e migliora la biodiversità.' },
      { t: 'Le nostre certificazioni', c: 'Siamo certificati Demeter (la certificazione biodinamica più rigorosa al mondo) e Triple A. Abbiamo convertito all\'agricoltura biodinamica nel 2011 dopo anni di transizione. Ogni anno miglioriamo — la biodinamica non ha un punto di arrivo, è un percorso.' },
    ]
  },
  {
    id: 'regole',
    label: 'Regole e procedure',
    icon: 'ti-clipboard-list',
    titolo: 'Come funziona il podere',
    contenuto: [
      { t: 'Orari', c: 'Il lavoro in vigna inizia solitamente alle 7:00 e finisce alle 15:30 nel periodo estivo, con pausa pranzo di 30 minuti. In cantina gli orari variano con la stagione. Durante la vendemmia (settembre-ottobre) si lavora intensamente, spesso anche nel fine settimana — è il periodo più bello e più faticoso dell\'anno.' },
      { t: 'Staff houses', c: 'Gli alloggi sono forniti dall\'azienda a costo ridotto. Le regole sono semplici: rispetta gli spazi comuni, non fare rumore dopo le 23:00, non portare ospiti fissi senza accordo. Ogni casa ha un responsabile con le chiavi — segnala a lui qualsiasi problema prima di contattare l\'amministrazione.' },
      { t: 'Salute e sicurezza', c: 'Tutti i dipendenti devono avere gli attestati in regola: HACCP (obbligatorio per chi maneggia alimenti), corso sicurezza (per tutti), patente muletto e trattore se necessarie per il proprio ruolo. L\'azienda organizza i corsi — comunicalo all\'amministrazione in tempo utile prima della scadenza.' },
      { t: 'Come comunicare', c: 'Per questioni urgenti rivolgiti al tuo responsabile di reparto. Per questioni amministrative (buste paga, ferie, attestati) contatta l\'ufficio. I turni e le attività vengono comunicati ogni settimana via WhatsApp. In caso di malattia avvisa entro le 8:00 del mattino.' },
    ]
  }
]

export default function Onboarding() {
  const [sezione, setSezione] = useState('azienda')
  const sel = SEZIONI.find(s => s.id === sezione)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Benvenuto al Podere</h2>
        <p className={styles.sub}>Tutto quello che devi sapere per iniziare. Leggilo con calma.</p>
      </div>

      <div className={styles.layout}>
        <nav className={styles.nav}>
          {SEZIONI.map(s => (
            <button key={s.id} className={`${styles.navBtn} ${sezione === s.id ? styles.navActive : ''}`} onClick={() => setSezione(s.id)}>
              <i className={`ti ${s.icon}`} style={{fontSize:16, marginRight:10, verticalAlign:-2}}></i>
              {s.label}
            </button>
          ))}
        </nav>

        <div className={styles.content}>
          <p className={styles.sectionLabel}>{sel.label}</p>
          <h3 className={styles.sectionTitle}>{sel.titolo}</h3>
          <div className={styles.cards}>
            {sel.contenuto.map((c, i) => (
              <div key={i} className={styles.card}>
                <p className={styles.cardTitle}>{c.t}</p>
                <p className={styles.cardText}>{c.c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
