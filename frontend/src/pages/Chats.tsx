import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import ChatContainer from '../components/ChatContainer'
import MessageArea from '../components/MessageArea'
import { chatStore } from '../store/useChatStore'
import SearchModal from '../components/SearchModal'

const Chats = () => {
  const  selectedUser = chatStore((state) => state.selectedUser)
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div className='flex'>
        <Sidebar toggleModal={() => setShowModal(!showModal)} />
        {selectedUser? <ChatContainer><MessageArea /></ChatContainer>: <ChatArea />}
      </div>
      <SearchModal showModal={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

export default Chats
