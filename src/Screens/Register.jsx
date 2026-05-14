import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import { useToast } from "../context/ToastContext";
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const nameRef = useRef(null);
  const { showToast } = useToast();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    areaOfInterest: ""
  });

  useEffect(() => {
    // Auto-focus and scroll to the first input when the component mounts
    if (nameRef.current) {
      nameRef.current.focus();
      nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://contest-backend-td3m.onrender.com/api/v1/user/register-user", form);

      console.log(res.data);
      showToast("User Registered Successfully", "success");

    } catch (err) {
      console.error(err.response?.data);
      showToast(err.response?.data?.message || "Error registering user", "error");
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-br from-[#fdfdfd] to-green-50/40 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center px-8 md:px-16 py-12 lg:py-24 gap-12 lg:gap-24 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-green-200/30 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Left Section */}
        <div className="flex-1 max-w-xl space-y-8 z-10">
          <h1 className="text-5xl md:text-[5.5rem] font-extrabold leading-[1.05] text-gray-900 tracking-tight">
            Elevate Your <br />
            <span className="text-[#84cc16]">Skills</span> with the <br />
            Elite<span className="text-gray-900">.</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-md pt-2">
            Join a global community of specialists. Participate in high-stakes contests and master the pulse of academic excellence.
          </p>

          <div className="space-y-6 pt-6">
            <div className="flex gap-4 items-start">
              <div className="bg-[#eef8dd] p-3 rounded-full text-[#84cc16]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L8 5H2v6l-4 4 4 4v6h6l4 4 4-4h6v-6l4-4-4-4V5h-6z" opacity="0.3"></path><path d="M12 4l3 3h5v5l3 3-3 3v5h-5l-3 3-3-3H4v-5l-3-3 3-3V7h5l3-3m0-2L8 5H2v7l-2 2 2 2v7h7l3 3 3-3h7v-7l2-2-2-2V5h-7L12 2zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Premium Certifications</h3>
                <p className="text-sm text-gray-500">Validated by industry-leading academic boards.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-[#fff1e0] p-3 rounded-full text-orange-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H5C3.34 5 2 6.34 2 8v1c0 2.66 1.7 4.9 4.14 5.67A5.996 5.996 0 0 0 11 19.9V21h-2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-1.1a5.996 5.996 0 0 0 4.86-5.23C20.3 13.9 22 11.66 22 9V8c0-1.66-1.34-3-3-3zM4 9V8c0-.55.45-1 1-1h2v5.13C5.28 11.53 4 10.42 4 9zm10 9c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm5-9c0 1.42-1.28 2.53-3 3.13V7h2c.55 0 1 .45 1 1v1z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Global Contests</h3>
                <p className="text-sm text-gray-500">Compete for high-value rewards and recognition.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-[#fce7f3] p-3 rounded-full text-pink-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Specialist Network</h3>
                <p className="text-sm text-gray-500">Connect with peers across various disciplines.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-10 w-max inline-block relative z-10 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Upcoming Contest</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Advanced UI Algorithms</h3>
            <p className="text-[#84cc16] font-bold text-sm mt-0.5">Prize Pool: $5,000</p>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="flex-1 w-full max-w-[440px] z-10">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-50/50">
            <h2 className="text-[28px] font-extrabold text-gray-900 mb-2 leading-tight">Create Account</h2>
            <p className="text-[15px] text-gray-500 mb-8">Start your journey at Desun Academy today.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                ref={nameRef}
                label="Full Name" 
                type="text" 
                name="userName" 
                value={form.userName}
                onChange={handleChange}
                placeholder="John Doe" 
                required
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
              />

              <Input 
                label="Email Address" 
                type="email" 
                name="email" 
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com" 
                required
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
              />

              <div className="flex flex-col mb-4 w-full">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-2 transition-colors">Area of Interest</label>
                <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-[var(--border-primary)] focus-within:border-[var(--accent-green)] focus-within:bg-[var(--input-focus-bg)] transition-all overflow-hidden group">
                  <span className="pl-4 text-[var(--text-secondary)] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </span>
                  <select
                    name="areaOfInterest"
                    value={form.areaOfInterest}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent px-4 py-3.5 outline-none text-[var(--text-primary)] text-sm transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select your interest...</option>
                    <option value="MERN Full Stack" className="bg-[var(--bg-primary)] text-[var(--text-primary)]">MERN Full Stack</option>
                    <option value="UI/UX" className="bg-[var(--bg-primary)] text-[var(--text-primary)]">UI/UX</option>
                    <option value="Digital Marketing" className="bg-[var(--bg-primary)] text-[var(--text-primary)]">Digital Marketing</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none text-[var(--text-secondary)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <Input 
                label="Password"
                type="password" 
                name="password" 
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••" 
                required
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
              />

              <div className="flex items-start pt-3">
                <div className="flex items-center h-5">
                  <input id="terms" type="checkbox" className="w-[18px] h-[18px] rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16] bg-white mt-0.5 appearance-none border-2 checked:bg-[#84cc16] checked:border-[#84cc16] transition-colors relative" />
                </div>
                <div className="ml-3 text-[13px] leading-snug">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the <a href="#" className="text-[#84cc16] font-semibold hover:underline">Terms and Conditions</a> and the <a href="#" className="text-[#84cc16] font-semibold hover:underline">Privacy Policy</a>.
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-[0_8px_20px_-6px_rgba(132,204,22,0.4)] text-[15px] font-bold text-white bg-[#84cc16] hover:bg-[#72b012] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84cc16] transition-all mt-6 active:scale-[0.98]">
                Create Account
                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Button>
            </form>

            <div className="mt-8 text-center text-[13.5px] text-gray-500">
              Already have an account? <a href="/signin" className="text-[#84cc16] font-bold hover:underline">Sign In</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
