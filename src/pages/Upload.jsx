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
        
        <div className="flex flex-col gap-12 justify-center items-center h-[94vh] w-screen bg-white">
            <div className=" border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#007A97] transition-colors duration-200">
                <div className="mb-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                </div>
                
                <input 
                    type="file" 
                    name="export" 
                    id="file-upload"
                    accept=".json,application/json" 
                    onChange={handleFileUpload}
                    disabled={loading}
                    className='hidden' 
                />
                <label 
                    htmlFor="file-upload"
                    className={`cursor-pointer inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        loading 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-[#007A97] text-white hover:bg-[#5ED0EE] hover:shadow-lg'
                    }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Choose JSON File
                        </>
                    )}
                </label>
                
                <p className="text-sm text-slate-500 mt-3">
                    Supported format: JSON (.json)
                </p>
            </div>


            {success && (
                <div className='bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center'>
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Chat data uploaded successfully!
                </div>
            )}

            {error && (
                <div className='bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-center'>
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}
        </div>


    )

}

export default Upload