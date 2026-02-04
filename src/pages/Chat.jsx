import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'

function Chat({ user }) {
    const [searchParams] = useSearchParams()
    const chatId = searchParams.get('id')
    const [chatData, setChatData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (chatId) {
            fetchChatData()
        } else {
            setError('No chat ID provided')
            setLoading(false)
        }
    }, [chatId])

    const fetchChatData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError('User not authenticated')
                return
            }

            const { data, error } = await supabase
                .from('user_uploads')
                .select('json_data, filename, created_at')
                .eq('id', chatId)
                .eq('user_id', user.id)
                .single()

            if (error) throw error
            if (!data) {
                setError('Chat not found')
                return
            }

            setChatData(data.json_data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatMessageText = (text) => {
        if (Array.isArray(text)) {
            return text.map((item, index) => {
                if (typeof item === 'string') return item
                if (item.type === 'link') {
                    return (
                        <a 
                            key={index}
                            href={item.text} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 underline hover:text-blue-600"
                        >
                            {item.text}
                        </a>
                    )
                }
                return item.text || ''
            })
        }
        return text
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString()
    }

    if (loading) {
        return <Loading user={user} message="Loading chat..." />
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Back to Chats
                    </button>
                </div>
            </div>
        )
    }

    if (!chatData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Chat not found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Back to Chats
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl relative pt-[6vh]">
           <div className='fixed top-0 left-0 right-0 z-40 flex justify-center items-center border-b min-h-[4vh] px-1 bg-[#0C263B]'>
                <button
                    onClick={() => navigate('/')}
                    className="bg-[#18373D] text-white font-extrabold px-3 py-1 rounded-4xl hover:bg-[#5ED0EE] transition-all duration-200"
                >
                    ←
                </button>
                
                <div className='grow flex justify-center'>
                    <h1 className="hover:text-gray-400 px-3 py-2 rounded-md text-2xl font-medium">
                        {chatData.name}
                    </h1>
                </div>
            </div>
            

            <div className="space-y-4 overflow-auto">
                {chatData.messages?.map((message, index) => (
                    <div key={message.id || index} className="flex items-start gap-4">
                       
                        <div className="shrink-0">
                            <div className="bg-amber-400 text-black px-4 py-2 rounded-lg min-w-24 text-center font-medium">
                                {message.from}
                            </div>
                        </div>
                        
                       
                        <div className="grow">
                            <div className="bg-gray-600 text-white px-4 py-3 rounded-2xl rounded-tl-none">
                                <div className="text-sm">
                                    {formatMessageText(message.text)}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 ml-2">
                                {message.date && formatDate(message.date)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(!chatData.messages || chatData.messages.length === 0) && (
                <div className="text-center py-12">
                    <p className="text-gray-600">No messages in this chat</p>
                </div>
            )}
        </div>
    )
}

export default Chat