import React from 'react'
import { Skeleton } from './ui/skeleton'

const AvatarSkeleton = () => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="h-12 w-12 rounded-full bg-gray-800" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-60 bg-gray-800" />
        <Skeleton className="h-4 w-60 bg-gray-800" />
      </div>
    </div>
  )
}

export default AvatarSkeleton
