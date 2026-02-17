import { Lock, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { chatStore } from '../store/useChatStore';
import { useShallow } from 'zustand/shallow';
import MessageSkeleton from './MessageSkeleton';

type ChatContainerProps = {
  children: React.ReactNode;
};

const ChatContainer = ({children}: ChatContainerProps) => {

  const {messages, isMessagesLoading, getMessages, selectedUser} = chatStore(useShallow((state) => ({
    messages: state.messages,
    isMessagesLoading: state.isMessagesLoading,
    getMessages: state.getMessages,
    selectedUser: state.selectedUser
  })))

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser);
  }, [selectedUser, getMessages])

  if (isMessagesLoading) return <MessageSkeleton />

  return (
    <div className='flex flex-col'>
      <div className='h-20 w-[78vw] bg-[#111318] py-4 px-6 '>
          <div className='h-10 w-full flex gap-2'>
            <div className='h-12 w-12 rounded-full bg-[#171A21] relative'>
              <User className='text-white absolute right-3 top-3' size={24} />
            </div>
              <div className='h-12 w-[83%] bg-transparent flex flex-col'>
                <div className='w-full text-white text-base'>
                  Shiv Shukla
                </div>
                <div className='w-full text-emerald-400 text-xs'>
                  <Lock className='text-emerald-400 inline-block mr-2' size = {12} />End-to-end encrypted
                </div>
              </div>
          </div>
          <hr className="-mx-6 border-b border-zinc-800 my-6" />
      </div>
      {children}
    </div>
  )
}

export default ChatContainer
