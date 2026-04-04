import { Routes, Route } from 'react-router-dom'
import SignUpForm from './Screens/SignUpForm'
import SignInForm from './Screens/SignInForm'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './Screens/AdminDashboard'
import UserDashboard from './Screens/UserDashboard'
import Totaluser from './Screens/Totaluser'
import AddContest from './Screens/AddContest'
import TotalContests from './Screens/TotalContests'
import TotalParticipants from './Screens/TotalParticipants'
import SubmitProject from './Screens/SubmitProject'
import Home from './Screens/Home'

function App() {
  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] bg-[#fbfcfb]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/total-users" element={<Totaluser />} />
            <Route path="/admin-dashboard/add-contest" element={<AddContest />} />
            <Route path="/admin-dashboard/total-contests" element={<TotalContests />} />
            <Route path="/admin-dashboard/total-participants" element={<TotalParticipants />} />
          </Route>

          {/* Regular User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['User']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/submit-project/:contestId" element={<SubmitProject />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
