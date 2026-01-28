import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <form action="file" method="post">
        <input type="file" name="export" id="" />
        <p>upload file here</p>
      </form>
    </>
  )
}

export default App
