import React from 'react'
import { User } from 'lucide-react'
import { type SelectedUser } from '../store/useChatStore';

type UsersListProps = {
    queriedUser: SelectedUser;
    onSelect: (q: SelectedUser) => void;
}

const ConversationList = React.memo(({queriedUser, onSelect}: UsersListProps) => {

    const handleClick = React.useCallback(() => {
        onSelect(queriedUser);
    }, [onSelect, queriedUser]);

    return (
        <button
        type="button"
        onClick={handleClick}
        className={`h-16 sm:h-20 lg:h-24 w-full flex items-center gap-2 rounded-xl mb-1 sm:mb-2 bg-transparent transition-colors duration-200 hover:bg-[#171A21] px-2 hover:cursor-pointer`}
        >
        <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#171A21] relative flex-shrink-0'>
            <User className='text-white absolute right-2.5 top-2.5 sm:right-3 sm:top-3' size={20} />
        </div>
        <div className='flex-1 min-w-0 bg-transparent flex flex-col justify-start'>
            <div className='w-full text-white text-sm sm:text-base truncate'>
            {queriedUser.username}
            </div>
        </div>
        </button>
    );
});

export default ConversationList;