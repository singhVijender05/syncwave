import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import Room from './pages/Room'
import Dashboard from './pages/Dashboard'
import SignUp from './components/Auth/Signup'
import OAuthCallback from './components/Auth/OAuthCallback'
function App() {
  
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/oauth/callback" element={<OAuthCallback/>} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/room' element={<Room />} />
        </Routes>
    </div>
  )
}

export default App
