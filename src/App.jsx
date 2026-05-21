import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Dipendenti from './pages/Dipendenti'
import DipendenteProfilo from './pages/DipendenteProfilo'
import StaffHouses from './pages/StaffHouses'
import Onboarding from './pages/Onboarding'
import Annunci from './pages/Annunci'
import Layout from './components/Layout'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'Cormorant Garamond, serif',fontSize:'24px',color:'#6B4C2A'}}>Podere Le Ripi…</div>
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      <BrowserRouter>
        <Routes>
          {/* Pagine pubbliche */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Area protetta */}
          <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dipendenti" element={<Dipendenti />} />
            <Route path="dipendenti/:id" element={<DipendenteProfilo />} />
            <Route path="staff-houses" element={<StaffHouses />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="annunci" element={<Annunci />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
