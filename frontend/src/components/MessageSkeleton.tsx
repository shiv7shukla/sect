import React from 'react'
import { Skeleton } from './ui/skeleton'

const MessageSkeleton = () => {
  return (
    <div className='h-screen w-full bg-[#0C0E12] flex flex-col gap-2 px-6 py-4'>
      {(Array.from({length: 9}).map((_, i) => (
        <div key = {i} className={`flex w-full max-w-xs flex-col gap-2 ${i%2==0? "self-start": "self-end" }`}>
          <Skeleton className="h-4 w-full bg-gray-800" />
          <Skeleton className="h-4 w-full bg-gray-800" />
          <Skeleton className={`h-4 w-3/4 bg-gray-800 ${i%2==0?"self-start": "self-end"}`} />
        </div>
      )))}
    </div>
  )
}

export default MessageSkeleton
