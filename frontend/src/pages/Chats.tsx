import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import ChatContainer from '../components/ChatContainer'
import MessageArea from '../components/MessageArea'

const Chats = () => {
  return (
    <div className='flex'>
      <Sidebar />
      {/* <ChatArea/> */}
      <ChatContainer >
        <MessageArea />
      </ChatContainer >
    </div>
  )
}

export default Chats
