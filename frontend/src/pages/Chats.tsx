import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import MessageArea from '../components/MessageArea'
import { chatStore } from '../store/useChatStore'
import SearchModal from '../components/SearchModal'

const Chats = () => {
  const selectedUser = chatStore((state) => state.selectedUser)
  const setSelectedUser = chatStore((state) => state.setSelectedUser)
  const [showModal, setShowModal] = React.useState(false);

  const handleBack = () => {
    setSelectedUser(null as never);
  };

  return (
    <>
      <div className='flex h-screen overflow-hidden'>
        <div className={`
          ${selectedUser ? 'hidden' : 'flex'} 
          md:flex 
          w-full md:w-[280px] lg:w-[320px] xl:w-[22vw] 
          flex-shrink-0
        `}>
          <Sidebar toggleModal={() => setShowModal(!showModal)} />
        </div>

        <div className={`
          ${selectedUser ? 'flex' : 'hidden'} 
          md:flex 
          flex-1 
          min-w-0
        `}>
          {selectedUser ? (
            <MessageArea onBack={handleBack} />
          ) : (
            <ChatArea />
          )}
        </div>
      </div>
      <SearchModal showModal={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

export default Chats
