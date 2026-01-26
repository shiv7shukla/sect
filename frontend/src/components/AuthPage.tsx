// import React from 'react'
// import { authStore } from '../store/useAuthStore'
// import { useShallow } from 'zustand/shallow'
// import { ArrowLeft, Shield } from 'lucide-react'
// import AuthForm from './AuthForm'

// const AuthPage = () => {
//   const {mode, setMode}=authStore(useShallow((state)=>({
//     mode:state.mode,
//     setMode:state.setMode
//   })))
//   return (
//     <div className='h-screen w-screen bg-black px-[25%] py-[3%] flex flex-col justify-start align-center'>
//       <div className='h-[90vh] text-white px-[10%] py-[6%] bg-[#18181B] rounded-xl'>
//         <div className='w-[57%] flex justify-between mb-4'>
//           <button className='opacity-60 hover:opacity-100' onClick={() => window.history.back()}>
//             <ArrowLeft />
//           </button>
//           <div>
//             <Shield className='text-green-700' size={80} />
//           </div>
//         </div>
//         <div className='flex flex-col'>
//           <h1 className='place-self-center text-3xl font-extrabold'>
//             {mode==="signIn"?"Authenticate your Identity":"Generate a New Identity"}
//           </h1>
//           <p className='place-self-center text-gray-500'>
//             {mode==="signIn"?"Enter your credentials to decrypt your session.":"Create a secure vault for your communications."}
//           </p>
//         </div>
//         <AuthForm />
//       </div>
//     </div>
//   )
// }

// export default AuthPage

import React from 'react'
import { authStore } from '../store/useAuthStore'
import { useShallow } from 'zustand/react/shallow'
import { ArrowLeft, Shield } from 'lucide-react'
import AuthForm from './AuthForm'

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
  const { mode } = authStore(useShallow((state) => ({
    mode: state.mode
  })));

  const textContent = AUTH_TEXT[mode];

  return (
    <div className='h-screen w-screen bg-[black] px-[25%] py-[3%] flex flex-col justify-start align-center'>
      <div className='h-[90vh] text-white px-[10%] py-[6%] bg-[#18181B] rounded-xl'>
        <div className='w-[57%] flex justify-between mb-4'>
          <button 
            className='opacity-60 hover:opacity-100' 
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowLeft />
          </button>
          <div className='h-24 w-24 h- bg-[#27272A] rounded-full relative'>
            <Shield className='text-green-700 absolute left-2 top-2' size={80} />
          </div>
        </div>
        
        <div className='flex flex-col'>
          <h1 className='place-self-center text-3xl font-extrabold'>
            {textContent.heading}
          </h1>
          <p className='place-self-center text-gray-500'>
            {textContent.description}
          </p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;