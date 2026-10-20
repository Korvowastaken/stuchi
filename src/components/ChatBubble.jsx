import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { avatarColor } from '../lib/avatarColor'

function ChatBubble({ chat, onDelete }) {
    const navigate = useNavigate()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDelete = (e) => {
        e.stopPropagation()
        setShowDeleteConfirm(true)
    }

    const confirmDelete = (e) => {
        e.stopPropagation()
        setShowDeleteConfirm(false)
        onDelete(chat.id)
    }

    const cancelDelete = (e) => {
        e.stopPropagation()
        setShowDeleteConfirm(false)
    }

    const handleClick = () => {
        navigate(`/chat?id=${chat.id}`)
    }

    return (
        <div
            onClick={handleClick}
            onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && handleClick()}
            role="link"
            tabIndex={0}
            className="relative w-full border-0 border-b rounded-t px-2 py-2 hover:bg-[#18373D] cursor-pointer transition-colors"
        >
            <div className="flex items-center">
                <div className='flex items-center grow'>

                    <p className='flex justify-center items-center border rounded-3xl font font-extrabold  mr-2 h-12 w-12' style={{backgroundColor: avatarColor(chat.id)}}>{chat.chatName[0]}</p>
                    <h3 className="text-lg font-semibold">{chat.chatName}</h3>

                </div>
                <div className="flex flex-col justify-center mr-2 gap py-4 text-left h-full">
                    <p className="text-xs text-[#5ED0EE] font-bold">
                        {new Date(chat.createdAt).toLocaleDateString()}, {new Date(chat.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
                 <button
                    onClick={handleDelete}
                    className='mr-auto text-white p-1 bg-[#007A97] rounded-xl hover:text-red-700 transition-colors'
                    title='Delete chat'
                    aria-label='Delete chat'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {showDeleteConfirm && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-[#252626] rounded-lg p-4 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold mb-2">Delete Chat?</h3>
                        <p className=" mb-4">Are you sure you want to delete this chat? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 hover:text-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBubble
