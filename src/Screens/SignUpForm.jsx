import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import useAuth from '../hooks/useAuth';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const RenewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

const GenderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    contact: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { sendRequest, loading, error } = useAuth();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.contact)) {
      alert("Contact number must be exactly 10 digits");
      return;
    }

    let formattedGender = formData.gender.trim().toLowerCase();
    if (formattedGender === 'other') formattedGender = 'others';
    
    if (!['male', 'female', 'others'].includes(formattedGender)) {
      alert("Gender must be Male, Female, or Others");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    const payload = {
      userName: formData.userName,
      email: formData.email,
      contact: formData.contact,
      gender: formattedGender,
      password: formData.password
    };

    const result = await sendRequest("https://contest-backend-td3m.onrender.com/api/v1/user/register-user", payload);
    
    if (result) {
      alert("User Registered Successfully");
      // Possibly redirect or clear form here
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content & Features */}
        <div className="space-y-12">
          {/* Main heading */}
          <div>
            <h1 className="text-5xl md:text-[56px] font-extrabold text-gray-900 leading-[1.15] mb-6 tracking-tight">
              Elevate Your<br />
              <span className="text-[#8cc63f]">Skills</span> with the<br />
              Elite.
            </h1>
            <p className="text-xl text-gray-600 max-w-[480px] leading-relaxed">
              Join a global community of specialists. Participate in high-stakes contests and master the pulse of academic excellence.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            {/* Feature 1 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-[#8cc63f]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Premium Certifications</h3>
                <p className="text-gray-500 text-sm">Validated by industry-leading academic boards.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Global Contests</h3>
                <p className="text-gray-500 text-sm">Compete for high-value rewards and recognition.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15m2.25-4.5h10.5m-10.5 9h10.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Specialist Network</h3>
                <p className="text-gray-500 text-sm">Connect with peers across various disciplines.</p>
              </div>
            </div>
          </div>

          {/* Upcoming Contest Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-sm border border-gray-100 mt-10 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="uppercase text-xs font-bold tracking-wider text-gray-500">Upcoming Contest</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Advanced UI Algorithms</h4>
            <p className="font-semibold text-[#8cc63f]">Prize Pool: $5,000</p>
          </div>
        </div>

        {/* Right Side: Form Component */}
        <div className="flex justify-center lg:justify-end">
          <Form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500 text-[15px]">Start your journey at Desun Academy today.</p>
            </div>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <Input 
              label="Full Name" 
              type="text" 
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="John Doe" 
              icon={<UserIcon />} 
              required
            />
            
            <Input 
              label="Email Address" 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com" 
              icon={<MailIcon />} 
              required
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="flex-1">
                <Input 
                  label="Contact Number" 
                  type="tel" 
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="10-digit mobile number" 
                  icon={<PhoneIcon />} 
                  required
                />
              </div>
              <div className="flex-1">
                <Input 
                  label="Gender" 
                  type="text" 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Male/Female/Others" 
                  icon={<GenderIcon />} 
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="flex-1">
                <Input 
                  label="Password" 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters" 
                  icon={<LockIcon />} 
                  required
                />
              </div>
              <div className="flex-1">
                <Input 
                  label="Confirm Password" 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  icon={<RenewIcon />} 
                  required
                />
              </div>
            </div>
            
            <div className="flex items-start mb-8 mt-2">
              <div className="flex items-center h-5 mt-0.5">
                <input 
                  id="terms" 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#8cc63f] focus:ring-[#8cc63f]" 
                />
              </div>
              <div className="ml-3 text-sm leading-relaxed">
                <label htmlFor="terms" className="text-gray-500">
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-[#8cc63f] hover:underline">
                    Terms and Conditions
                  </a>
                  {' '}and the{' '}
                  <a href="#" className="font-semibold text-[#8cc63f] hover:underline">
                    Privacy Policy
                  </a>.
                </label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
            </Button>
            
            <p className="text-center text-[15px] text-gray-500 mt-8">
              Already have an account?{' '}
              <a href="#" className="font-semibold text-[#8cc63f] hover:underline">
                Sign In
              </a>
            </p>
          </Form>
        </div>
        
      </div>
    </div>
  );
}
