import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

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

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  
  // States for Phase 2: Reset
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { sendRequest, loading, error } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast("Please enter an email address", "warning");
      return;
    }

    const payload = { email };

    const result = await sendRequest("https://contest-backend-td3m.onrender.com/api/v1/user/forgot-password", payload);
    
    if (result) {
      showToast("Verification token sent to your email!", "success");
      setStep(2); // Move to the verification & reset step
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token || !newPassword || !confirmPassword) {
      showToast("Please fill all the fields", "warning");
      return;
    }

    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }

    let extractedToken = token.trim();
    if (extractedToken.includes('/reset-password/')) {
        extractedToken = extractedToken.split('/reset-password/').pop();
    }

    const url = `https://contest-backend-td3m.onrender.com/api/v1/user/reset-password/${extractedToken}`;
    const payload = { newPassword };

    const result = await sendRequest(url, payload);

    if (result) {
      showToast("Password reset successfully! You can now sign in.", "success");
      navigate('/signin');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex justify-center items-center">
      <div className="w-full max-w-[600px] bg-white rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#8cc63f]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#8cc63f]">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
             </svg>
          </div>
          <h2 className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </h2>
          <p className="text-gray-500 text-[15px]">
            {step === 1 
              ? "No worries, we'll send you a verification token to reset it." 
              : "Enter the verification token from your email and your new password."}
          </p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">{error}</div>}

        {step === 1 ? (
          /* Step 1: Request Token */
          <Form onSubmit={handleRequestToken} className="!p-0 !shadow-none !rounded-none !max-w-none w-full !bg-transparent">
            <Input 
              label="Email Address" 
              type="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              icon={<MailIcon />} 
              required
            />

            <Button type="submit" disabled={loading} className="w-full py-[14px] text-[15px] flex items-center justify-center gap-2 mt-6">
              {loading ? "Sending token..." : "Send Verification Mail"}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
            </Button>
          </Form>
        ) : (
          /* Step 2: Input Token and New Password */
          <Form onSubmit={handleResetPassword} className="!p-0 !shadow-none !rounded-none !max-w-none w-full !bg-transparent">
            <Input 
              label="Verification Link" 
              type="text" 
              name="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste the full link here" 
              icon={<KeyIcon />} 
              required
            />

            <Input 
              label="New Password" 
              type="password" 
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters" 
              icon={<LockIcon />} 
              required
            />

            <Input 
              label="Confirm New Password" 
              type="password" 
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              icon={<LockIcon />} 
              required
            />

            <Button type="submit" disabled={loading} className="w-full py-[14px] text-[15px] flex items-center justify-center gap-2 mt-6">
              {loading ? "Verifying & Resetting..." : "Verify & Save Password"}
              {!loading && (
                <KeyIcon />
              )}
            </Button>
          </Form>
        )}

        <div className="text-center text-[14px] text-gray-600 font-medium mt-8">
          <button 
              type="button"
              onClick={() => step === 2 ? setStep(1) : navigate('/signin')} 
              className="font-semibold text-[#8cc63f] hover:underline bg-transparent border-none p-0 flex flex-row items-center justify-center w-full gap-2 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {step === 2 ? "Back to Email Request" : "Back to Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
