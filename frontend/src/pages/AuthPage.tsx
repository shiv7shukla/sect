import React, { useEffect } from 'react';
import { authStore } from '../store/useAuthStore';
import { useShallow } from 'zustand/react/shallow'
import { ArrowLeft, Shield } from 'lucide-react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

const AUTH_TEXT = {
  signIn: {
    heading: "Authenticate your Identity",
    description: "Enter your credentials to decrypt your session."
  },
  signUp: {
    heading: "Generate a New Identity",
    description: "Create a secure vault for your communications."
  }
} as const;

const AuthPage = () => {
  const { mode, authUser } = authStore(useShallow((state) => ({
    mode: state.mode,
    authUser:state.authUser
  })));

  const textContent = AUTH_TEXT[mode];
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser !== null) navigate("/chat", {replace: true});
  }, [authUser]);

  return (
    <div className='min-h-screen w-screen bg-black px-4 sm:px-8 md:px-[15%] lg:px-[20%] xl:px-[25%] py-4 sm:py-6 lg:py-[3%] flex flex-col justify-start items-center'>
      <div className='w-full max-w-2xl text-white px-4 sm:px-8 md:px-[8%] lg:px-[10%] py-6 sm:py-8 lg:py-[6%] bg-[#18181B] rounded-xl'>
        <div className='flex items-center justify-between sm:justify-start sm:gap-8 md:gap-12 mb-4'>
          <button 
            className='opacity-60 hover:opacity-100' 
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className='w-5 sm:hidden' aria-hidden="true" />
        </div>
        
        <div className='flex flex-col'>
          <h1 className='place-self-center text-xl sm:text-2xl lg:text-3xl font-extrabold text-center'>
            {textContent.heading}
          </h1>
          <p className='place-self-center text-gray-500 text-sm sm:text-base text-center mt-1'>
            {textContent.description}
          </p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;