import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ToastContainer from './components/ToastContainer'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthContext } from './context/AuthContext'

// Optimized Lazy Loading for Screens
const Home = lazy(() => import('./Screens/Home'))
const AboutUs = lazy(() => import('./Screens/AboutUs'))
const Contests = lazy(() => import('./Screens/Contests'))
const ContestDetails = lazy(() => import('./Screens/ContestDetails'))
const CategoryContestPage = lazy(() => import('./Screens/CategoryContestPage'))
const SignUpForm = lazy(() => import('./Screens/SignUpForm'))
const SignInForm = lazy(() => import('./Screens/SignInForm'))
const ForgotPassword = lazy(() => import('./Screens/ForgotPassword'))
const ContactUs = lazy(() => import('./Screens/ContactUs'))
const AdminDashboard = lazy(() => import('./Screens/AdminDashboard'))
const Totaluser = lazy(() => import('./Screens/Totaluser'))
const AddContest = lazy(() => import('./Screens/AddContest'))
const TotalContests = lazy(() => import('./Screens/TotalContests'))
const TotalTeams = lazy(() => import('./Screens/TotalTeams'))
const TotalResults = lazy(() => import('./Screens/TotalResults'))
const TotalInvites = lazy(() => import('./Screens/TotalInvites'))
const UserDashboard = lazy(() => import('./Screens/UserDashboard'))
const SubmitProject = lazy(() => import('./Screens/SubmitProject'))
const WhyDesun = lazy(() => import('./Screens/WhyDesun'))

// Premium Loading Fallback
const ScreenLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 animate-fade-in">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-[#8cc63f]/20 border-t-[#8cc63f] animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-4 border-[#fcb900]/20 border-b-[#fcb900] animate-spin-reverse"></div>
    </div>
    <p className="mt-6 text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Initializing Portal...</p>
  </div>
);

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
        <Suspense fallback={<ScreenLoader />}>
          <Routes>
            <Route path="/" element={<LandingRedirect />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/contests/details/:contestId" element={<ContestDetails />} />
            <Route path="/contests/category/:categorySlug" element={<CategoryContestPage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/why-desun" element={<WhyDesun />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard/total-users" element={<Totaluser />} />
              <Route path="/admin-dashboard/add-contest" element={<AddContest />} />
              <Route path="/admin-dashboard/total-contests" element={<TotalContests />} />
              <Route path="/admin-dashboard/total-participants" element={<TotalTeams />} />
              <Route path="/admin-dashboard/total-results" element={<TotalResults />} />
              <Route path="/admin-dashboard/total-invites" element={<TotalInvites />} />
            </Route>

            {/* Regular User Routes */}
            <Route element={<ProtectedRoute allowedRoles={['User']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/dashboard/submit-project/:contestId" element={<SubmitProject />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App
