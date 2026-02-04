import { useNavigate } from 'react-router-dom'

function ChatBubble({ chat }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/chat?id=${chat.id}`)
    }

    return (
        <div
            onClick={handleClick}
            className="w-full border-0 border-b p-4 hover:bg-[#18373D] cursor-pointer transition-colors"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold">{chat.chatName}</h3>
                    <p className="text-sm text-gray-600">
                    </p>
                    {chat.chatId && (
                        <p className="text-sm text-gray-500">
                            Messages count: {chat.messageCount}

                        </p>
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
            
        </div>
    )
}

export default ChatBubble
