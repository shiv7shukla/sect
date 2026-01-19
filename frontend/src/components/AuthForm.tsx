import React from 'react'
import {z} from "zod"

const AuthForm = () => {

  const signUpSchema=z.object({
    email:z.string().trim().nonempty("Email is required").email({message:"Email is invalid"}).,
    password:z.string().trim().nonempty("Password is required").min(6, {message:"Password must be astleast 6 charcters"}).max(12, {message:"Password cannot exceed 12 charcters"}).,
    username:z.string().trim().min(6, {message:"Username must be astleast 6 charcters"}).max(12, {message:"Username cannot exceed 12 charcters"}).regex(/^[a-zA-Z0-9_]+$/,{message:"Username can only have letters, numbers and underscores"})
  })

  return (
    <>
    <form>
    </form>
    </>
  )
}

export default AuthForm
