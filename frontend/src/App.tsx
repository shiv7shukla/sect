import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Navbar from './components/Navbar'
import UserProfile from './pages/UserProfile'
import { useShallow } from 'zustand/shallow'
import { authStore } from './store/useAuthStore'
import AuthForm from './components/AuthForm'

const App = () => {
  const {authUser, ischeckingAuth, checkAuth}=authStore(useShallow((state)=>({
    authUser:state.authUser, ischeckingAuth:state.isCheckingAuth, checkAuth:state.checkAuth
  })));

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={authUser?<HomePage />:<Navigate to="/signin"/>} /> */}
        <Route path="/" element={<AuthForm />} />
        <Route path="/signup" element={!authUser?<SignUp />:<Navigate to="/"/>} />
        <Route path="/signin" element={!authUser?<SignIn />:<Navigate to="/"/>} />
        <Route path="/profile" element={!authUser?<UserProfile />:<Navigate to="/signin"/>} />
      </Routes>
    </>
  )
}

export default App
