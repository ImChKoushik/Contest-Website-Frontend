import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import useContests from '../hooks/useContests';
import { useToast } from '../context/ToastContext';

export default function AddContest() {
  const [formData, setFormData] = useState({
    contestTitle: '',
    contestDescription: '',
    projectBriefing: '',
    contestDeadLine: '',
    status: 'Upcoming',
    category: 'MERN',
    entryLimit: 100,
    projectType: 'Individual',
    teamSize: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const CATEGORY_OPTIONS = ["MERN", "UI/UX DESIGN", "DIGITAL MARKETING", "WEBSITE DESIGNING"];
  const STATUS_OPTIONS = ["Upcoming", "On-Going", "Completed"];
  const PROJECT_TYPE_OPTIONS = ["Individual", "Team", "Both"];

  const { addContest, loading, error } = useContests();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'teamSize' || name === 'entryLimit' ? Number(value) : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
        dataToSend.append(key, formData[key]);
    });
    
    if (imageFile) {
        dataToSend.append('contestImage', imageFile);
    }

    const result = await addContest(dataToSend);
    
    if (result) {
      showToast("Contest Created Successfully!", "success");
      navigate("/admin-dashboard/total-contests");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="mb-10">
          <button 
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#8cc63f] font-bold text-sm mb-6 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create New Contest</h1>
          <p className="text-gray-500 mt-2">Fill in the details below to launch a new specialization challenge.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="!p-0 !shadow-none !bg-transparent !max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <Input 
                label="Contest Title" 
                type="text" 
                name="contestTitle"
                value={formData.contestTitle}
                onChange={handleChange}
                placeholder="e.g., Frontend Master Challenge 2026" 
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Contest Description</label>
              <textarea 
                name="contestDescription"
                value={formData.contestDescription}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none transition-all text-gray-800 placeholder:text-gray-400 font-medium text-[15px] min-h-[120px] resize-none"
                placeholder="Briefly describe the contest objectives..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Project Briefing</label>
              <textarea 
                name="projectBriefing"
                value={formData.projectBriefing}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none transition-all text-gray-800 placeholder:text-gray-400 font-medium text-[15px] min-h-[200px] resize-none"
                placeholder="Provide a detailed project briefing for participants..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-[0.1em]">Contest Cover Image</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div 
                  className="relative group h-48 rounded-[24px] overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-[#8cc63f] transition-all flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => document.getElementById('contestImage').click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                      <span className="text-[11px] font-black uppercase tracking-widest text-center px-4">Click to upload premium cover image</span>
                    </div>
                  )}
                  <input 
                    id="contestImage"
                    type="file" 
                    onChange={handleFileChange}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 italic text-[12px] text-gray-500 leading-relaxed font-medium">
                     "A high-quality image helps attract more participants. Resolution of 1200x800px is recommended for the best display across devices."
                  </div>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-[#8cc63f]/10 text-[#8cc63f] text-[9px] font-black uppercase rounded-full">JPG / PNG</span>
                     <span className="px-3 py-1 bg-[#8cc63f]/10 text-[#8cc63f] text-[9px] font-black uppercase rounded-full">Max 5MB</span>
                  </div>
                </div>
              </div>
            </div>

            <Input 
              label="Submission Deadline" 
              type="datetime-local" 
              name="contestDeadLine"
              value={formData.contestDeadLine}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-2">Contest Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none transition-all text-gray-800 font-medium text-[15px] cursor-pointer appearance-none"
                required
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-2">Project Type</label>
              <select 
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none transition-all text-gray-800 font-medium text-[15px] cursor-pointer appearance-none"
                required
              >
                {PROJECT_TYPE_OPTIONS.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {['Team', 'Both'].includes(formData.projectType) && (
              <Input 
                label="Max Team Size" 
                type="number" 
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min="2"
                required
              />
            )}

            <div className="flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-2">Initial Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none transition-all text-gray-800 font-medium text-[15px] cursor-pointer appearance-none"
                required
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <Input 
              label="Participant/Team Limit" 
              type="number" 
              name="entryLimit"
              value={formData.entryLimit}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full md:w-auto px-10 py-4 text-[15px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#8cc63f]/20">
              {loading ? "Launching Contest..." : "Launch Contest"}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
