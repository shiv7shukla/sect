import React from 'react'
import {z} from "zod"

const AuthForm = () => {

  const signUpSchema=z.object({
  email: z.string().trim().min(1, "Email is required").email({ message: "Email is invalid" }),
  password: z.string().trim().min(1, "Password is required").min(6, { message: "Password must be at least 6 characters" }).max(12, { message: "Password cannot exceed 12 characters" }),
  username: z.string().trim().min(6, { message: "Username must be at least 6 characters" }).max(12, { message: "Username cannot exceed 12 characters" }).regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only have letters, numbers and underscores" })
});

  return (
    <>
    <form>
    </form>
    </>
  )
}

export default AuthForm
