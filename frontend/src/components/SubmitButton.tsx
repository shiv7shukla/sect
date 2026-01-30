import React from 'react';
import { Spinner } from './ui/spinner';

interface SubmitButtonProps {
  isSubmitting: boolean;
  loadingText: string;
  submitText: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, loadingText, submitText }) => (
  <div className='flex flex-col mt-6'>
    <button 
      className='text-xl text-black font-black bg-emerald-500 hover:bg-emerald-400 px-[30%] py-[2.75%] rounded-xl' 
      type="submit" 
      disabled={isSubmitting}
    >
      {isSubmitting ? (<><Spinner /> {loadingText}</>) : submitText}
    </button>
  </div>
);

export default SubmitButton;