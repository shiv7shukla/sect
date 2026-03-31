import React from 'react'
import { Skeleton } from './ui/skeleton'

const AvatarSkeleton = () => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
      <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-800 flex-shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <Skeleton className="h-4 w-full max-w-[240px] bg-gray-800" />
        <Skeleton className="h-4 w-full max-w-[240px] bg-gray-800" />
      </div>
    </div>
  )
}

export default AvatarSkeleton
