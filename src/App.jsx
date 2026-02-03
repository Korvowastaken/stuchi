import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Upload from './pages/Upload.jsx'
import Chat from './pages/Chat.jsx'
import Chats from './pages/Chats.jsx'
import Login from './pages/Login.jsx'
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {user && (
          <nav className="flex shadow-sm border-b min-h-[6vh]">
            <div className="flex items-center w-full px-1 sm:px-3 lg:px-5">
              <Link to="/" className=" hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                Chats
              </Link>
              <Link to="/upload" className=" hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                Upload
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="ml-auto hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </nav>
        )}
        
        <main>
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/upload" />} 
            />
            <Route 
              path="/" 
              element={user ? <Chats /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/chat" 
              element={user ? <Chat /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/upload" 
              element={user ? <Upload /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
