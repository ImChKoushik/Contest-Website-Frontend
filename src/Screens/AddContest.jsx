import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import useContests from '../hooks/useContests';
import { useToast } from '../context/ToastContext';

const CATEGORY_OPTIONS = ["MERN", "UI/UX DESIGN", "DIGITAL MARKETING", "WEBSITE DESIGNING"];
const STATUS_OPTIONS = ["Upcoming", "On-Going", "Completed"];
const PROJECT_TYPE_OPTIONS = ["Individual", "Team", "Both"];

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
  const [pdfFile, setPdfFile] = useState(null);

  // Rule Sections state: [{ title: '', points: [''] }]
  const [ruleSections, setRuleSections] = useState([
    { title: '', points: [''] }
  ]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      showToast('Please select a valid PDF file.', 'error');
    }
  };

  // --- Rule Section Handlers ---
  const addSection = () => {
    setRuleSections([...ruleSections, { title: '', points: [''] }]);
  };

  const removeSection = (sIdx) => {
    setRuleSections(ruleSections.filter((_, i) => i !== sIdx));
  };

  const updateSectionTitle = (sIdx, title) => {
    const updated = [...ruleSections];
    updated[sIdx].title = title;
    setRuleSections(updated);
  };

  const addPoint = (sIdx) => {
    const updated = [...ruleSections];
    updated[sIdx].points.push('');
    setRuleSections(updated);
  };

  const removePoint = (sIdx, pIdx) => {
    const updated = [...ruleSections];
    updated[sIdx].points = updated[sIdx].points.filter((_, i) => i !== pIdx);
    setRuleSections(updated);
  };

  const updatePoint = (sIdx, pIdx, value) => {
    const updated = [...ruleSections];
    updated[sIdx].points[pIdx] = value;
    setRuleSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      dataToSend.append(key, formData[key]);
    });

    if (imageFile) dataToSend.append('image', imageFile);       // backend multer field: "image"
    if (pdfFile) dataToSend.append('pdf', pdfFile);             // backend multer field: "pdf"

    // Serialize ruleSections as JSON string (backend needs to parse it)
    const validSections = ruleSections.filter(s => s.title.trim() && s.points.some(p => p.trim()));
    dataToSend.append('ruleSections', JSON.stringify(validSections));

    const result = await addContest(dataToSend);
    if (result) {
      showToast("Contest Created Successfully!", "success");
      navigate("/admin-dashboard/total-contests");
    }
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-primary)] focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] font-medium text-[15px]";
  const labelClass = "block text-sm font-black text-[var(--text-primary)] mb-2 uppercase tracking-wider";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-[var(--card-bg)] rounded-[40px] p-8 md:p-12 shadow-premium border border-[var(--border-primary)] transition-all">

        {/* Page Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[#8cc63f] font-bold text-sm mb-6 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Create New Contest</h1>
          <p className="text-[var(--text-secondary)] mt-2 font-medium">Fill in the details, upload assets, and define the rule set.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 text-red-500 rounded-2xl text-sm font-medium border border-red-500/20 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="!p-0 !shadow-none !bg-transparent !max-w-none">
          <div className="space-y-8">

            {/* ─── SECTION 1: Core Details ─── */}
            <div>
              <p className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--accent-green)]/10 flex items-center justify-center text-xs">1</span>
                Core Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Contest Title</label>
                  <input className={inputClass} type="text" name="contestTitle" value={formData.contestTitle} onChange={handleChange} placeholder="e.g., Frontend Master Challenge 2026" required />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Contest Description</label>
                  <textarea name="contestDescription" value={formData.contestDescription} onChange={handleChange} className={`${inputClass} min-h-[120px] resize-none`} placeholder="Briefly describe the contest objectives..." required />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Project Briefing</label>
                  <textarea name="projectBriefing" value={formData.projectBriefing} onChange={handleChange} className={`${inputClass} min-h-[180px] resize-none`} placeholder="Provide a detailed project briefing for participants..." required />
                </div>
              </div>
            </div>

            {/* ─── SECTION 2: Settings ─── */}
            <div>
              <p className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--accent-green)]/10 flex items-center justify-center text-xs">2</span>
                Contest Settings
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Submission Deadline</label>
                  <input className={inputClass} type="datetime-local" name="contestDeadLine" value={formData.contestDeadLine} onChange={handleChange} required />
                </div>

                <div>
                  <label className={labelClass}>Contest Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={`${inputClass} cursor-pointer appearance-none`} required>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Project Type</label>
                  <select name="projectType" value={formData.projectType} onChange={handleChange} className={`${inputClass} cursor-pointer appearance-none`} required>
                    {PROJECT_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Initial Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={`${inputClass} cursor-pointer appearance-none`} required>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {['Team', 'Both'].includes(formData.projectType) && (
                  <div>
                    <label className={labelClass}>Max Team Size</label>
                    <input className={inputClass} type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} min="2" required />
                  </div>
                )}

                <div>
                  <label className={labelClass}>Participant/Team Limit</label>
                  <input className={inputClass} type="number" name="entryLimit" value={formData.entryLimit} onChange={handleChange} min="1" required />
                </div>
              </div>
            </div>

            {/* ─── SECTION 3: Media Uploads ─── */}
            <div>
              <p className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--accent-green)]/10 flex items-center justify-center text-xs">3</span>
                Media & Documents
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Image */}
                <div>
                  <label className={labelClass}>Cover Image</label>
                  <div
                    className="relative h-48 rounded-3xl overflow-hidden bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-primary)] hover:border-[#8cc63f] transition-all flex flex-col items-center justify-center cursor-pointer group"
                    onClick={() => document.getElementById('contestImage').click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-[var(--text-secondary)] group-hover:text-[#8cc63f] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-[11px] font-black uppercase tracking-widest text-center px-4">Click to upload cover image</span>
                        <span className="text-[10px] opacity-60">JPG / PNG / WEBP · Max 5MB</span>
                      </div>
                    )}
                    <input id="contestImage" type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                  </div>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className={labelClass}>Contest PDF Brief</label>
                  <div
                    className="relative h-48 rounded-3xl overflow-hidden bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-primary)] hover:border-[#8cc63f] transition-all flex flex-col items-center justify-center cursor-pointer group"
                    onClick={() => document.getElementById('contestPDF').click()}
                  >
                    {pdfFile ? (
                      <div className="flex flex-col items-center gap-3 px-4 text-center">
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                        <p className="text-sm font-black text-[var(--text-primary)] truncate max-w-[180px]">{pdfFile.name}</p>
                        <p className="text-[10px] text-[var(--accent-green)] font-bold uppercase tracking-wider">PDF Attached ✓</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-[var(--text-secondary)] group-hover:text-[#8cc63f] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-[11px] font-black uppercase tracking-widest text-center px-4">Click to upload PDF brief</span>
                        <span className="text-[10px] opacity-60">PDF only · Max 10MB</span>
                      </div>
                    )}
                    <input id="contestPDF" type="file" onChange={handlePdfChange} className="hidden" accept="application/pdf" />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── SECTION 4: Rule Sections ─── */}
            <div>
              <p className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--accent-green)]/10 flex items-center justify-center text-xs">4</span>
                Rule Sections
              </p>

              <div className="space-y-5">
                {ruleSections.map((section, sIdx) => (
                  <div key={sIdx} className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-primary)] transition-all">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-7 h-7 rounded-full bg-[var(--accent-green)]/10 flex items-center justify-center text-[var(--accent-green)] font-black text-[11px] flex-shrink-0">
                        {sIdx + 1}
                      </div>
                      <input
                        type="text"
                        placeholder={`Section title (e.g., "Submission Rules")`}
                        value={section.title}
                        onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-primary)] focus:border-[#8cc63f] focus:ring-2 focus:ring-[#8cc63f]/10 outline-none text-sm font-bold text-[var(--text-primary)] placeholder:font-normal placeholder:text-[var(--text-secondary)] transition-all"
                      />
                      {ruleSections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(sIdx)}
                          className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                          title="Remove section"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Points */}
                    <div className="space-y-3 ml-10">
                      {section.points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2 group">
                          <div className="w-2 h-2 rounded-full bg-[var(--accent-green)]/60 flex-shrink-0 mt-0.5"></div>
                          <input
                            type="text"
                            placeholder={`Rule point ${pIdx + 1}...`}
                            value={point}
                            onChange={(e) => updatePoint(sIdx, pIdx, e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-primary)] focus:border-[#8cc63f] focus:ring-2 focus:ring-[#8cc63f]/10 outline-none text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all"
                          />
                          {section.points.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePoint(sIdx, pIdx)}
                              className="w-7 h-7 rounded-full bg-transparent text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addPoint(sIdx)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors mt-2 ml-4"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Point
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Section Button */}
                <button
                  type="button"
                  onClick={addSection}
                  className="w-full py-4 border-2 border-dashed border-[var(--border-primary)] rounded-3xl text-[var(--text-secondary)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Rule Section
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-[var(--border-primary)]">
              <Button type="submit" disabled={loading} className="w-full md:w-auto px-12 py-4 text-[15px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#8cc63f]/20 rounded-2xl">
                {loading ? "Launching Contest..." : "Launch Contest"}
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
  );
}
