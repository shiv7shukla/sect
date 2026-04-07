import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useShallow } from 'zustand/shallow'
import { authStore } from './store/useAuthStore'
import AuthPage from './pages/AuthPage'
import { Toaster } from "./components/ui/sonner";
import Chats from './pages/Chats'
import { Spinner } from './components/ui/spinner'
import { registerSocketListeners } from './lib/socketEvents'
import Index from './pages/Index'

const App = () => {
  const { authUser, checkAuth, status } = authStore(useShallow((state)=>({
    authUser: state.authUser, 
    checkAuth: state.checkAuth,
    status: state.status
  })));

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (!authUser?._id) return;
    registerSocketListeners();
  }, [authUser]);

  if (status == "checking") return <Spinner />

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={ <Index />} />
        <Route path="/authenticate" element={!authUser? <AuthPage />: <Navigate to="/chats" />} />
        <Route path="/chats" element={authUser? <Chats />: <Navigate to="/authenticate"/>} />
        {/* <Route path="/chat" element={<Chats />} /> */}
      </Routes>
      <Toaster /> 
      {/* add toaster here so it can appear anywhere you want */}
    </>
  )
}

export default App
