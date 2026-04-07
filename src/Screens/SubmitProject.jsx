import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useTeam from '../hooks/useTeam';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import { useToast } from '../context/ToastContext';

export default function SubmitProject() {
  const { contestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addSubmission, getMyTeam, loading, error } = useTeam();
  const { showToast } = useToast();
  
  const contest = location.state?.contest;
  const initialTeam = location.state?.team;

  const [team, setTeam] = useState(initialTeam || null);
  const [formData, setFormData] = useState({
    submissionLink: initialTeam?.submissionLink || '',
    description: '' // Kept for UI, though backend might only track link for now
  });

  useEffect(() => {
    const fetchTeam = async () => {
      if (!team) {
        const { success, data } = await getMyTeam(contestId);
        if (success && data) {
          setTeam(data);
          setFormData(prev => ({
            ...prev,
            submissionLink: data.submissionLink || ''
          }));
        }
      }
    };
    fetchTeam();
  }, [contestId, getMyTeam, team]);

  const isUpdate = team?.submissionStatus === 'Submitted';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.submissionLink.trim()) {
      showToast("Please provide a submission link.", "warning");
      return;
    }

    if (!team?._id) {
      showToast("Team information not found. Try again.", "error");
      return;
    }

    const result = await addSubmission(team._id, formData.submissionLink);
    
    if (result.success) {
      showToast(isUpdate ? "Team submission updated!" : "Team project submitted successfully!", "success");
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        {/* Decorative element matching brand colors */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8cc63f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="mb-10">
            <button 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-400 hover:text-[#8cc63f] font-bold text-sm mb-6 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="inline-block px-3 py-1 bg-[#8cc63f]/10 text-[#8cc63f] rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
              {isUpdate ? 'Update Team Submission' : 'Team Project Submission'}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {contest?.contestTitle || team?.contest?.contestTitle || (isUpdate ? 'Update Submission' : 'Contest Submission')}
            </h1>
            <p className="text-gray-500 mt-2 max-w-xl">
               Team: <span className="font-bold text-gray-800">{team?.teamName || 'Loading...'}</span>
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="!p-0 !shadow-none !bg-transparent !max-w-none">
            <div className="space-y-6">
              <Input 
                label="GitHub / Live Project Link" 
                type="url" 
                name="submissionLink"
                value={formData.submissionLink}
                onChange={handleChange}
                placeholder="https://github.com/team-repo/project" 
                required
                className="!py-4 !rounded-2xl"
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Submission Remarks</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none transition-all text-gray-800 placeholder:text-gray-400 font-medium text-[15px] min-h-[120px] resize-none"
                  placeholder="Tell us about your team's project work..."
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading || !team} 
                  className="w-full md:w-auto px-12 py-4 bg-[#8cc63f] hover:bg-[#7db435] text-[15px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#8cc63f]/20 active:scale-95 transition-transform"
                >
                  {loading ? (isUpdate ? "Updating..." : "Submitting...") : (isUpdate ? "Update Team Project" : "Submit Team Project")}
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

      <div className="mt-12 bg-gray-50 rounded-[32px] p-8 border border-dashed border-gray-200">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#8cc63f]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Important Team Submission Note
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          Submission is made on behalf of the entire team. Only the team leader or authorized members should finalize the submission. Ensure your link is accessible to the judges. Late submissions will not be accepted.
        </p>
      </div>
    </div>
  );
}
