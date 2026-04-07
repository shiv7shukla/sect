import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { authStore } from './store/useAuthStore'
import AuthPage from './pages/AuthPage'
import { Toaster } from "./components/ui/sonner";
import LandingPage from './pages/LandingPage'

const NotFoundComponent = React.lazy(() => import("./pages/NotFound"));
const ChatsComponent = React.lazy(() => import("./pages/Chats"));

const App = () => {
  const { authUser, checkAuth } = authStore(useShallow((state)=>({
    authUser: state.authUser, 
    checkAuth: state.checkAuth,
  })));

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // React.useEffect(() => {
  //   if (!authUser?._id) return;
  //   registerSocketListeners();
  // }, [authUser]);

  // if (status == "checking") return <Spinner />

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/authenticate" element={!authUser ? <AuthPage /> : <Navigate replace to="/" />} />
        <Route path="/chats" element={authUser ? <ChatsComponent /> : <Navigate replace to="/authenticate" />} />
        <Route path="*" element={<NotFoundComponent />} />
      </Routes>
      <Toaster /> 
    </>
  )
}

export default App
