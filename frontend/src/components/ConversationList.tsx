import { User } from 'lucide-react'
import React from 'react'

type ConversationListProps = {
  username: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  seelcteduser: string;
}

const ConversationList = ({username, lastMessagePreview, lastMessageAt, selecteduser}: ConversationListProps) => {
  return (
    <>
      <div className={`h-16 w-[20vw] flex items-center justify-evenly gap-2 rounded-xl mb-2 bg-l-transparent transition-colors duration-200 hover:bg-[#171A21] px-2 hover:cursor-pointer {selectedUser !== null ? "border-l-2 border-l-emerald-400 "}`}>
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
