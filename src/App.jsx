import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  
  const [jsonData, setJsonData] = useState(null)
  const [error, setError] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        setJsonData(data)
        setError(null)
      } catch (err) {
        setError('Invalid JSON file')
        setJsonData(null)
      }
    }
    reader.onerror = () => {
      setError('Error reading file')
      setJsonData(null)
    }
    reader.readAsText(file)
  }

  return (
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
          
          {jsonData && (
            <div className='border border-gray-300 rounded p-4'>
              <h3 className='font-bold mb-2'>Uploaded JSON Data:</h3>
              <pre className='bg-gray-100 p-3 rounded overflow-auto max-h-96 text-sm text-black'>
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
