import Navbar from './Navbar'

function Loading({ user, message = "Loading..." }) {
  return (
    <div className="flex justify-between items-center w-screen min-h-screen">     
      <Navbar user={user} />
      <div className="flex items-center justify-center text-2xl w-full">
        {message}
      </div>
      <div></div>
    </div>
  )
}

export default Loading
