import { Lock } from 'lucide-react'
import React from 'react'
import TextArea from './TextArea'

const MessageArea = () => {
  return (
    <>
      <div className='h-full w-full flex justify-center bg-[#0C0E12]'>
        <div className='h-fit w-fit flex items-center bg-emerald-900/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.15)] mt-6 gap-2 text-emerald-400 text-sm border-2 border-solid leading-tight border-emerald-500/30 rounded-full py-1 px-4'>
          <Lock size = {12} />
          <span>Messages are end-to-end encrypted</span>
        </div>
      </div>
      <TextArea />
    </>
  )
}

export default MessageArea
