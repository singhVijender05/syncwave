import { Routes, Route } from 'react-router-dom'
import SignInPage from './pages/sign-in/SignInPage'
import SignUpPage from './pages/sign-up/SignUpPage'
import { Toaster } from 'react-hot-toast'
import Navbar from '../src/components/Layout/Navbar'
import { useEffect } from 'react'
import useAuthStore from './store/Auth'
import CreateRoom from './components/Layout/CreateRoom'
import RoomPage from './pages/rooms/RoomPage'
import DashboardPage from './pages/dashboard/DashboardPage'
function App() {

  const { getUserDetails } = useAuthStore();

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails])

  return (
    <div className="">
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/rooms/:roomId' element={<RoomPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
      </Routes>
      <CreateRoom />
    </div>
  )
}

export default App
