import React from 'react'

type TextBlockProps = {
  text: string,
  isSelf: boolean
  createdAt: string,
}

const TextBlock = React.memo(({text, createdAt, isSelf}: TextBlockProps ) => {
  
  return (
    <>
      <div 
        className={`min-h-[3rem] sm:min-h-[4rem] w-fit max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] flex flex-col justify-between gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 ${isSelf ? "bg-emerald-600 self-end" : "bg-[#1E2229] self-start"} rounded-xl`} 
      >
        <p className={`text-sm sm:text-md break-words ${!isSelf ? "text-white" : "text-black"}`}>{text}</p>
        <time className={`text-xs ${isSelf ? "text-gray-200" : "text-gray-400"}`}>{createdAt}</time>
      </div>
    </>
  )
});

export default TextBlock
