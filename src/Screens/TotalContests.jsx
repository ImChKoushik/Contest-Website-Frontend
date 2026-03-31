import { useNavigate } from 'react-router-dom';
import useContests from '../hooks/useContests';
import Button from '../components/Button';

export default function TotalContests() {
  const { data, loading, error, fetchContests } = useContests();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
        <div>
          <button 
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#8cc63f] font-bold text-sm mb-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Dashboard
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Full Contest Registry</h1>
          <p className="text-gray-500 mt-2">Comprehensive view of every specialization challenge in the system.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={fetchContests}
            className="px-5 py-2.5 text-sm font-bold flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh Data
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate("/admin-dashboard/add-contest")}
            className="px-6 py-2.5 text-sm font-bold shadow-lg shadow-[#8cc63f]/20"
          >
            + Create New
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {error && (
          <div className="p-6 bg-red-50 text-red-600 border-b border-red-100 font-medium text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            Error loading contests: {error}
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-[11px] uppercase font-black tracking-[0.1em]">
                <th className="p-6">Internal ID</th>
                <th className="p-6">Contest Details</th>
                <th className="p-6">Category</th>
                <th className="p-6">Status</th>
                <th className="p-6">Metrics</th>
                <th className="p-6 text-right">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#8cc63f] rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-bold text-sm tracking-wide">Syncing with database...</p>
                    </div>
                  </td>
                </tr>
              ) : data?.contests?.length >0 ? (
                data.contests.map((contest, i) => (
                  <tr key={contest._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] font-mono bg-gray-100 text-gray-400 px-2 py-1 rounded group-hover:bg-[#8cc63f]/10 group-hover:text-[#8cc63f] transition-colors">
                          {contest._id}
                        </code>
                      </div>
                    </td>
                    <td className="p-6">
                      <div>
                        <h4 className="font-bold text-gray-900 text-[15px] mb-0.5">{contest.contestTitle}</h4>
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{contest.contestDescription}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[13px] font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                        {contest.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                        <span className={`w-2 h-2 rounded-full ${
                          contest.status === 'Active' ? 'bg-[#8cc63f]' : 
                          contest.status === 'Upcoming' ? 'bg-[#fcb900]' : 
                          'bg-gray-300'
                        }`}></span>
                        <span className={
                          contest.status === 'Active' ? 'text-[#7ab033]' : 
                          contest.status === 'Upcoming' ? 'text-[#e6a800]' : 
                          'text-gray-500'
                        }>{contest.status}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-extrabold text-gray-800">{contest.limit}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Slot Limit</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[13px] font-bold text-gray-700">
                          {new Date(contest.contestDeadLine).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                         <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {new Date(contest.contestDeadLine).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Registry is empty</h3>
                      <p className="text-gray-500 text-[15px] max-w-[300px]">No contests found in the database. Launch your first one to populate the list.</p>
                      <Button variant="primary" onClick={() => navigate("/admin-dashboard/add-contest")} className="mt-4 px-8">Launch Contest</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
