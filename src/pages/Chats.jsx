import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import Navbar from '../components/Navbar'

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
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError('User not authenticated')
                return
            }

            const { data, error } = await supabase
                .from('user_uploads')
                .select('id, filename, json_data, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            const chatList = data.map(upload => ({
                id: upload.id,
                filename: upload.filename,
                chatName: upload.json_data?.name || 'Unknown Chat',
                chatType: upload.json_data?.type || 'unknown',
                chatId: upload.json_data?.id || null,
                messageCount: upload.json_data?.messages?.length || 0,
                createdAt: upload.created_at
            }))

            setChats(chatList)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    
    if (loading) {
        return (
            <div className="flex justify-between items-center w-screen min-h-screen">     
                <Navbar user={user} />
                <div className="flex items-center justify-center text-2xl w-full">Loading chats..</div>
                <div></div>
            </div>
        )
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
        <div className="w-screen pt-[6vh]">
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
                <div className="flex flex-col items-center py-3 min-h-[94vh]">
                    {chats.map((chat) => (
                        <ChatBubble key={chat.id} chat={chat} />
                    ))}
                    <button className='bg-gray-500 absolute bottom-12 right-4 py-2 px-4 rounded-3xl font-bold uppercase hover:bg-[#007A97] transition-colors duration-150' onClick={()=>{navigate(`/upload`)}}>Upload</button>
                </div>
            )}
        </div>
    )
}

export default Chats