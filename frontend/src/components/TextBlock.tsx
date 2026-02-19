import React from 'react'
import { chatStore } from '../store/useChatStore'
import { useShallow } from 'zustand/shallow'

type TextBlockProps = {
  senderUsername: string
}

const TextBlock = ({senderUsername}: TextBlockProps) => {
  const { selectedUser, getMessages } = chatStore(useShallow((state) => ({
    selectedUser: state.selectedUser,
    getMessages: state.getMessages
  })))

  return (
    <>
      <div className={`h-16 w-fit flex flex-col justify-between gap-2 px-3 py-2  ${senderUsername === selectedUser?.username? "bg-emerald-400": "bg-[#1E2229]"}  rounded-xl`}>
        <p className={`text-md ${senderUsername === selectedUser?.username? "text-white": "text-black"}`}>Are you there?</p>
        <p className='text-xs text-gray-400'>14/01/05</p>
      </div>
      <div className={`h-16 w-fit flex flex-col justify-between gap-2 px-3 py-2  ${senderUsername === selectedUser?.username? "bg-emerald-400": "bg-[#1E2229]"}  rounded-xl`}>
        <p className={`text-md ${senderUsername === selectedUser?.username? "text-white": "text-black"}`}>Are you there?</p>
        <p className='text-xs text-gray-400'>14/01/05</p>
      </div>
      <div className={`h-16 w-fit flex flex-col justify-between gap-2 px-3 py-2  ${senderUsername === selectedUser?.username? "bg-emerald-400": "bg-[#1E2229]"}  rounded-xl`}>
        <p className={`text-md ${senderUsername === selectedUser?.username? "text-white": "text-black"}`}>Are you there?</p>
        <p className='text-xs text-gray-400'>14/01/05</p>
      </div>
      <div className={`h-16 w-fit flex flex-col justify-between gap-2 px-3 py-2  ${senderUsername === selectedUser?.username? "bg-emerald-400": "bg-[#1E2229]"}  rounded-xl`}>
        <p className={`text-md ${senderUsername === selectedUser?.username? "text-white": "text-black"}`}>Are you there?</p>
        <p className='text-xs text-gray-400'>14/01/05</p>
      </div>
    </>
  )
}

export default TextBlock
