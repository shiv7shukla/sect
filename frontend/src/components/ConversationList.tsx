import { User } from 'lucide-react'
import { chatStore } from '../store/useChatStore';

type ConversationListProps = {
  userId: string,
  username: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  onClick: () => Promise<void> | void;
}

const ConversationList = ({userId, username, lastMessagePreview, lastMessageAt, onClick}: ConversationListProps) => {
  const selectedUserId = chatStore((state) => (state.selectedUser?._id));
  const isSelected = selectedUserId === userId;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`h-16 sm:h-20 lg:h-24 w-full flex items-center gap-2 rounded-xl mb-1 sm:mb-2 bg-transparent transition-colors duration-200 hover:bg-[#171A21] px-2 hover:cursor-pointer ${isSelected? 
        "border-l-2 border-l-emerald-400" : 
        "border-l-transparent"}`}
        >
        <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#171A21] relative flex-shrink-0'>
          <User className='text-white absolute right-2.5 top-2.5 sm:right-3 sm:top-3' size={20} />
        </div>
        <div className='flex-1 min-w-0 bg-transparent flex flex-col justify-start'>
          <div className='w-full text-white text-sm sm:text-base truncate'>{username}</div>
          <div className='w-full text-slate-500 text-xs sm:text-sm truncate'>
            <div className='truncate'>{(lastMessagePreview)?.trim() || "No messages yet"}</div>
            <div>{lastMessageAt}</div>
          </div>
        </div>
      </button>    
    </>
  )
}

export default ConversationList