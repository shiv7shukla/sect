import React from 'react'
import {useForm} from "react-hook-form"
import type { SubmitHandler } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { authStore } from '../store/useAuthStore';
import { useShallow } from 'zustand/react/shallow'
import { signInSchema, signUpSchema, type SignInData, type SignUpData } from '../lib/auth.schema'
import FormField from './FormField'
import SubmitButton from './SubmitButton'

const signInFields = [
  { name: 'username' as const, label: 'Username', type: 'text', placeholder: 'Username' },
  { name: 'password' as const, label: 'Password', type: 'password', placeholder: 'Password' }
] as const;

const signUpFields = [
  { name: 'email' as const, label: 'Email', type: 'text', placeholder: 'Email' },
  { name: 'username' as const, label: 'Username', type: 'text', placeholder: 'Username' },
  { name: 'password' as const, label: 'Password', type: 'password', placeholder: 'Password' }
] as const;

const AuthForm: React.FC = () => {
  const signInForm = useForm<SignInData>({
    defaultValues: { username: "", password: "" }, 
    resolver: zodResolver(signInSchema), 
    mode: "onSubmit"
  });
  
  const signUpForm = useForm<SignUpData>({
    defaultValues: { email: "", username: "", password: "" }, 
    resolver: zodResolver(signUpSchema), 
    mode: "onSubmit"
  });

  const { signup, signin, mode, setMode, isSigningUp, isSigningIn, clearError } = authStore(
    useShallow((state) => ({
      signup: state.signup,
      signin: state.signin,
      mode: state.mode,
      setMode: state.setMode,
      isSigningUp: state.isSigningUp,
      isSigningIn: state.isSigningIn,
      clearError: state.clearError
    }))
  );

  const onSubmitSignIn: SubmitHandler<SignInData> = async (data) => {
    await signin(data);
    signInForm.reset();
  };

  const onSubmitSignUp: SubmitHandler<SignUpData> = async (data) => {
    await signup(data);
    signUpForm.reset();
  };

  const isSignIn = mode === "signIn";
  const currentForm = isSignIn ? signInForm : signUpForm;
  const currentFields = isSignIn ? signInFields : signUpFields;
  const onSubmit: SubmitHandler<SignInData | SignUpData> = async (data) => {
  if (isSignIn) await onSubmitSignIn(data as SignInData);
  else await onSubmitSignUp(data as SignUpData);
  };

  const isLoading = isSignIn ? isSigningIn : isSigningUp;
  
  const { register, handleSubmit, formState: { errors, isSubmitting, touchedFields } } = currentForm;

  return (
    <div className={isSignIn ? '' : ''}>
      <form key={`${mode}-form`} onSubmit={handleSubmit(onSubmit)}>
        {currentFields.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            register={register as any}
            errors={errors}
            touched={!!touchedFields[field.name]}
          />
        ))}
        
        <SubmitButton
          isSubmitting={isSubmitting || isLoading}
          loadingText={isSignIn ? "Accessing" : "Initializing Account"}
          submitText={isSignIn ? "Access Terminal" : "Initialize Account"}
        />
        
        <div className={`flex justify-center ${isSignIn ? 'mt-8' : 'mt-4'}`}>
          {isSignIn && <p>Need a secure line?</p>}
          <button 
            className={`text-green-500 ${isSignIn ? 'underline' : ''}`}
            type="button" 
            onClick={() => {
              setMode(isSignIn ? "signUp" : "signIn");
              clearError();
            }}
          >
            {isSignIn ? "Generate new Identity" : "Already have an Identity?"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;