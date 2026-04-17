import React from 'react'
import { Search, X } from 'lucide-react'
import useDebounce from '../hooks/useDebounce';
import { chatStore, type SelectedUser } from '../store/useChatStore';
import { useShallow } from 'zustand/shallow';

const UsersListComponent = React.lazy(() => import("./UsersList"));
type SearchModalProps = {showModal: boolean; onClose: () => void}

const SearchModal = ({showModal, onClose}: SearchModalProps) => {
  const [inputVal, setInputVal] = React.useState("");
  const debouncedVal = useDebounce(inputVal, 300);
  const {
    searchUsers,
    setSelectedUser, 
    getMessages, 
    queriedUsers
  } = chatStore(
    useShallow((state) => ({
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
    if (!showModal){
      chatStore.setState({queriedUsers: []});
      return;
    } 
    const handleEscape = (e: KeyboardEvent) => {if (e.key === "Escape") closeAndReset()};
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal, closeAndReset]);

  React.useEffect(() => {
    const controller = new AbortController();
    if ((debouncedVal.trim()).length > 1) searchUsers(debouncedVal.trim(), controller.signal);
    else chatStore.setState({queriedUsers: []});
    return (() => controller.abort())
  }, [debouncedVal, searchUsers]);

  return !showModal ? null : (
    <div 
      onClick={closeAndReset}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="h-80 sm:h-96 w-full flex flex-col justify-between gap-2 bg-[#111318] border border-zinc-800 rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md"
      >
        <div>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-white text-base sm:text-lg font-semibold">Search Contacts</h2>
            <button 
              type="button" 
              onClick={closeAndReset}
              className="text-gray-400 hover:text-white p-1"
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
              className="w-full bg-[#171A21] border-2 border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-white text-sm sm:text-base placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start gap-2 text-center px-2 sm:px-6 overflow-y-auto mb-3">
          {debouncedVal.trim().length > 0 && queriedUsers.length > 0?
            <React.Suspense fallback={<div className="text-muted-foreground text-sm">Loading...</div>}>
              {queriedUsers
              .map((q) =>
                <div 
                  key={q._id} 
                  className="w-full flex flex-col items-center justify-evenly gap-2 text-center px-6 mt-3 mb-3">
                  <UsersListComponent 
                    queriedUser={q}
                    onSelect={queriedUserClick}
                  />
              </div>
                )}
            </React.Suspense>
            :            
          <div className="flex flex-col items-center justify-evenly gap-2 text-center px-2 sm:px-6 mt-3 mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/75 border border-border/50 flex items-center justify-center mb-2 sm:mb-3">
              <Search className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground/80" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Find people on sect</p>
            <p className="text-xs text-muted-foreground/60">Type a username to discover users</p>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default SearchModal