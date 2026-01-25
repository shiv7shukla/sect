import React from 'react'
import { authStore } from '../store/useAuthStore'
import { useShallow } from 'zustand/shallow'
import { ArrowLeft, Shield } from 'lucide-react'
import AuthForm from './AuthForm'

const AuthPage = () => {
  const {mode, setMode}=authStore(useShallow((state)=>({
    mode:state.mode,
    setMode:state.setMode
  })))
  return (
    <div className='h-screen w-screen bg-black px-[25%] py-[3%] flex flex-col justify-start align-center'>
      <div className='h-[90vh] text-white px-[10%] py-[6%] bg-[#18181B] rounded-xl'>
        <div className='w-[57%] flex justify-between mb-4'>
          <button className='opacity-60 hover:opacity-100' onClick={() => window.history.back()}>
            <ArrowLeft />
          </button>
          <div>
            <Shield className='text-green-700' size={80} />
          </div>
        </div>
        <div className='flex flex-col'>
          <h1 className='place-self-center text-3xl font-extrabold'>
            {mode==="signIn"?"Authenticate your Identity":"Generate a New Identity"}
          </h1>
          <p className='place-self-center text-gray-500'>
            {mode==="signIn"?"Enter your credentials to decrypt your session.":"Create a secure vault for your communications."}
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}

export default AuthPage
