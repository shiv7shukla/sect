import React from 'react'
import { Lock } from 'lucide-react'
import TextArea from './TextArea'
import TextBlock from './TextBlock'
import { chatStore, type Message } from '../store/useChatStore'
import { useShallow } from 'zustand/shallow'
import { formatMessageTime } from '../lib/utils'
// import { authStore } from '../store/useAuthStore'

const MessageArea = () => {
  const {messages} = chatStore(useShallow((state) => ({
    messages: state.messages,
  })));
  // const { onlineusers } = authStore(useShallow((state) => ({
  //   onlineusers: state.onlineUsers
  // })));
  const messageEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({behavior: "smooth"});
  }, [messages])

  return (
    <div className='h-screen w-[78vw] flex flex-col justify-between border-t-2 border-t-zinc-800 bg-[#0C0E12]'>
      <div className='flex justify-center '>
        <div className='h-fit w-fit flex items-center bg-emerald-900/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.15)] mt-3 gap-2 text-emerald-400 text-sm border-2 border-solid leading-tight border-emerald-500/30 rounded-full py-1 px-4'>
          <Lock size={12} />
          <span>Messages are end-to-end encrypted</span>
        </div>
      </div>
      <div>
        <div className='flex flex-col gap-2 p-4'>
          {messages.map((message: Message) => {
            return(
              <TextBlock 
                key={message.id} 
                ref={messageEndRef} 
                text={message.content.text}
                senderUsername={message.senderUsername} 
                createdAt={formatMessageTime(message.createdAt)} 
              />
            )})}
        </div>
        <TextArea />
      </div>
    </div>
  )
}

export default MessageArea
