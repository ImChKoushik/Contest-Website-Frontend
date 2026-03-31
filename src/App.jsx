import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthContext } from './context/AuthContext'
import SignUpForm from './Screens/SignUpForm'
import SignInForm from './Screens/SignInForm'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Button from './components/Button'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './Screens/AdminDashboard'
import UserDashboard from './Screens/UserDashboard'
import Totaluser from './Screens/Totaluser'
import AddContest from './Screens/AddContest'
import TotalContests from './Screens/TotalContests'

function Home() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center p-4 h-[70vh]">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center px-4">Welcome to <span className="text-[#8cc63f]">Desun Academy</span></h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto text-center px-4">
        Empowering the next generation of specialists through rigorous training and high-stakes competition.
      </p>
      <Button variant="primary" onClick={() => navigate('/signup')} className="text-lg py-3.5 px-10 rounded-full shadow-lg shadow-[#8cc63f]/20">
        Get Started Now
      </Button>
    </div>
  );
}

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
          </Route>

          {/* Regular User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['User']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
