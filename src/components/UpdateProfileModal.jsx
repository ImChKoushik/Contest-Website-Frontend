import React, { useState, useRef } from 'react';
import useProfile from '../hooks/useProfile';
import Input from './Input';
import Button from './Button';
import DefaultProfile from '../assets/images/DefaultProfile.png';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function UpdateProfileModal({ isOpen, onClose }) {
  const { user } = useAuthContext();
  const { updateUserProfile, updateUserImage, loading } = useProfile();
  const { showToast } = useToast();

  // Validate image fallback perfectly to eliminate "another user" bugs
  const profileImageUrl = user?.profileImage?.url && user.profileImage.url.trim() !== '' 
            ? user.profileImage.url 
            : DefaultProfile;

  // Image states
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(profileImageUrl);
  const fileInputRef = useRef(null);

  // Detail states
  const [formData, setFormData] = useState({
    contact: user?.contact || '',
    oldPassword: '',
    newPassword: ''
  });

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image size must be less than 2MB", "error");
        e.target.value = null; // Clear failing input
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast("Only JPG, PNG, and WEBP formats are allowed", "error");
        e.target.value = null; // Clear failing input
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!profileImage) return;

    const data = new FormData();
    data.append('profileImage', profileImage);

    const success = await updateUserImage(data);
    if (success) {
      setTimeout(() => {
        onClose();
        setProfileImage(null);
      }, 500);
    }
  };

  const handleDetailsChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUserProfile(formData.contact, formData.oldPassword, formData.newPassword);
    if (success) {
      setTimeout(() => {
        onClose();
        setFormData({ ...formData, oldPassword: '', newPassword: '' });
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center h-screen w-screen p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal panel */}
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl relative z-10 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8cc63f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 relative z-10 border-b border-gray-100 shrink-0">
          <div className="flex justify-between items-center bg-transparent">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Edit Profile</h2>
            <button 
              onClick={onClose}
              className="px-4 py-2 flex items-center gap-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors font-bold text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-4 relative z-10 flex-col overflow-y-auto scrollbar-hide">
          {/* Photo Section */}
          <form onSubmit={handleImageSubmit} className="flex flex-col items-center mb-8 border-b border-gray-100 pb-8 mt-2">
            <div className="text-center w-full mb-6 flex flex-col items-center">
              <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-gray-50 flex items-center justify-center mb-5 ${profileImage ? 'ring-2 ring-[#8cc63f] ring-offset-2' : ''}`}>
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = DefaultProfile; }}
                />
              </div>
              
              <input 
                type="file"
                id="profileFileInput"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              
              <label 
                htmlFor="profileFileInput"
                className="cursor-pointer bg-[#8cc63f]/10 hover:bg-[#8cc63f]/20 text-[#8cc63f] py-2 px-5 rounded-full text-xs font-black uppercase tracking-wider transition-colors shadow-sm mb-3 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                Choose New Image
              </label>

              <p className="text-xs text-gray-400 font-medium tracking-wide">
                JPG, PNG or WEBP. Max size 2MB.
              </p>
            </div>

            {profileImage && (
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full py-3 bg-[#8cc63f] hover:bg-black text-[13px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#8cc63f]/20 transition-all rounded-2xl"
              >
                {loading ? "Uploading..." : "Save New Photo"}
              </Button>
            )}
          </form>

          {/* Details Section */}
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest pl-1 mb-2">Security & Contact</h3>
            
            <Input 
              label="Contact Number" 
              type="tel"
              name="contact"
              placeholder="Ex. 9876543210"
              value={formData.contact}
              onChange={handleDetailsChange}
              maxLength={10}
              className="!py-3"
            />
            
            <div className="h-px bg-gray-100/50 my-4"></div>
            
            <Input 
              label="Old Password" 
              type="password"
              name="oldPassword"
              placeholder="Current secure password"
              value={formData.oldPassword}
              onChange={handleDetailsChange}
              className="!py-3"
            />
            <Input 
              label="New Password" 
              type="password"
              name="newPassword"
              placeholder="Min. 8 characters"
              value={formData.newPassword}
              onChange={handleDetailsChange}
              className="!py-3"
            />
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading || (!formData.contact && !formData.newPassword)} 
                className="w-full py-4 bg-gray-900 hover:bg-black text-white text-[13px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-gray-200 transition-all rounded-2xl"
              >
                {loading ? "Saving..." : "Update Security Details"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
