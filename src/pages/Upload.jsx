import { useState } from "react"

function Upload() {

    const [error, setError] = useState(null)
    const [chatData, setChatData] = useState(null)

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result)
            setChatData(data)
            setError(null)
        } catch (err) {
            setError('Invalid JSON file')
            setChatData(null)
        }
        }
        reader.onerror = () => {
        setError('Error reading file')
        setChatData(null)
        }
        reader.readAsText(file)

    }

    const getChatMessages = () => {
        if (!chatData?.messages) return []
        return chatData.messages.map(e => e.text || '')
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
                        className='border border-amber-300 p-4' 
                        />
                        <p className='border border-amber-300 rounded p-2 text-center'>upload JSON file here</p>
                    </form>
                
                    {error && (
                        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                            {error}
                        </div>
                    )}

                    {chatData && (
                        <div className='border border-gray-300 rounded p-4'>
                            <h3 className='font-bold mb-2'>Chat Messages:</h3>
                            <div className='bg-gray-100 p-3 rounded overflow-auto max-h-96 text-sm text-black'>
                                {chatMessages.map((message, index) => (
                                    <p key={index} className='mb-2 p-2 bg-white rounded border max-w-200'>
                                        {message}
                                    </p>
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