import React from 'react'
import { useShallow } from 'zustand/shallow'
import { authStore } from '../store/useAuthStore'

type TextBlockProps = {
  text: string,
  createdAt: string,
  senderUsername: string,
}

const TextBlock = ({text, createdAt, senderUsername}: TextBlockProps) => {
  const { authUser } = authStore(useShallow((state) => ({
    authUser: state.authUser
  })))

  return (
    <>
      <div className={`h-16 w-fit flex flex-col justify-between gap-2 px-3 py-2  ${senderUsername === authUser?.username? "bg-emerald-400": "bg-[#1E2229]"}  rounded-xl`}>
        <p className={`text-md ${senderUsername !== authUser?.username? "text-white": "text-black"}`}>{text}</p>
        <time className='text-xs text-gray-400'>{createdAt}</time>
      </div>
    </>
  )
}

export default TextBlock
