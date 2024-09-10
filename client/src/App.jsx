import { Routes, Route } from 'react-router-dom'
// import Room from './pages/Room'
// import Dashboard from './pages/Dashboard'
// import SignUp from './components/Auth/Signup'
// import OAuthCallback from './components/Auth/OAuthCallback'
import SignInPage from './pages/sign-in/SignInPage'
import SignUpPage from './pages/sign-up/SignUpPage'
import { Toaster } from 'react-hot-toast'
import Navbar from '../src/components/Layout/Navbar'
import { useEffect } from 'react'
import useAuthStore from './store/Auth'
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
        {/* <Route path="/oauth/callback" element={<OAuthCallback />} /> */}
        <Route path='/sign-up' element={<SignUpPage />} />
        {/* <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/room' element={<Room />} /> */}
      </Routes>
    </div>
  )
}

export default App