import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
// --- Password Strength Helper ---
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: 'Weak',   color: '#ef4444' },
    { label: 'Fair',   color: '#f97316' },
    { label: 'Good',   color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...levels[score - 1] };
};


export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordStrength = getPasswordStrength(newPassword);
  const { sendRequest, loading, error } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showToast("Please fill in both fields", "warning");
      return;
    }
    
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "warning");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      showToast("Password must contain at least one uppercase letter", "warning");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      showToast("Password must contain at least one number", "warning");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      showToast("Password must contain at least one special character", "warning");
      return;
    }

    if (passwordStrength.score < 4) {
      showToast("Please use a stronger password", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }

    if (!token) {
      showToast("Invalid or missing token", "error");
      return;
    }

    const payload = { newPassword };

    // The backend endpoint is /api/v1/user/reset-password/:token
    const url = `https://contest-backend-td3m.onrender.com/api/v1/user/reset-password/${token}`;
    
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
             </svg>
          </div>
          <h2 className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">Secure New Password</h2>
          <p className="text-gray-500 text-[15px]">Enter your new password below to regain access.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">{error}</div>}

        <Form onSubmit={handleSubmit} className="!p-0 !shadow-none !rounded-none !max-w-none w-full !bg-transparent">
          
          <Input 
            label="New Password" 
            type="password" 
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters" 
            icon={<LockIcon />} 
            required
            afterContent={
              newPassword ? (
                <div className="mt-2 px-1">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: passwordStrength.score >= seg
                            ? passwordStrength.color
                            : '#e5e7eb',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {passwordStrength.score < 4 ? 'Use A–Z, 0–9 & symbol' : '✓ Strong password'}
                    </p>
                  </div>
                </div>
              ) : null
            }
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
            {loading ? "Resetting..." : "Reset Password"}
            {!loading && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            )}
          </Button>

        </Form>
      </div>
    </div>
  );
}
