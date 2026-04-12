import React from 'react';
import Button from './Button';

/**
 * ParticipantsModal - A versatile modal for administrators to view:
 * 1. All teams/users in a specific contest (type: 'contest')
 * 2. All contests joined by a specific user (type: 'user')
 */
export default function ParticipantsModal({ isOpen, onClose, title, data, loading, type, userId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="bg-white rounded-[40px] w-full max-w-4xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight truncate max-w-2xl">{title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#8cc63f]"></span>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                {type === 'contest' ? 'Squad Registry' : 'Participation History'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-md transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-[#8cc63f] rounded-full animate-spin"></div>
              <p className="text-gray-400 font-bold text-xs tracking-[0.2em] uppercase animate-pulse">Synchronizing Data Registry...</p>
            </div>
          ) : data && (type === 'contest' ? data.teams?.length > 0 : data.participatedContests?.length > 0) ? (
            <div className="overflow-x-auto border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                    <th className="p-6">{type === 'contest' ? 'Team Details' : 'Contest Context'}</th>
                    <th className="p-6">{type === 'contest' ? 'Leader Info' : 'Participant Role'}</th>
                    <th className="p-6">{type === 'contest' ? 'Squad Composition' : 'Approval Status'}</th>
                    <th className="p-6 text-right">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {type === 'contest' ? (
                    data.teams.map((team) => (
                      <tr key={team._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-6">
                          <span className="font-bold text-gray-900 block group-hover:text-[#8cc63f] transition-colors">{team.teamName}</span>
                          <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{team._id.slice(-12)}</span>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-xs">{team.leader?.userName || 'Anonymous'}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{team.leader?.email}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {team.members?.length > 0 ? (
                              team.members.map((m, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-200">
                                  {m.userName || 'User'}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-300 italic text-[11px] font-medium tracking-tight">Solo Entry</span>
                            )}
                          </div>
                        </td>
                        <td className="p-6 text-right text-gray-500 font-bold text-xs uppercase tracking-tighter">
                          {new Date(team.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    data.participatedContests.map((participation) => (
                      <tr key={participation._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-6">
                          <span className="font-bold text-gray-900 block group-hover:text-[#8cc63f] transition-colors">{participation.contest?.contestTitle || 'Unknown Contest'}</span>
                          <span className="text-[10px] text-[#8cc63f] font-black uppercase tracking-widest leading-none mt-1 inline-block">
                            {participation.contest?.category || 'General'}
                          </span>
                        </td>
                        <td className="p-6">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                             String(participation.leader?._id || participation.leader) === String(userId) 
                               ? 'bg-[#8cc63f]/10 text-[#8cc63f] border-[#8cc63f]/20' 
                               : 'bg-blue-50 text-blue-600 border-blue-100'
                           }`}>
                             {String(participation.leader?._id || participation.leader) === String(userId) ? 'Team Leader' : 'Collaborator'}
                           </span>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${
                               participation.approvalStatus === 'Approved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                               participation.approvalStatus === 'Rejected' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                               'bg-yellow-500 animate-pulse'
                             }`}></div>
                             <span className={`text-[11px] font-black uppercase tracking-tight ${
                               participation.approvalStatus === 'Approved' ? 'text-green-600' :
                               participation.approvalStatus === 'Rejected' ? 'text-red-600' :
                               'text-yellow-600'
                             }`}>
                               {participation.approvalStatus || 'Pending'}
                             </span>
                           </div>
                        </td>
                        <td className="p-6 text-right text-gray-500 font-bold text-xs uppercase tracking-tighter">
                          {new Date(participation.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-[40px] bg-gray-50 flex items-center justify-center mb-8 border border-gray-100 text-gray-300 group hover:scale-110 transition-transform duration-500">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Registry is Empty</h3>
              <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto leading-relaxed">
                We couldn't locate any active participation records for this {type} in the database at this time.
              </p>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
           <Button onClick={onClose} variant="secondary" className="px-12 py-3 rounded-2xl shadow-sm font-black uppercase text-[10px] tracking-widest bg-white border-2 border-gray-100 hover:border-gray-200">
             Close Registry
           </Button>
        </div>
      </div>
    </div>
  );
}
