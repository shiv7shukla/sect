import { Shield } from 'lucide-react'
import React from 'react'

const ChatArea = () => {
  return (
    <div className='h-screen w-[78vw] bg-[#0C0E12] flex flex-col justify-center items-center'>
      <div className='h-24 w-24 mb-6 animate-float bg-transparent shadow-[0_0_30px_rgba(16,185,129,0.15)] border-solid border-2 border-emerald-900 rounded-full corner-squircle flex items-center justify-center relative'>
        <div className='absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]'></div>
        <Shield className='h-12 w-12 text-emerald-700' strokeWidth={2} /></div>
      <div className='text-slate-300 text-3xl mb-4'>Select a Conversation</div>
      <div className='text-slate-400 text-sm'>Choose a contact from the sidebar or add a new one using their</div>
      <div className='text-slate-400 text-sm'>UUID to start a secure conversation.</div>
    </div>
  )
}

export default ChatArea
