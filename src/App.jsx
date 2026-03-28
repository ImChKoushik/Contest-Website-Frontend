import { useState } from 'react'
import SignUpForm from './Screens/SignUpForm'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Button from './components/Button'

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <Navbar
        onSignUpClick={() => setShowSignUp(true)}
        onSignInClick={() => setShowSignUp(false)}
      />

      <main className="min-h-[calc(100vh-80px)] bg-[#fbfcfb]">
        {showSignUp ? (
          <SignUpForm />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 h-[70vh]">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Desun Academy</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-center">
              Empowering the next generation of specialists through rigorous training and high-stakes competition.
            </p>
            <Button variant="primary" onClick={() => setShowSignUp(true)} className="text-lg py-3 px-8">
              Get Started Now
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </>
  )
}

export default App
