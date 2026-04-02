import { Shield } from 'lucide-react';

const ChatArea = () => {
  return (
    <div className='h-screen w-full bg-[#0C0E12] flex flex-col justify-center items-center px-4 sm:px-6'>
      <div className='h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 mb-4 sm:mb-6 animate-float border-solid border-2 border-emerald-900 rounded-full corner-squircle flex items-center justify-center relative bg-[#12151A]'>
        <div className='absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]'></div>
        <Shield className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-700' strokeWidth={2} />
      </div>
      <div className='text-slate-300 text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-4 text-center'>Select a Conversation</div>
      <div className='text-slate-400 text-xs sm:text-sm text-center max-w-xs sm:max-w-sm lg:max-w-md'>
        Choose a contact from the sidebar or add a new one using their UUID to start a secure conversation.
      </div>
    </div>
  )
}

export default ChatArea
