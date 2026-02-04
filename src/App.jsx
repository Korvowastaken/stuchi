import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Upload from './pages/Upload.jsx'
import Chat from './pages/Chat.jsx'
import Chats from './pages/Chats.jsx'
import Login from './pages/Login.jsx'
import Navbar from './components/Navbar.jsx'
import Loading from './components/Loading.jsx'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <Loading user={null} message="Loading..." />
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">        
        <main>
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/upload" />} 
            />
            <Route 
              path="/" 
              element={user ? <Chats user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/chat" 
              element={user ? <Chat user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/upload" 
              element={user ? <Upload user={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
