import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'

const Chats = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <ChatArea/>
    </div>
  )
}

export default Chats
