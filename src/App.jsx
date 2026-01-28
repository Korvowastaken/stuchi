import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <form action="file" method="post"  className=' flex flex-col gap-4 '>
          <input type="file" name="export" id="" className='border border-amber-300 p-24' />
          <p className='border border-amber-300 rounded'>upload file here</p>
        </form>
      </div>
    </>
  )
}

export default App
