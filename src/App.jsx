import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherLive from './pages/TeacherLive'
import StudentLogin from './pages/StudentLogin'
import StudentWaitingRoom from './pages/StudentWaitingRoom'
import StudentQuiz from './pages/StudentQuiz'
import Results from './pages/Results'

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<StudentLogin />} />
        <Route path="/waiting-room" element={<StudentWaitingRoom />} />
        <Route path="/quiz" element={<StudentQuiz />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/live" element={<TeacherLive />} />
        
        {/* Shared Routes */}
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  )
}

export default App
