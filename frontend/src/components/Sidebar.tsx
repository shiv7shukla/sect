import { Check, Copy, LogOut, Plus, Search, Shield } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { authStore } from '../store/useAuthStore'
import { useShallow } from 'zustand/shallow'
import { chatStore } from '../store/useChatStore'
import AvatarSkeleton from './AvatarSkeleton'
import ConversationList from './ConversationList'

const Sidebar = () => {
  const onlineUsers = []
  const [isCopied, setIsCopied] = useState(false)
  const { logout, authUser } = authStore(useShallow((state) => ({
    logout: state.logout,
    authUser: state.authUser,
  })))
  const { conversations, getConversations, setSelectedUser, isConversationsLoading } = chatStore(useShallow((state) => ({
    conversations: state.conversations,
    getConversations: state.getConversations,
    setSelectedUser: state.setSelectedUser,
    isConversationsLoading: state.isConversationsLoading,
  })))
  const handleCopy = async () => {
    if (!authUser?._id) return
    try {
      await navigator.clipboard.writeText(authUser._id)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy UUID', err)
    }
  }

  useEffect(() => { getConversations() }, [getConversations])

  return (
    <>
      <div className='h-screen w-[22vw] bg-[#111318] p-4 border-r-2 border-r-zinc-800'>
        <div className='flex justify-between items-start'>
          <div className='flex gap-4 mt-2 mb-6'>
            <div className='h-9 w-9 bg-[#112625] border-solid border-2 border-emerald-800 corner-squircle rounded-full flex items-center justify-center'>
                <Shield className='h-5 w-5 text-[#12BE85]' strokeWidth={2} />
            </div>
            <div className='h-8 flex flex-col items-start justify-end'>
              <div className='text-emerald-400 text-xl font-semibold'>sect</div>
              <div className='text-slate-500 text-xs'>Secure Terminal</div>
            </div>
          </div>
          <button onClick={logout} aria-label='logout' className='group p-2 hover:bg-[#171A21] rounded-md'>
            <LogOut className='text-white opacity-50 group-hover:text-white group-hover:opacity-100' />
          </button>
        </div>
        <div className='bg-[#171A21] h-[10vh] w-[20vw] rounded-lg border-zinc-800 border-2 mb-4 py-2 px-3'>
            <div className='text-slate-500 text-xs font-semibold'>Your UUID</div>
            <div className='flex justify-between items-center text-zinc-200 text-xs'>
              <div>
                {"hello world"}
              </div>
              <button onClick={handleCopy} disabled={!authUser?._id} aria-label={isCopied ? 'copied' : 'copy'} className='group p-2 hover:bg-[#1F2329] rounded-md cursor-pointer'>
                {isCopied ? (<Check className='h-4 w-4 text-emerald-600' />) : (<Copy className='h-4 w-4 text-white opacity-50 group-hover:text-emerald-600 group-hover:opacity-100' />)}
              </button>
            </div>
        </div>
        <hr className="-mx-4 border-t border-zinc-800 my-4" />
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full bg-[#171A21] border-2 border-zinc-800 rounded-xl py-2 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>
        <hr className="-mx-4 border-t border-zinc-800 my-4" />
        <div className='h-96 overflow-y-auto'>
          {/* {isConversationsLoading ? 
            (Array.from({length: 6})
              .map((_, i) => 
                (<AvatarSkeleton key = {i} />))) : 
                (conversations.map((c) => 
                  <ConversationList
                    onClick = {() => setSelectedUser({
                      conversationId: c.conversationId, 
                      id: c.participant.id, 
                      username: c.participant.username
                    })}
                    key = {c.conversationId} 
                    lastMessagePreview = {c.lastMessagePreview} 
                    lastMessageAt = {c.lastMessageAt} 
                    username = {c.participant.username} 
                  />))} */}
          {/* <ConversationList  /> */}
        </div>
        <hr className="-mx-4 mt-4 border-t border-zinc-800 my-4" />
          <button className='h-[5vh] w-full bg-[#171A21] flex gap-2 justify-center items-center border-2 border-zinc-800 focus:outline-none hover:border-emerald-400 transition-colors rounded-xl'>
            <Plus className='text-white size-4' />
            <div className='text-white text-sm'>Add Contact by UUID</div>
          </button>
      </div>
    </>
  )
}

export default Sidebar