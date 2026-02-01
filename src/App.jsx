import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Upload from './pages/Upload.jsx'
import Chat from './pages/Chat.jsx'
import Chats from './pages/Chats.jsx'
import './App.css'


function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className=" shadow-sm border-b">
          <div className="flex space-x-8 items-center">
                <Link to="/" className=" hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                  Chats
                </Link>
                <Link to="/upload" className=" hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                  Upload
                </Link>
                
              </div>
        </nav>
        
        <main className="mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Chats />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
