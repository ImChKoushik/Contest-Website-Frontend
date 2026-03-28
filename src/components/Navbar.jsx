import Button from './Button';

export default function Navbar({ onSignInClick, onSignUpClick }) {
  return (
    <header className="bg-white sticky top-0 z-50 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15Z" fill="#ffefb3"/>
              <path d="M50 30C38.95 30 30 38.95 30 50C30 61.05 38.95 70 50 70C61.05 70 70 61.05 70 50C70 38.95 61.05 30 50 30Z" fill="#8cc63f"/>
              <path d="M50 40A10 10 0 1 0 50 60A10 10 0 1 0 50 40Z" fill="#FFA500"/>
            </svg>
            <div className="font-bold text-xl tracking-tight flex flex-col uppercase leading-tight">
              <span className="text-gray-900">Desun Academy</span>
              <span className="text-gray-900 text-[0.55rem] tracking-wider bg-[#fcb900] w-max px-1.5 py-0.5 rounded font-bold">Get Placed by Skills</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-10">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">Contests</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">About Us</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">Contact</a>
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="secondary" className="px-5 font-bold text-sm" onClick={onSignInClick}>Sign In</Button>
            <Button variant="primary" className="px-6 py-2 text-sm" onClick={onSignUpClick}>Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
