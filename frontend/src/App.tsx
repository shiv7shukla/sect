import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { authStore } from './store/useAuthStore'
import AuthPage from './pages/AuthPage'
import { Toaster } from "./components/ui/sonner";
import LandingPage from './pages/LandingPage'
import { Spinner } from './components/ui/spinner'
import { registerSocketListeners } from './lib/socketEvents'

const NotFoundComponent = React.lazy(() => import("./pages/NotFound"));
const ChatsComponent = React.lazy(() => import("./pages/Chats"));

const App = () => {
  const {
    authUser, 
    checkAuth, 
    status
  } = authStore(
    useShallow((state)=>({
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

  return (
    <>
    <React.Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/authenticate" element={status === "checking"? null : !authUser ? <AuthPage /> : <Navigate replace to="/" />} />
          <Route path="/chats" element={status === "checking"? null : authUser ? <ChatsComponent /> : <Navigate replace to="/authenticate" />} />
          <Route path="*" element={<NotFoundComponent />} />
        </Routes>
        <Toaster />
    </React.Suspense>
    </>
  )
}

export default App
