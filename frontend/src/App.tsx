import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Navbar from './components/Navbar'
import UserProfile from './pages/UserProfile'
import { useShallow } from 'zustand/shallow'
import { authStore } from './store/useAuthStore'
import AuthForm from './components/AuthForm'
import AuthPage from './components/AuthPage'

const App = () => {
  const {authUser, status, checkAuth}=authStore(useShallow((state)=>({
    authUser:state.authUser, status:state.status, checkAuth:state.checkAuth
  })));

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={authUser?<HomePage />:<Navigate to="/signin"/>} /> */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={!authUser?<SignUp />:<Navigate to="/"/>} />
        <Route path="/signin" element={!authUser?<SignIn />:<Navigate to="/"/>} />
        <Route path="/profile" element={!authUser?<UserProfile />:<Navigate to="/signin"/>} />
      </Routes>
    </>
  )
}

export default App
