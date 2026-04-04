import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useParticipation from '../hooks/useParticipation';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';

export default function SubmitProject() {
  const { contestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { submitProject, fetchMyParticipations, myParticipations, loading, error } = useParticipation();
  
  const contest = location.state?.contest;
  const initialParticipation = location.state?.participation;

  const [formData, setFormData] = useState({
    submissionLink: initialParticipation?.submissionLink || '',
    description: initialParticipation?.description || ''
  });

  // Fetch participations if not passed in state (e.g. direct URL or refresh)
  React.useEffect(() => {
    if (!initialParticipation) {
      fetchMyParticipations();
    }
  }, []);

  // Update form if participation data is found
  React.useEffect(() => {
    const found = myParticipations.find(p => (p.contest?._id || p.contest) === contestId);
    if (found && !initialParticipation) {
      setFormData({
        submissionLink: found.submissionLink || '',
        description: found.description || ''
      });
    }
  }, [myParticipations, contestId]);

  const isUpdate = initialParticipation?.submissionLink || myParticipations.some(p => (p.contest?._id || p.contest) === contestId);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.submissionLink.trim()) {
      alert("Please provide a submission link.");
      return;
    }

    const result = await submitProject(contestId, formData.submissionLink, formData.description);
    
    if (result.success) {
      alert(isUpdate ? "Project updated successfully!" : "Project submitted successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        {/* Abstract background decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="mb-10">
            <button 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold text-sm mb-6 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
              {isUpdate ? 'Update Submission' : 'Project Submission'}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {contest?.contestTitle || (isUpdate ? 'Update Submission' : 'Contest Submission')}
            </h1>
            <p className="text-gray-500 mt-2 max-w-xl">
              {isUpdate ? "Feeling a bit more inspired? You can update your submission link or description anytime." : "Showcase your brilliance. Provide your project's live link or GitHub repository details below."}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit} className="!p-0 !shadow-none !bg-transparent !max-w-none">
            <div className="space-y-6">
              <Input 
                label="GitHub / Live Project Link" 
                type="url" 
                name="submissionLink"
                value={formData.submissionLink}
                onChange={handleChange}
                placeholder="https://github.com/username/project-repo" 
                required
                className="!py-4 !rounded-2xl"
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-gray-800 placeholder:text-gray-400 font-medium text-[15px] min-h-[150px] resize-none"
                  placeholder="Tell us about your project, the tech stack used, and any unique features..."
                  required
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full md:w-auto px-12 py-4 bg-purple-600 hover:bg-purple-700 text-[15px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-600/20 active:scale-95 transition-transform"
                >
                  {loading ? (isUpdate ? "Updating..." : "Submitting...") : (isUpdate ? "Update Project" : "Submit Project")}
                  {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-12 bg-gray-50 rounded-[32px] p-8 border border-dashed border-gray-200">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Important Note
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          Ensure your GitHub repository is public or has granted access to our evaluation team. Submissions made after the deadline will not be considered. You can update your submission as many times as you like before the contest expires.
        </p>
      </div>
    </div>
  );
}
