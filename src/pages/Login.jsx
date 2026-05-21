import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o password non corretti.')
      setLoading(false)
    } else {
      navigate('/app/dashboard')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <Link to="/" className={styles.backLink}>
          <i className="ti ti-arrow-left" style={{fontSize:14, marginRight:6, verticalAlign:-1}}></i>
          Torna al sito
        </Link>
        <div className={styles.logo}>Podere Le Ripi</div>
        <p className={styles.sub}>Portale interno — accesso riservato al personale</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nome@email.com"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.input}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Accesso in corso…' : 'Accedi'}
          </button>
        </form>
        <p className={styles.note}>
          Problemi di accesso? Contatta l'amministrazione.
        </p>
      </div>
    </div>
  )
}
