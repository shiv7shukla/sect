import { SendHorizontal } from 'lucide-react'
import React, { useId } from 'react'

const TextArea = () => {
  const [text, setText] = React.useState("");
  const isTyping = text.length > 0;
  const id = useId();
  const gradientId = `gradientId-${id}`

  return (
    <div className='h-28 w-full flex flex-col items-center justify-between border-t-2 border-t-zinc-800 bg-[#111318] py-4 px-4'>
      <div className='w-full flex gap-4 '>
        <input 
        type="text" 
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder='Type a secure message...' 
        className='h-10 w-full rounded-xl border-2 border-zinc-900 focus:border-emerald-400 transition-colors bg-[#171A21] focus:outline-none px-2 placeholder:text-gray-500 text-white' />
        <button className={`h-10 w-10 bg-emerald-400 rounded-xl ${isTyping? "opacity-100 cursor-pointer ": "opacity-50 cursor-default"} transition-all duration-300`} disabled={!isTyping}>
          <SendHorizontal className={`size-6 text-black translate-x-2 ${isTyping? "-rotate-90": "rotate-0" } transition-transform duration-300`}/>
        </button>
      </div>
      <footer className='flex gap-2'>
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

export default TextArea