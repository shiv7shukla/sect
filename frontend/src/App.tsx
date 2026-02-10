import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import UserProfile from './pages/UserProfile'
import { useShallow } from 'zustand/shallow'
import { authStore } from './store/useAuthStore'
import AuthForm from './components/AuthForm'
import AuthPage from './pages/AuthPage'
import { Toaster } from "./components/ui/sonner";
import Chats from './pages/Chats'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'

const App = () => {
  const {authUser, checkAuth}=authStore(useShallow((state)=>({
    authUser:state.authUser, checkAuth:state.checkAuth
  })));

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={authUser?<HomePage />:<Navigate to="/signin"/>} /> */}
        <Route path="/" element={<Chats />} />
        <Route path="/profile" element={!authUser?<UserProfile />:<Navigate to="/signin"/>} />
        {/* <Route path="/chat" element={<Chats />} /> */}
      </Routes>
      <Toaster /> 
      {/* add toaster here so it can appear anywhere you want */}
    </>
  )
}

export default App
