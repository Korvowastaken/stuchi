import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'

function Chats({ user }) {
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchChats()
    }, [])

    const fetchChats = async () => {
        try {
            // Only the chat name, not the whole export: json_data can be several MB per chat
            const { data, error } = await supabase
                .from('user_uploads')
                .select('id, filename, created_at, name:json_data->>name')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            const chatList = data.map(upload => ({
                id: upload.id,
                filename: upload.filename,
                chatName: upload.name || 'Unknown Chat',
                createdAt: upload.created_at
            }))

            setChats(chatList)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteChat = async (id) => {
        const { error } = await supabase
            .from('user_uploads')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error deleting chat:', error)
            return
        }

        setChats(chats => chats.filter(chat => chat.id !== id))
    }

    if (loading) {
        return <Loading user={user} message="Loading chats..." />
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center min-w-screen pt-[6vh]">
            <Navbar user={user} />
            {chats.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-2 gap-2 min-h-[94vh]" >
                    <p className="text-2xl mb-8 font-bold uppercase">No chats uploaded yet</p>
                    <button
                        onClick={() => navigate('/upload')}
                        className="bg-[#007A97] text-white px-4 py-2 rounded-4xl hover:bg-[#5ED0EE] transition-all duration-200 "
                    >
                        Upload Your First Chat
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 w-screen py-3 min-h-[94vh] lg:mx-[15vw] lg:w-[60vw] lg:p-3 lg:rounded-xl">
                    {chats.map((chat) => (
                        <ChatBubble key={chat.id} chat={chat} onDelete={deleteChat} />
                    ))}
                    <button className='bg-gray-500 fixed bottom-12 right-4 py-2 px-4 rounded-3xl font-bold uppercase hover:bg-[#007A97] transition-colors duration-150' onClick={()=>{navigate(`/upload`)}}>Upload</button>
                </div>
            )}
        </div>
    )
}

export default Chats
