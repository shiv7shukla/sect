import React from 'react'
import { Search, X } from 'lucide-react'
import useDebounce from '../hooks/useDebounce';
import { chatStore, type SelectedUser } from '../store/useChatStore';
import { useShallow } from 'zustand/shallow';
import ConversationList from './ConversationList';

type SearchModalProps = { showModal: boolean; onClose: () => void }

const SearchModal = ({ showModal, onClose }: SearchModalProps) => {
  const [inputVal, setInputVal] = React.useState("");
  const debouncedVal = useDebounce(inputVal, 300);
  const { searchUsers, queriedUsers, getMessages, setSelectedUser } = chatStore(useShallow((state) => ({
    searchUsers: state.searchUsers,
    getMessages: state.getMessages,
    queriedUsers: state.queriedUsers,
    setSelectedUser: state.setSelectedUser
  })))
  const queriedUserClick = async(user: SelectedUser) => {
    const selected = { 
      _id: user._id, 
      username: user.username, 
      conversationId: user.conversationId ?? "" 
    };
    setSelectedUser(selected);
    await getMessages(selected);
    closeAndReset();
  }
  const clearInput = () => setInputVal("");
  const closeAndReset = React.useCallback(() => {
    clearInput();
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    if (!showModal) return;
    const handleEscape = (e: KeyboardEvent) => {if (e.key === "Escape") closeAndReset()};
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal, closeAndReset]);

  React.useEffect(() => {
    if (debouncedVal.trim()) searchUsers(debouncedVal.trim());
  }, [debouncedVal, searchUsers]);

  return !showModal ? null : (
    <div 
      onClick={closeAndReset}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="h-96 w-full flex flex-col justify-between gap-2 bg-[#111318] border border-zinc-800 rounded-xl p-6 max-w-md mx-4"
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-semibold">Search Contacts</h2>
            <button 
              type="button" 
              onClick={closeAndReset}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              autoFocus
              type="text"
              value={inputVal}
              placeholder="Search contacts..."
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-[#171A21] border-2 border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start gap-2 text-center px-6 overflow-y-auto mb-3">
          {/* {debouncedVal.trim().length > 0 && queriedUsers.length > 0? 
            (queriedUsers
              .map((q) =>
              <div className="w-full flex flex-col items-center justify-evenly gap-2 text-center px-6 mt-3 mb-3">
                <ConversationList 
                  key={q._id}
                  userId={q._id}
                  username={q.username}
                  onClick={() => queriedUserClick(q)}
                />
              </div>
                )): */}
          <div className="flex flex-col items-center justify-evenly gap-2 text-center px-6 mt-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-secondary/75 border border-border/50 flex items-center justify-center mb-3">
              <Search className="w-7 h-7 text-muted-foreground/80" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Find people on sect</p>
            <p className="text-xs text-muted-foreground/60">Type a username to discover users</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal