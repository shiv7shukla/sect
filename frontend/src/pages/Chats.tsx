import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { chatStore } from '../store/useChatStore'
import { useShallow } from 'zustand/shallow';

const SearchModalComponewnt = React.lazy(() => import("../components/SearchModal"));
const MessageAreaComponent = React.lazy(() => import("../components/MessageArea"));
const VideoCallComponent = React.lazy(() => import("../components/VideoCallModal"));

const Chats = () => {
  const {setSelectedUser, selectedUser} = chatStore(useShallow((state) => ({selectedUser: state.selectedUser, setSelectedUser: state.setSelectedUser})));
  const [showModal, setShowModal] = React.useState(false);
  const [videoCallModal, setvideoCallModal] = React.useState(false);

  const handleBack = () => {
    setSelectedUser(null);
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
            <MessageAreaComponent onBack={handleBack} />
          ) : (
            <ChatArea />
          )}
        </div>
      </div>
      {showModal && (
        <React.Suspense fallback={null}>
          <SearchModalComponewnt showModal={showModal} onClose={() => setShowModal(false)} />
        </React.Suspense>
      )}
      {videoCallModal && (
        <React.Suspense fallback={null}>
          <VideoCallComponent isOpen={videoCallModal} closeCall={() => setvideoCallModal(false)} />
        </React.Suspense>
      )}
    </>
  )
}

export default Chats
