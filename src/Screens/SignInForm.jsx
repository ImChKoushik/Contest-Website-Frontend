import { useState, useEffect, useRef } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import useAuth from '../hooks/useAuth';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function SignInForm() {
  const emailRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { sendRequest, loading, error } = useAuth();
  const { login, user } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-focus and scroll to the email input when the component mounts
    if (emailRef.current) {
      emailRef.current.focus();
      emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

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

  const handleResendVerification = async () => {
    if (!formData.email) {
      showToast("Please enter your email first to resend the verification link", "warning");
      return;
    }

    setIsResending(true);
    const result = await sendRequest("https://contest-backend-td3m.onrender.com/api/v1/user/resend-mail", { email: formData.email });
    setIsResending(false);
    
    if (result) {
      showToast("Verification email sent successfully! Please check your inbox.", "success");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast("Please fill in all fields", "warning");
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      remember: rememberMe
    };

    const result = await sendRequest("https://contest-backend-td3m.onrender.com/api/v1/user/login-user", payload);
    
    if (result) {
      const userData = result.data?.user || result.user;
      const authToken = result.data?.accessToken || result.accessToken || null;
      const refreshToken = result.data?.refreshToken || result.refreshToken || null;

      // Store tokens in localStorage so they persist across browser restarts
      if (authToken) localStorage.setItem('authToken', authToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      login(userData, authToken);

      showToast("Login Successful! Welcome back.", "success");

      if (userData.role === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex justify-center items-center">
      <div className="w-full max-w-[1000px] bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col md:flex-row overflow-hidden border border-gray-100/50">
        
        {/* Left Side: Green Banner with Context */}
        <div className="md:w-1/2 bg-[#8cc63f] p-10 lg:p-14 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-[36px] lg:text-[44px] font-extrabold leading-[1.15] mb-6 tracking-tight">
              Elevate Your Skills<br />to Elite Status.
            </h2>
            <p className="text-[17px] text-white/95 mb-14 max-w-[380px] leading-relaxed font-medium">
              Join the community of top-tier specialists and prove your worth in global contests.
            </p>

            <div className="bg-lime-500 bg-opacity-30 backdrop-blur-md rounded-2xl p-5 border border-white/20 w-fit">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[38px] h-[38px] bg-orange-400 rounded-full flex items-center justify-center text-lg shadow-inner">
                  🏆
                </div>
                <span className="font-bold text-white tracking-wide text-sm">Upcoming: UI Design Sprint</span>
              </div>
              <div className="flex items-center ml-2">
                <div className="w-[30px] h-[30px] rounded-full bg-gray-200 border-2 border-[#8cc63f] -ml-2 shadow-sm"></div>
                <div className="w-[30px] h-[30px] rounded-full bg-gray-400 border-2 border-[#8cc63f] -ml-2 shadow-sm"></div>
                <div className="w-[30px] h-[30px] rounded-full bg-gray-600 border-2 border-[#8cc63f] -ml-2 shadow-sm"></div>
                <div className="w-[30px] h-[30px] rounded-full bg-orange-400 border-2 border-[#8cc63f] -ml-2 flex items-center justify-center text-[10px] font-bold z-10 shadow-sm text-white">
                  +42
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
             <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-white blur-3xl mix-blend-overlay"></div>
             <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-white blur-3xl mix-blend-overlay"></div>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">Welcome back</h2>
            <p className="text-gray-500 text-[15px]">Enter your credentials to access your academy dashboard.</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

          <Form onSubmit={handleSubmit} className="!p-0 !shadow-none !rounded-none !max-w-none w-full !bg-transparent">
            
            <div className="relative mb-0">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-800">Email Address</label>
                {formData.email && (
                  <button 
                    type="button" 
                    onClick={handleResendVerification} 
                    disabled={isResending}
                    className="text-xs font-semibold text-[#8cc63f] hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend Verification Mail"}
                  </button>
                )}
              </div>
              <Input 
                ref={emailRef}
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com" 
                required
              />
            </div>

            <div className="relative mb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-800">Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }} className="text-xs font-semibold text-[#8cc63f] hover:underline">Forgot Password?</a>
              </div>
              <div className="relative group">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[14px] text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center mb-8">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#8cc63f] focus:ring-[#8cc63f] mt-0.5" 
              />
              <label htmlFor="remember" className="ml-3 text-[13px] text-gray-600 font-medium cursor-pointer">Remember me for 30 days</label>
            </div>

            <Button type="submit" disabled={loading} className="w-full py-[14px] text-[15px] flex items-center justify-center gap-2">
              {loading ? "Signing In..." : "Sign In"}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
            </Button>

            <div className="flex items-center mt-7 mb-7">
              <div className="flex-1 border-t border-gray-100"></div>
              <div className="px-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Or continue with</div>
              <div className="flex-1 border-t border-gray-100"></div>
            </div>

            <div className="flex gap-4 mb-8">
              <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-800 text-sm shadow-sm group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" className="group-hover:scale-110 transition-transform">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-800 text-sm shadow-sm group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="group-hover:scale-110 transition-transform">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                GitHub
              </button>
            </div>

            <p className="text-center text-[14px] text-gray-600 font-medium">
              Don't have an account? <a href="#" className="text-[#8cc63f] font-bold hover:underline transition-colors hover:text-[#7ab135]">Sign Up</a>
            </p>

          </Form>
        </div>
        
      </div>
    </div>
  );
}
