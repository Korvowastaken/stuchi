import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function Chats() {
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

            // Extract chat information from JSON data
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

    const handleChatClick = (chatId) => {
        navigate(`/chat?id=${chatId}`)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg">Loading chats...</div>
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
        <div className="w-screen">            
            {chats.length === 0 ? (
                <div className="flex flex-col justify-center items-center min-h-[94vh]" >
                    <p className="text-2xl mb-8 font-bold uppercase">No chats uploaded yet</p>
                    <button
                        onClick={() => navigate('/upload')}
                        className="bg-[#007A97] text-white px-4 py-2 rounded-4xl hover:bg-[#5ED0EE] transition-all duration-200 "
                    >
                        Upload Your First Chat
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{chat.chatName}</h3>
                                    <p className="text-sm text-gray-600">
                                        Type: {chat.chatType} | Messages: {chat.messageCount}
                                    </p>
                                    {chat.chatId && (
                                        <p className="text-sm text-gray-500">Chat ID: {chat.chatId}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        {new Date(chat.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(chat.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">File: {chat.filename}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Chats