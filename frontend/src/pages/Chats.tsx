import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import ChatContainer from '../components/ChatContainer'
import MessageArea from '../components/MessageArea'
import { chatStore } from '../store/useChatStore'

const Chats = () => {
  const { selectedUser } = chatStore((state) => state.selectedUser)

  return (
    <div className='flex'>
      <Sidebar />
      {selectedUser? <ChatContainer><MessageArea /></ChatContainer>: <ChatArea />}
    </div>
  )
}

export default Chats
