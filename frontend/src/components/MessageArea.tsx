import React from 'react'
import { ArrowLeft, Lock, User } from 'lucide-react'
import TextArea from './TextArea'
import TextBlock from './TextBlock'
import { chatStore, type Message } from '../store/useChatStore'
import { useShallow } from 'zustand/shallow'
import { formatMessageTime } from '../lib/utils'
import MessageSkeleton from './MessageSkeleton'

type MessageAreaProps = {
  onBack?: () => void;
};

const MessageArea = ({onBack}: MessageAreaProps) => {
  const messageEndRef = React.useRef<HTMLDivElement>(null);

  const {
    messages, 
    getMessages, 
    selectedUser, 
    isMessagesLoading, 
  } = chatStore(useShallow((state) => ({
    messages: state.messages,
    getMessages: state.getMessages,
    selectedUser: state.selectedUser,
    isMessagesLoading: state.isMessagesLoading,
  })));

  React.useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  React.useEffect(() => {
    if (!selectedUser?._id) return;

    const controller = new AbortController();
    const loadAndSubscribe = async() => {
      await getMessages(selectedUser, controller.signal);
    };
    loadAndSubscribe();
    return () => {
      controller.abort();
    }
  }, [selectedUser?._id, getMessages]);

  if (isMessagesLoading) return (<div className='h-screen w-full'><MessageSkeleton /></div>);

  return (
    <div className='h-screen w-full flex flex-col overflow-y-hidden bg-[#0c120c]'>
      <div className='w-full bg-[#111318] py-3 sm:py-4 px-3 sm:px-6 flex-shrink-0'>
        <div className='w-full flex items-center gap-2 sm:gap-3'>
          <button 
            onClick={onBack} 
            className='md:hidden p-1.5 hover:bg-[#171A21] rounded-md flex-shrink-0'
            aria-label='Back to conversations'
          >
            <ArrowLeft className='text-white' size={20} />
          </button>
          <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#171A21] relative flex-shrink-0'>
            <User className='text-white absolute right-2.5 top-2.5 sm:right-3 sm:top-3' size={20} />
          </div>
          <div className='flex-1 min-w-0 bg-transparent flex flex-col'>
            <div className='w-full text-white text-sm sm:text-base truncate'>
              {selectedUser?.username}
            </div>
            <div className='w-full text-emerald-400 text-xs'>
              <Lock className='text-emerald-400 inline-block mr-1 sm:mr-2' size={12} />End-to-end encrypted
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 flex flex-col min-h-0 border-t-2 border-t-zinc-800 bg-[#0c120c]'>
        <div className='flex justify-center flex-shrink-0'>
          <div className='h-fit w-fit flex items-center bg-emerald-900/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.15)] mt-3 gap-1.5 sm:gap-2 text-emerald-400 text-xs sm:text-sm border-2 border-solid leading-tight border-emerald-500/30 rounded-full py-1 px-3 sm:px-4'>
            <Lock size={12} />
            <span>Messages are end-to-end encrypted</span>
          </div>
        </div>
        
        <div className='flex-1 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          <div className='flex flex-col gap-2 p-2 sm:p-4'>
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
        </div>
        
        <TextArea />
      </div>
    </div>
  )
}

export default MessageArea
