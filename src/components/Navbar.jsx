import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Navbar({ user }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    user && (
      <nav className="fixed top-0 left-0 right-0 z-50 flex shadow-sm border-b min-h-[6vh] bg-[#0C263B]">
        <div className="flex items-center w-full px-1 sm:px-3 lg:px-5">
          <Link to="/" className="hover:text-gray-400 px-3 py-2 rounded-md text-2xl font-medium">
            Chats
          </Link>
          
          <button
            onClick={handleSignOut}
            className="ml-auto hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </nav>
    )
  )
}

export default Navbar
