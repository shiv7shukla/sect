import React from 'react';
import { Spinner } from './ui/spinner';

interface SubmitButtonProps {
  isSubmitting: boolean;
  loadingText: string;
  submitText: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, loadingText, submitText }) => (
  <div className='flex flex-col mt-4 sm:mt-6'>
    <button 
      className='flex items-center justify-center text-base sm:text-lg lg:text-xl text-black font-black bg-emerald-500 hover:bg-emerald-400 px-6 sm:px-[20%] lg:px-[30%] py-2.5 sm:py-3 rounded-xl w-full sm:w-auto transition-colors' 
      type="submit" 
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Spinner className="mr-2" />
          {loadingText}
        </>
      ) : submitText}
    </button>
  </div>
);

export default SubmitButton;