import React from 'react'
import {useForm} from "react-hook-form"
import type { SubmitHandler } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { authStore } from '../store/useAuthStore';
import { useShallow } from 'zustand/react/shallow'
import { signInSchema, signUpSchema, type SignInData, type SignUpData } from '../lib/auth.schema'

const AuthForm:React.FC=()=>{
  const signInForm=useForm<SignInData>({defaultValues:{username:"", password:""}, resolver:zodResolver(signInSchema), mode: "onSubmit",});
  const signUpForm=useForm<SignUpData>({defaultValues:{email:"", username:"", password:""}, resolver:zodResolver(signUpSchema), mode: "onSubmit",});
  const {signup, signin, mode, setMode, isSigningUp, isSigningIn, error, clearError}=authStore(useShallow((state)=>({
    signup:state.signup,
    signin:state.signin,
    mode:state.mode,
    setMode:state.setMode,
    isSigningUp:state.isSigningUp,
    isSigningIn:state.isSigningIn,
    error:state.error,
    clearError:state.clearError
  })));
  const onSubmitSignIn:SubmitHandler<SignInData>=async(data)=>{await signin(data); signInForm.reset();};
  const onSubmitSignUp:SubmitHandler<SignUpData>=async(data)=>{await signup(data); signUpForm.reset();};

  if(mode==="signIn"){
    const {register, handleSubmit, formState:{errors, isSubmitting, touchedFields}}=signInForm;
    return(
        <div className=''>
        <form key="signin-form" onSubmit={handleSubmit(onSubmitSignIn)}>
          <div className='flex flex-col gap-2 m-2'>
            <label>Username</label>
            <input className='p-3 bg-zinc-950 rounded-sm' placeholder="Username" type="text" {...register("username")}></input>
            {touchedFields.username && errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className='flex flex-col gap-2 m-2'>
            <label>Password</label>
            <input className='p-3 bg-zinc-950 rounded-sm' placeholder="Password" type="password" {...register("password")}></input>
            {touchedFields.password && errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
            {error&&<p className='text-red-500'>{error}</p>}
          </div>
          <div className='flex flex-col mt-6'>
            <button className='text-xl text-black font-black bg-emerald-500 hover:bg-emerald-400 px-[30%] py-[2.75%] rounded-xl' type="submit" disabled={isSubmitting}>
              {isSubmitting || isSigningIn ?"Accessing":"Access Terminal"}
            </button>
          </div>
          <div className='flex justify-center mt-8'>
            <p>
              Need a secure line? 
            </p>
            <button className='text-green-500 underline' type="button" onClick={()=>{setMode("signUp");clearError();}}>Generate new Identity</button>
          </div>
        </form>
      </div>
    )
  }

  const {register, handleSubmit, formState:{errors, isSubmitting, touchedFields}}=signUpForm;
  return (
    <div>
      <form key="signup-form" onSubmit={handleSubmit(onSubmitSignUp)}>
        <div className='flex flex-col gap-2 m-2'>
          <label className='block'>Email</label>
          <input className='p-3 bg-zinc-950 rounded-sm' placeholder="Email" type="text" {...register("email")}></input>
          {touchedFields.email && errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
        </div>
        <div className='flex flex-col gap-2 m-2'>
          <label className='block'>Username</label>
          <input className='p-3 bg-zinc-950 rounded-sm' placeholder="Username" type="text" {...register("username")}></input>
          {touchedFields.username && errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
        </div>
        <div className='flex flex-col gap-2 m-2'>
          <label className='block'>Password</label>
          <input className='p-3 bg-zinc-950 rounded-sm' placeholder="Password" type="password" {...register("password")}></input>
          {touchedFields.password && errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          {error&&<p className='text-red-500'>{error}</p>}
        </div>
        <div className='flex flex-col mt-6'>
          <button className='text-xl text-black font-black bg-emerald-500 hover:bg-emerald-400 px-[30%] py-[2.75%] rounded-xl' type="submit" disabled={isSubmitting}>
            {isSubmitting || isSigningUp ?"Initializing Account":"Initialize Account"}
          </button>
        </div>
        <div className='flex justify-center mt-4'>
            <button className='text-green-500' type="button" onClick={()=>{setMode("signIn");clearError();}}>Already have an Identity?</button>
        </div>
      </form>
    </div>
  )
}

export default AuthForm