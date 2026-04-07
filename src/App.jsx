import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpForm from './Screens/SignUpForm'
import SignInForm from './Screens/SignInForm'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ToastContainer from './components/ToastContainer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './Screens/AdminDashboard'
import UserDashboard from './Screens/UserDashboard'
import Totaluser from './Screens/Totaluser'
import AddContest from './Screens/AddContest'
import TotalContests from './Screens/TotalContests'
import TotalTeams from './Screens/TotalTeams'
import TotalResults from './Screens/TotalResults'
import SubmitProject from './Screens/SubmitProject'
import Home from './Screens/Home'
import AboutUs from './Screens/AboutUs'
import ContestsPage from './Screens/ContestsPage'
import { useAuthContext } from './context/AuthContext'

// Smart landing: redirect logged-in users to their dashboard
function LandingRedirect() {
  const { user } = useAuthContext();
  if (!user) return <Home />;
  if (user.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="min-h-[calc(100vh-80px)] bg-[#fbfcfb]">
        <Routes>
          <Route path="/" element={<LandingRedirect />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/total-users" element={<Totaluser />} />
            <Route path="/admin-dashboard/add-contest" element={<AddContest />} />
            <Route path="/admin-dashboard/total-contests" element={<TotalContests />} />
            <Route path="/admin-dashboard/total-participants" element={<TotalTeams />} />
            <Route path="/admin-dashboard/total-results" element={<TotalResults />} />
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
