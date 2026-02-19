import { Lock } from 'lucide-react'
import React from 'react'
import TextArea from './TextArea'
import TextBlock from './TextBlock'

const MessageArea = () => {
  return (
    <div className='h-[90%] w-full flex flex-col justify-between border-t-2 border-t-zinc-800 bg-[#0C0E12]'>
      <div className='flex justify-center '>
        <div className='h-fit w-fit flex items-center bg-emerald-900/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.15)] mt-3 gap-2 text-emerald-400 text-sm border-2 border-solid leading-tight border-emerald-500/30 rounded-full py-1 px-4'>
          <Lock size = {12} />
          <span>Messages are end-to-end encrypted</span>
        </div>
      </div>
      <div>
        <div className='flex flex-col gap-2 p-4'>
          <TextBlock />
        </div>
        <TextArea />
      </div>
    </div>
  )
}

export default MessageArea
