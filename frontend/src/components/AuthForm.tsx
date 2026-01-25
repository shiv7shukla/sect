import React from 'react'
import {z} from "zod"
import {useForm} from "react-hook-form"
import type { SubmitHandler } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { authStore } from '../store/useAuthStore';
import { useShallow } from 'zustand/react/shallow'

const signUpSchema=z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email({ message: "Email is invalid" }),
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(6, { message: "Password must be at least 6 characters" })
    .max(12, { message: "Password cannot exceed 12 characters" }),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(6, { message: "Username must be at least 6 characters" })
    .max(12, { message: "Username cannot exceed 12 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only have letters, numbers and underscores" })
});

const signInSchema=z.object({
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .min(6, { message: "Password must be at least 6 characters" })
      .max(12, { message: "Password cannot exceed 12 characters" }),
    username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .min(6, { message: "Username must be at least 6 characters" })
      .max(12, { message: "Username cannot exceed 12 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only have letters, numbers and underscores" })
});

type SignUpData=z.infer<typeof signUpSchema>;
type SignInData=z.infer<typeof signInSchema>;
type AuthFormProps={mode:"signIn"|"signUp";onModeChange: (mode: "signIn" | "signUp") => void;};

const AuthForm:React.FC<AuthFormProps>=({mode, onModeChange})=> {
  const signInForm=useForm<SignInData>({defaultValues:{username:"", password:""}, resolver:zodResolver(signInSchema), mode: "onSubmit",});
  const signUpForm=useForm<SignUpData>({defaultValues:{email:"", username:"", password:""}, resolver:zodResolver(signUpSchema), mode: "onSubmit",});
  const {signup, signin, isSigningUp, isSigningIn, error}=authStore(useShallow((state)=>({
    signup:state.signup,
    signin:state.signin,
    isSigningUp:state.isSigningUp,
    isSigningIn:state.isSigningIn,
    error:state.error,
  })));
  const onSubmitSignIn:SubmitHandler<SignInData>=async(data)=>{await signin(data); signInForm.reset();};
  const onSubmitSignUp:SubmitHandler<SignUpData>=async(data)=>{await signup(data); signUpForm.reset();};

  if(mode==="signIn"){
    const {register, handleSubmit, formState:{errors, isSubmitting, touchedFields}}=signInForm;
    return(
      <form key="signin-form" onSubmit={handleSubmit(onSubmitSignIn)}>
        <div>
          <label>Username</label>
          <input placeholder="Username" type="text" {...register("username")}></input>
          {touchedFields.username && errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div>
          <label>Password</label>
          <input placeholder="Password" type="password" {...register("password")}></input>
          {touchedFields.password && errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          {error&&<p className='text-red-500'>{error}</p>}
        </div>
        <div>
          <button className='bg-green-900' type="submit" disabled={isSubmitting}>
            {isSubmitting || isSigningIn ?"Submitting":"Submit"}
          </button>
        </div>
        <div>
          <button className='text-green-700' type="button" onClick={()=>onModeChange("signUp")}>Generate new Identity</button>
        </div>
      </form>
    )
  }

  const {register, handleSubmit, formState:{errors, isSubmitting, touchedFields}}=signUpForm;
  return (
    <form key="signup-form" onSubmit={handleSubmit(onSubmitSignUp)}>
      <div>
        <label>Email</label>
        <input placeholder="Email" type="text" {...register("email")}></input>
        {touchedFields.email && errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
      </div>
      <div>
        <label>Username</label>
        <input placeholder="Username" type="text" {...register("username")}></input>
        {touchedFields.username && errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
      </div>
      <div>
        <label>Password</label>
        <input placeholder="Password" type="password" {...register("password")}></input>
        {touchedFields.password && errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        {error&&<p className='text-red-500'>{error}</p>}
      </div>
      <div>
        <button className='bg-green-600' type="submit" disabled={isSubmitting}>
          {isSubmitting || isSigningUp ?"Submitting":"Submit"}
        </button>
      </div>
      <div>
          <button className='text-green-700' type="button" onClick={()=>onModeChange("signIn")}>Already have an Identity?</button>
      </div>
    </form>
  )
}

export default AuthForm