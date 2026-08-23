import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentLogin from './pages/StudentLogin'
import StudentWaitingRoom from './pages/StudentWaitingRoom'

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<StudentLogin />} />
        <Route path="/waiting-room" element={<StudentWaitingRoom />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
