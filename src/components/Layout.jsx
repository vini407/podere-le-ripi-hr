import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import styles from './Layout.module.css'

export default function Layout() {
  const navigate = useNavigate()
  const { session } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const email = session?.user?.email || ''
  const initials = email.slice(0,2).toUpperCase()

  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          Podere Le <span>Ripi</span>
        </div>
        <div className={styles.links}>
          <NavLink to="/app/dashboard" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Dashboard</NavLink>
          <NavLink to="/app/dipendenti" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Dipendenti</NavLink>
          <NavLink to="/app/staff-houses" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Staff Houses</NavLink>
          <NavLink to="/app/onboarding" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Onboarding</NavLink>
          <NavLink to="/app/annunci" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Annunci</NavLink>
        </div>
        <div className={styles.right}>
          <div className={styles.avatar}>{initials}</div>
          <button className={styles.logout} onClick={handleLogout}>
            <i className="ti ti-logout" style={{fontSize:16}}></i>
          </button>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
