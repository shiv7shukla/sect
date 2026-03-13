import React from 'react'
import { Search, X } from 'lucide-react'
import useDebounce from '../hooks/useDebounce';

type SearchModalProps = { showModal: boolean; onClose: () => void }

const SearchModal = ({ showModal, onClose }: SearchModalProps) => {
  const [inputVal, setInputVal] = React.useState("");
  const debouncedVal = useDebounce(inputVal, 3000);

  if (!showModal) return null;

  function change(e: KeyboardEvent) { 
    const input = e.target as HTMLInputElement; 
    setInputVal(input.value); 
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
      className="h-96 w-full flex flex-col justify-between gap-2 bg-[#111318] border border-zinc-800 rounded-xl p-6 max-w-md mx-4">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-semibold">Search Contacts</h2>
            <button type="button" 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              onChange={(e) => change(e)}
              className="w-full bg-[#171A21] border-2 border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
              autoFocus
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-secondary/75 border border-border/50 flex items-center justify-center mb-3">
            <Search className="w-7 h-7 text-muted-foreground/80" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Find people on sect</p>
          <p className="text-xs text-muted-foreground/60">Type a username to discover users</p>
        </div>
        {/* Add search results here if needed */}
      </div>
    </div>
  )
}

export default SearchModal
