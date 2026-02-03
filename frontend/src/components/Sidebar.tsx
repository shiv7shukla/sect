import { LogOut, Plus, Search, Shield } from 'lucide-react'
import React from 'react'
import { authStore } from '../store/useAuthStore'

const Sidebar = () => {
  const logout=authStore((state)=>state.logout)

  return (
    <>
      <div className='h-screen w-[22vw] bg-[#111318] p-4'>
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
          <button onClick={logout} aria-label='logout' className='group p-2 hover:bg-[#171A21] rounded-md cursor-pointer'>
            <LogOut className='text-white opacity-50 group-hover:text-white group-hover:opacity-100' />
          </button>
        </div>
        <div className='bg-[#171A21] h-[10vh] w-[20vw] rounded-lg border-zinc-800 border-2 mb-4'>
          <div className='flex flex-col items-start justify-end gap-2 py-2 px-3'>
            <div className='text-slate-500 text-xs font-semibold'>Your UUID</div>
            <div className='text-zinc-200 text-xs'>{}</div>
          </div>
        </div>
        <hr className="-mx-4 border-t border-zinc-800 my-4" />
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full bg-[#171A21] border-2 border-zinc-800 rounded-xl py-2 pl-12 pr-4 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>
        <hr className="-mx-4 border-t border-zinc-800 my-4" />
        <div className='h-96'></div>
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
