import { User } from 'lucide-react'
import React from 'react'
import { chatStore } from '../store/useChatStore';

type ConversationListProps = {
  username: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  onClick: () => void;
}

const ConversationList = ({username, lastMessagePreview, lastMessageAt}: ConversationListProps) => {
  const {selectedUser} = chatStore((state) => ({selectedUser: state.selectedUser}))

  return (
    <>
      <div className={`h-16 w-full flex items-center justify-evenly gap-2 rounded-xl mb-2 bg-transparent transition-colors duration-200 hover:bg-[#171A21] px-2 hover:cursor-pointer ${selectedUser !== null ? 
        "border-l-2 border-l-emerald-400" : 
        "border-l-transparent"}`}>
        <div className='h-12 w-12 rounded-full bg-[#171A21] relative'><User className='text-white absolute right-3 top-3' size={24} /></div>
        <div className='h-12 w-[83%] bg-transparent flex flex-col'>
          <div className='w-full text-white text-base'>Shiv Shukla</div>
          <div className='w-full text-slate-500 text-sm'>This is my first message</div>
        </div>
      </div>    
    </>
  )
}

export default ConversationList
