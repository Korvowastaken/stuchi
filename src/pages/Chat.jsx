import { useState, useEffect, useRef } from 'react'
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
    const messagesEndRef = useRef(null)

    const colorrand = ["#18373D", "#ACAB45", "#893A1A"]

    const getRandomColor = () => {
        return colorrand[Math.floor(Math.random() * colorrand.length)]
    }

    const avatarColor = getRandomColor()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (chatId) {
            fetchChatData()
        } else {
            setError('No chat ID provided')
            setLoading(false)
        }
    }, [chatId])

    useEffect(() => {
        scrollToBottom()
    }, [chatData])

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
                    const displayText = item.text.length > 50 
                        ? item.text.substring(0, 50) + '...' 
                        : item.text
                    
                    return (
                        <a 
                            key={index}
                            href={item.text} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-400 underline hover:text-blue-300 break-all"
                            title={item.text} // Show full URL on hover
                        >
                            {displayText}
                        </a>
                    )
                }
                return item.text || ''
            })
        }
        
        // Handle long URLs in plain text
        if (typeof text === 'string') {
            // Check if it's a long URL
            if (text.startsWith('http') && text.length > 50) {
                return (
                    <a 
                        href={text} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 underline hover:text-blue-300 break-all"
                        title={text}
                    >
                        {text.substring(0, 50)}...
                    </a>
                )
            }
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
        <div className="w-screen relative pt-[6vh]">
           <div className='fixed top-0 left-0 right-0 z-40 flex justify-between items-center border-b min-h-[6vh] px-1 bg-[#0C263B]'>
                <button
                    onClick={() => navigate('/')}
                    className="bg-[#18373D] text-white font-extrabold px-3 py-1 rounded-4xl hover:bg-[#5ED0EE] transition-all duration-200"
                >
                    ←
                </button>
                
                <div className='flex justify-between'>
                    <h1 className="hover:text-gray-400 px-3 py-2 rounded-md text-2xl font-medium">
                        {chatData.name}
                    </h1>

                </div>
                <p className='flex justify-center items-center rounded-3xl font font-extrabold mr-2 h-8 w-8' style={{backgroundColor: avatarColor,}}>{chatData.name[0]}</p>



            </div>
            

            <div className="space-y-1 overflow-auto px-2 bg-[#1C2B33] min-h-screen pb-4">
                {(() => {
                    
                    const uniqueSenders = [...new Set(chatData.messages?.map(msg => msg.from))]
                    
                    const currentUser = uniqueSenders.find(sender => sender !== chatData.name) || uniqueSenders[0]
                    
                    return chatData.messages?.map((message, index) => {
                        const isOwnMessage = message.from === currentUser
                        
                        return (
                            <div key={message.id || index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                    {!isOwnMessage && (
                                        <div className="text-xs text-gray-400 mb-1 px-2">
                                            {message.from}
                                        </div>
                                    )}
                                    <div className={`px-4 py-2 rounded-2xl ${
                                        isOwnMessage 
                                            ? 'bg-[#2B527E] text-white rounded-br-md' 
                                            : 'bg-[#2E3C45] text-white rounded-bl-md'
                                    }`}>
                                        <div className="text-sm wrap-break-word overflow-wrap-anywhere">
                                            {formatMessageText(message.text)}
                                        </div>
                                    </div>
                                    <div className={`text-xs text-gray-500 mt-1 px-2 ${
                                        isOwnMessage ? 'text-right' : 'text-left'
                                    }`}>
                                        {message.date && formatDate(message.date)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                })()}
                <div ref={messagesEndRef} />
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