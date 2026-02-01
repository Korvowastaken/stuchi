import { useState } from "react"
import { supabase } from '../lib/supabase'

function Upload() {

    const [error, setError] = useState(null)
    const [chatData, setChatData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setLoading(true)
        setError(null)
        setSuccess(false)

        const reader = new FileReader()
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result)
                
                if (!data.name || !data.messages || !Array.isArray(data.messages)) {
                    throw new Error('Invalid JSON structure. Expected name and messages fields.')
                }
                
                setChatData(data)
                
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    throw new Error('User not authenticated')
                }
                
                const { error: dbError } = await supabase
                    .from('user_uploads')
                    .insert({
                        user_id: user.id,
                        filename: file.name,
                        json_data: data
                    })
                
                if (dbError) throw dbError
                
                setSuccess(true)
                setError(null)
            } catch (err) {
                setError(err.message || 'Error processing file')
                setChatData(null)
                setSuccess(false)
            } finally {
                setLoading(false)
            }
        }
        reader.onerror = () => {
            setError('Error reading file')
            setChatData(null)
            setSuccess(false)
            setLoading(false)
        }
        reader.readAsText(file)
    }

    const formatMessageText = (text) => {
        if (Array.isArray(text)) {
            return text.map(item => {
                if (typeof item === 'string') return item
                if (item.type === 'link') {
                    return <a href={item.text} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{item.text}</a>
                }
                return item.text || ''
            })
        }
        return text
    }

    const getChatMessages = () => {
        if (!chatData?.messages) return []
        return chatData.messages.map(e => [`${e.from}: `, formatMessageText(e.text)])
    }

    const chatMessages = getChatMessages()
    console.log(chatMessages)



    return(

        <>
            <div className='flex justify-center items-center h-screen'>
                <div className='flex flex-col gap-6 max-w-2xl w-full p-6'>
                    <form className='flex flex-col gap-4'>
                        <input 
                        type="file" 
                        name="export" 
                        id="" 
                        accept=".json,application/json" 
                        onChange={handleFileUpload}
                        disabled={loading}
                        className='border border-amber-300 p-4 disabled:opacity-50' 
                        />
                        <p className='border border-amber-300 rounded p-2 text-center'>
                            {loading ? 'Processing...' : 'Upload JSON file here'}
                        </p>
                    </form>
                
                    {success && (
                        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
                            Chat data uploaded successfully!
                        </div>
                    )}

                    {error && (
                        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                            {error}
                        </div>
                    )}

                    {chatData && (
                        <div className='border border-gray-300 rounded p-4'>
                            <h3 className='font-bold mb-2'>Chat: {chatData.name}</h3>
                            <p className='text-sm text-gray-600 mb-4'>Type: {chatData.type} | ID: {chatData.id}</p>
                            <div className='bg-gray-100 p-3 rounded overflow-auto max-h-120 text-sm text-black'>
                                {chatMessages.map((message, index) => (
                                    <div key={index} className="flex items-start gap-4 my-8">
                                        <div className="flex">
                                            <span className='rounded min-w-24 px-4 py-2 bg-amber-400'>
                                                {message[0]}
                                            </span>
                                        </div>
                                        <p className="px-4 py-2 rounded-2xl bg-gray-600 text-white">
                                            {message[1]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>

    )
}

export default Upload