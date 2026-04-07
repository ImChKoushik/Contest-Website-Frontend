import React, { useState } from 'react';
import useTeam from '../hooks/useTeam';
import Button from './Button';
import Input from './Input';
import { useToast } from '../context/ToastContext';

export default function InviteModal({ team, isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const { inviteUser, loading } = useTeam();
  const { showToast } = useToast();

  const addEmail = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedEmail = email.trim().replace(',', '');
      if (trimmedEmail && !emails.includes(trimmedEmail)) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
          setEmails([...emails, trimmedEmail]);
          setEmail('');
        } else {
          showToast("Invalid email format", "error");
        }
      }
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    
    // Add the current input if it's a valid email and not already added
    let currentEmails = [...emails];
    const trimmedInput = email.trim();
    if (trimmedInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedInput) && !emails.includes(trimmedInput)) {
      currentEmails.push(trimmedInput);
    }

    if (currentEmails.length === 0) {
      showToast("Please add at least one email", "error");
      return;
    }

    let successCount = 0;
    for (const emailToInvite of currentEmails) {
      const { success } = await inviteUser(team._id, emailToInvite);
      if (success) successCount++;
    }

    if (successCount > 0) {
      setEmail('');
      setEmails([]);
      showToast(`Successfully sent ${successCount} invitation(s)`, "success");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">Invite Members</h2>
            <p className="text-gray-500 text-sm mt-1">To <span className="font-bold text-[#8cc63f]">{team.teamName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Team Capacity</label>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {team.members?.map((m, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden">
                  {m.userName?.substring(0, 2).toUpperCase()}
                </div>
              ))}
              {emails.map((_, i) => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#8cc63f]/20 flex items-center justify-center text-[10px] font-black text-[#8cc63f]">
                   +
                 </div>
              ))}
            </div>
            <span className="text-xs font-bold text-gray-400">
              {team.members?.length + emails.length} / {team.contest?.teamSize || '∞'}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <Input 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onKeyDown={addEmail}
              placeholder="Type email and press Enter..."
              autoFocus
            />
            
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {emails.map((e, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-[#8cc63f]/10 text-[#8cc63f] px-3 py-1.5 rounded-full text-[11px] font-bold border border-[#8cc63f]/20 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    {e}
                    <button type="button" onClick={() => removeEmail(e)} className="hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} type="button" variant="secondary" className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-200">
              {loading ? "Sending..." : emails.length > 1 ? `Send ${emails.length} Invites` : "Send Invite"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
