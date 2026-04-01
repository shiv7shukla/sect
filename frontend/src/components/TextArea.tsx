import { SendHorizontal } from 'lucide-react'
import React from 'react'
import { chatStore } from '../store/useChatStore';
import { useShallow } from 'zustand/shallow';
import { authStore } from '../store/useAuthStore';
import { socket } from '../lib/socket';

const TextArea = () => {
  const [text, setText] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const typingTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = React.useId();
  const gradientId = `gradientId-${id}`;

  const {
    sendMessage,
    isTyping,
    selectedUser, 
    conversations,
  } = chatStore(useShallow((state) => ({
    sendMessage: state.sendMessage,
    isTyping: state.isTyping,
    selectedUser: state.selectedUser,
    conversations: state.conversations
  })));
  const selectedConversation = conversations.filter(c => c.conversationId === selectedUser?.conversationId);

  const handleKeyDown = React.useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current?.value || !selectedUser?.conversationId) return;
    if (e.key === "Enter"){
      e.preventDefault();
      await sendMessage(text, selectedConversation[0].type);
      setText("");
    }
  }, [sendMessage, selectedConversation, selectedUser, text]);
  const typingHandler = () => {
    if (!socket) return;
    if (inputRef){
      socket.emit("typing", authStore.getState().authUser?._id, chatStore.getState().selectedUser?._id);
    }

    if (typingTimer) clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.emit("not typing", chatStore.getState().selectedUser?.conversationId, chatStore.getState().selectedUser?.username);
    }, 1500)
  };

  return (
    <div className='w-full flex flex-col items-center justify-between border-t-2 border-t-zinc-800 bg-[#111318] py-2 sm:py-4 px-2 sm:px-4'>
      <div className='w-full flex gap-2 sm:gap-4'>
        {/* {isTyping? <div className='h-10 w-full text-white bg-orange-700 text-md'>Loading...</div>:<></>} */}
        <input 
          type="text"
          value={text}
          ref={inputRef}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder='Type a secure message...' 
          onChange={(e) => {setText(e.target.value);typingHandler()}}
          className='h-10 w-full rounded-xl border-2 border-zinc-900 focus:border-emerald-400 transition-colors bg-[#171A21] focus:outline-none px-2 sm:px-3 placeholder:text-gray-500 text-white text-sm sm:text-base'
        />
        <button 
          className={`h-10 w-10 flex-shrink-0 bg-emerald-400 rounded-xl 
            ${text.length > 0? "opacity-100 cursor-pointer ": "opacity-50 cursor-default"} 
            transition-all duration-300`} 
            disabled={text.length < 0}
            onClick={() => {
                if (selectedUser?.conversationId){
                  sendMessage(text, selectedConversation[0].type);
                  setText("");
                }
              }
            }
            >
            <SendHorizontal 
              className={`size-5 sm:size-6 text-black translate-x-2 
                ${text.length > 0? "-rotate-90": "rotate-0"} 
                transition-transform duration-300`}
          />
        </button>
      </div>
      <footer className='flex gap-2 mt-1 sm:mt-2'>
        <div className='mt-1'>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          className="lucide-lock">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e5e7eb" />   {/* light top */}
              <stop offset="45%" stopColor="#000000" /> {/* dark middle */}
              <stop offset="100%" stopColor="#f97316" />{/* orange bottom */}
            </linearGradient>
          </defs>
          <rect
            width="18"
            height="11"
            x="3"
            y="11"
            rx="2"
            ry="2"
            fill={`url(${gradientId})`}
            stroke="#fb923c"
            strokeWidth="1"
          />
          <path
            d="M7 11V7a5 5 0 0 1 10 0v4"
            fill={`url(${gradientId})`}
            stroke="#fb923c"
            strokeWidth="1"
          />
        </svg>
        </div>
        <div className='text-xs text-gray-400'>
          Protected by sect encryption protocol
        </div>
      </footer>
    </div>
  )
}

export default TextArea;