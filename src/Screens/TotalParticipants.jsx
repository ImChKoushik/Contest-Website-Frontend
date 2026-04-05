import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useParticipation from '../hooks/useParticipation';
import useResults from '../hooks/useResults';
import Button from '../components/Button';

export default function TotalParticipants() {
  const { fetchAllParticipants, participantsData, loading, error } = useParticipation();
  const { uploadResult, loading: resultLoading } = useResults();
  const navigate = useNavigate();
  const [selectedParticipation, setSelectedParticipation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Result form state
  const [resultForm, setResultForm] = useState({
    rank: 'Participant',
    score: 0,
    remarks: ''
  });

  useEffect(() => {
    fetchAllParticipants();
  }, []);

  const openModal = (participation) => {
    setSelectedParticipation(participation);
    setResultForm({
      rank: 'Participant',
      score: participation.score || 0,
      remarks: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParticipation(null);
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParticipation) return;

    const contestId = selectedParticipation.contest?._id || selectedParticipation.contest?.id || selectedParticipation.contest;
    const userId = selectedParticipation.user?._id || selectedParticipation.user?.id || selectedParticipation.user;
    const participationId = selectedParticipation._id || selectedParticipation.id;

    const resultData = {
      contestId: contestId,
      results: [
        {
          userId: userId,
          rank: resultForm.rank,
          score: resultForm.score,
          remarks: resultForm.remarks
        }
      ]
    };

    const { success, message } = await uploadResult(resultData);
    if (success) {
      alert("Result Recorded Successfully!");
      closeModal();
      fetchAllParticipants(); // Refresh to show score if updated
    } else {
      alert(message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Total Participants</h1>
            <p className="text-gray-500 mt-1">View participation details and contest submissions.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center border border-red-100 font-medium">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">
              Participation Database ({participantsData?.total || 0})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Participation ID</th>
                  <th className="p-4 font-semibold">User Name</th>
                  <th className="p-4 font-semibold">Contest Title</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Submission Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {participantsData?.data?.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-gray-400">
                      <button 
                        onClick={() => openModal(p)}
                        className="hover:text-purple-600 hover:underline transition-all"
                      >
                        {p._id}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{p.user?.userName || 'N/A'}</div>
                      <div className="text-[11px] text-gray-400">{p.user?.email}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{p.contest?.contestTitle || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.submissionStatus === 'Submitted' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {p.submissionStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : '---'}
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        onClick={() => openModal(p)}
                        variant="secondary" 
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 border-none"
                      >
                        {p.submissionStatus === 'Submitted' ? 'Grade Work' : 'View Details'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!participantsData?.data || participantsData.data.length === 0) && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                      No participation history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedParticipation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Participation Details</h2>
                <p className="text-sm text-gray-400 font-mono mt-1">ID: {selectedParticipation._id}</p>
              </div>
              <button 
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-10">
              {/* User Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-lg">U</div>
                   <h3 className="font-bold text-gray-800">User Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Full Name</p>
                    <p className="font-bold text-gray-800">{selectedParticipation.user?.userName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Email Address</p>
                    <p className="font-bold text-gray-800">{selectedParticipation.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Contact</p>
                    <p className="font-bold text-gray-800">{selectedParticipation.user?.contact || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Gender</p>
                    <p className="font-bold text-gray-800 capitalize">{selectedParticipation.user?.gender || 'N/A'}</p>
                  </div>
                </div>
              </section>

              {/* Contest Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-[#8cc63f]/10 flex items-center justify-center text-[#8cc63f] font-bold text-lg">C</div>
                   <h3 className="font-bold text-gray-800">Contest Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <div className="md:col-span-2">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Title</p>
                    <p className="font-bold text-gray-800 text-lg">{selectedParticipation.contest?.contestTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Category</p>
                    <p className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[11px] font-black uppercase">{selectedParticipation.contest?.category || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Status</p>
                    <p className="font-bold text-gray-800">{selectedParticipation.contest?.status || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedParticipation.contest?.contestDescription || 'No description provided.'}</p>
                  </div>
                </div>
              </section>

              {/* Submission Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold text-lg">S</div>
                   <h3 className="font-bold text-gray-800">Submission Details</h3>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                          selectedParticipation.submissionStatus === 'Submitted' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {selectedParticipation.submissionStatus || 'Pending'}
                        </span>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Submission Date</p>
                        <p className="font-bold text-gray-800">{selectedParticipation.submittedAt ? new Date(selectedParticipation.submittedAt).toLocaleString() : '---'}</p>
                     </div>
                  </div>
                  
                  {selectedParticipation.submissionLink && (
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Live/GitHub Link</p>
                      <a href={selectedParticipation.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold break-all">
                        {selectedParticipation.submissionLink}
                      </a>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Project Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{selectedParticipation.description || 'No description provided with this submission.'}"
                    </p>
                  </div>
                </div>
              </section>

              {/* Result Recording Form (Admin Only) */}
              {selectedParticipation.submissionStatus === 'Submitted' && (
                <section className="animate-in slide-in-from-bottom duration-500">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold text-lg">R</div>
                    <h3 className="font-bold text-gray-800">Evaluate & Record Result</h3>
                  </div>
                  <form onSubmit={handleResultSubmit} className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Award Rank</label>
                        <select 
                          value={resultForm.rank}
                          onChange={(e) => setResultForm({...resultForm, rank: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm font-bold text-gray-700"
                        >
                          <option value="1st">🥇 1st Place</option>
                          <option value="2nd">🥈 2nd Place</option>
                          <option value="3rd">🥉 3rd Place</option>
                          <option value="Participant">🏆 Participant</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Final Score (0-100)</label>
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          value={resultForm.score}
                          onChange={(e) => setResultForm({...resultForm, score: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm font-bold text-gray-700"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Internal Remarks</label>
                      <textarea 
                        value={resultForm.remarks}
                        onChange={(e) => setResultForm({...resultForm, remarks: e.target.value})}
                        placeholder="Add some feedback or internal notes..."
                        className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm font-medium text-gray-700 min-h-[100px] resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={resultLoading}
                      className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-purple-200"
                    >
                      {resultLoading ? "Submitting Result..." : "Finalize & Record Result"}
                    </Button>
                  </form>
                </section>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-50 flex justify-end gap-3 sticky bottom-0 bg-white/80 backdrop-blur-md">
              <Button onClick={closeModal} variant="outline" className="px-6 border-gray-200">Close Panel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
