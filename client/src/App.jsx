import { Routes, Route, useLocation } from 'react-router-dom'
import SignInPage from './pages/sign-in/SignInPage'
import SignUpPage from './pages/sign-up/SignUpPage'
import { Toaster } from 'react-hot-toast'
import Navbar from '../src/components/Layout/Navbar'
import { useEffect } from 'react'
import useAuthStore from './store/Auth'
import CreateRoom from './components/Layout/CreateRoom'
import RoomPage from './pages/rooms/RoomPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import HomePage from './pages/home/HomePage'
import useSocketStore from './store/Socket'

function App() {
  const { getUserDetails } = useAuthStore();
  const { socket } = useSocketStore();
  const location = useLocation();

  // Map of routes and their corresponding page titles
  const pageTitles = {
    '/': 'Home - SyncWave',
    '/sign-in': 'Sign In - SyncWave',
    '/sign-up': 'Sign Up - SyncWave',
    '/rooms': 'Room - SyncWave',
    '/dashboard': 'Dashboard - SyncWave',
  };

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  useEffect(() => {
    if (socket && !location.pathname.includes('rooms')) {
      socket.disconnect();
    }
  }, [socket, location]);

  useEffect(() => {
    // Dynamically set the page title based on the current path
    const path = location.pathname.split('/')[1];
    document.title = pageTitles[`/${path}`] || 'SyncWave';
  }, [location]);

  return (
    <div className="">
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/rooms/:roomId' element={<RoomPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
      </Routes>
      <CreateRoom />
    </div>
  );
}

export default App;
