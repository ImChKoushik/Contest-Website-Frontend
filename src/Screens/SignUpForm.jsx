import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Form from '../components/Form';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

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

const InterestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    contact: '',
    gender: '',
    areaOfInterest: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { sendRequest, loading, error } = useAuth();
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/^[A-Z]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score === 3) return { label: 'Strong', color: 'bg-[#8cc63f]', text: 'text-[#8cc63f]' };
    if (score === 2) return { label: 'Weak', color: 'bg-yellow-500', text: 'text-yellow-600' };
    return { label: 'Poor', color: 'bg-red-500', text: 'text-red-500' };
  };

  const strength = getPasswordStrength(formData.password);

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
      showToast("Password must be at least 8 characters long", "warning");
      return;
    }
    if (!/^[A-Z]/.test(formData.password)) {
      showToast("Password must start with a capital letter", "warning");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      showToast("Password must contain at least one special character", "warning");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.contact)) {
      showToast("Contact number must be exactly 10 digits", "warning");
      return;
    }

    let formattedGender = formData.gender.trim().toLowerCase();
    if (formattedGender === 'other') formattedGender = 'others';

    if (!['male', 'female', 'others'].includes(formattedGender)) {
      showToast("Gender must be Male, Female, or Others", "warning");
      return;
    }

    if (!formData.areaOfInterest) {
      showToast("Please select your Area of Interest", "warning");
      return;
    }

    if (!termsAccepted) {
      showToast("Please accept the terms and conditions", "warning");
      return;
    }

    const submissionData = new FormData();
    submissionData.append('userName', formData.userName);
    submissionData.append('email', formData.email);
    submissionData.append('contact', formData.contact);
    submissionData.append('gender', formattedGender);
    submissionData.append('areaOfInterest', formData.areaOfInterest);
    submissionData.append('password', formData.password);

    if (profileImage) {
      submissionData.append('profileImage', profileImage);
    }

    const result = await sendRequest("https://contest-backend-td3m.onrender.com/api/v1/user/register-user", submissionData);

    if (result) {
      showToast("User Registered Successfully! Please check your email to verify your account.", "success");
      navigate("/signin");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Side: Content & Features */}
        <div className="order-2 lg:order-1 space-y-12 relative">
          
          <div className="-mt-4 md:-mt-8 mb-4">
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors bg-[var(--bg-secondary)] hover:bg-[var(--border-primary)] px-4 py-2 rounded-full shadow-sm border border-[var(--border-primary)] text-sm w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Main heading */}
          <div>
            <h1 className="text-5xl md:text-[56px] font-extrabold text-[var(--text-primary)] leading-[1.15] mb-6 tracking-tight transition-colors">
              Elevate Your<br />
              <span className="text-[var(--accent-green)]">Skills</span> with the<br />
              Elite.
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-[480px] leading-relaxed transition-colors">
              Join a global community of specialists. Participate in high-stakes contests and master the pulse of academic excellence.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            {/* Feature 1 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--accent-green)]/10 rounded-full flex items-center justify-center text-[var(--accent-green)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 transition-colors">Premium Certifications</h3>
                <p className="text-[var(--text-secondary)] text-sm transition-colors">Validated by industry-leading academic boards.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 transition-colors">Global Contests</h3>
                <p className="text-[var(--text-secondary)] text-sm transition-colors">Compete for high-value rewards and recognition.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15m2.25-4.5h10.5m-10.5 9h10.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 transition-colors">Specialist Network</h3>
                <p className="text-[var(--text-secondary)] text-sm transition-colors">Connect with peers across various disciplines.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Component */}
        <div className="order-1 lg:order-2 flex flex-col items-center lg:items-end w-full">
          <Form onSubmit={handleSubmit} className="!bg-[var(--card-bg)] transition-colors">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2 transition-colors">Create Account</h2>
              <p className="text-[var(--text-secondary)] text-[15px] transition-colors">Start your journey at Desun Academy today.</p>
            </div>

            {/* Image Upload Area */}
            <div className="flex flex-col items-center justify-center mb-8">
              <label htmlFor="profileImage" className="relative cursor-pointer group">
                <div className="w-[100px] h-[100px] rounded-full border-[3px] border-dashed border-[var(--accent-green)] overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center group-hover:brightness-110 transition-all shadow-sm">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-9 h-9 text-[var(--text-secondary)]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">Upload</span>
                </div>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <span className="text-sm text-[var(--text-secondary)] mt-3 font-medium transition-colors">Profile Image (Optional)</span>
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
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  icon={<GenderIcon />}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'others', label: 'Others' }
                  ]}
                  required
                />
              </div>
            </div>

            <div className="mb-2 w-full">
              <Select
                label="Area of Interest"
                name="areaOfInterest"
                value={formData.areaOfInterest}
                onChange={handleChange}
                icon={<InterestIcon />}
                options={[
                  { value: 'MERN Full Stack', label: 'MERN Full Stack' },
                  { value: 'UI/UX', label: 'UI/UX' },
                  { value: 'Digital Marketing', label: 'Digital Marketing' }
                ]}
                required
              />
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
                {strength && (
                  <div className="flex items-center justify-between text-xs mt-[-10px] mb-3 px-1">
                    <span className={`font-semibold ${strength.text}`}>{strength.label} Password</span>
                    <div className="flex gap-1.5">
                      <div className={`h-1.5 w-6 rounded-full ${strength.color}`}></div>
                      <div className={`h-1.5 w-6 rounded-full ${strength.label === 'Poor' ? 'bg-gray-200' : strength.color}`}></div>
                      <div className={`h-1.5 w-6 rounded-full ${strength.label === 'Strong' ? strength.color : 'bg-gray-200'}`}></div>
                    </div>
                  </div>
                )}
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
                  className="w-4 h-4 rounded border-[var(--border-primary)] text-[var(--accent-green)] focus:ring-[var(--accent-green)] bg-[var(--input-bg)] transition-colors"
                />
              </div>
              <div className="ml-3 text-sm leading-relaxed">
                <label htmlFor="terms" className="text-[var(--text-secondary)] transition-colors">
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-[var(--accent-green)] hover:underline transition-colors">
                    Terms and Conditions
                  </a>
                  {' '}and the{' '}
                  <a href="#" className="font-semibold text-[var(--accent-green)] hover:underline transition-colors">
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

          </Form>

          <p className="text-center text-[15px] text-[var(--text-secondary)] mt-8 transition-colors">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="font-semibold text-[var(--accent-green)] hover:underline bg-transparent border-none p-0 cursor-pointer transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
