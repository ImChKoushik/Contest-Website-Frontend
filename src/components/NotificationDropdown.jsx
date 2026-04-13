import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useTeam from '../hooks/useTeam';
import useInvite from '../hooks/useInvite';
import useResults from '../hooks/useResults';
import useFetchUsers from '../hooks/useFetchUsers';

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

export default function NotificationDropdown({ isOpen, onClose }) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { viewAllTeams } = useTeam();
  const { getAllInvites, getMyInvites } = useInvite();
  const { fetchMyResults, myResults } = useResults();
  const { data: usersData } = useFetchUsers(user?.role === 'Admin');

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const list = [];

    try {
      if (user.role === 'Admin') {
        // Admin Notifications
        const { success: tSuccess, data: teams } = await viewAllTeams();
        if (tSuccess && Array.isArray(teams)) {
          teams.filter(t => t.approvalStatus === 'Pending').forEach(t => {
            list.push({
              id: `team-${t._id}`,
              type: 'team_request',
              title: 'Pending Approval',
              desc: `Squad "${t.teamName}" is waiting for review.`,
              time: getTimeAgo(t.createdAt),
              rawDate: new Date(t.createdAt),
              link: '/admin-dashboard/total-participants'
            });
          });
        }

        const { success: iSuccess, data: invitesData } = await getAllInvites();
        if (iSuccess && invitesData?.invites) {
          invitesData.invites.slice(0, 5).forEach(i => {
            list.push({
              id: `inv-${i._id}`,
              type: 'invite',
              title: 'Platform Registry',
              desc: `${i.sender?.userName || 'User'} invited ${i.receiver?.userName || 'someone'}.`,
              time: getTimeAgo(i.createdAt),
              rawDate: new Date(i.createdAt),
              link: '/admin-dashboard/total-invites'
            });
          });
        }

        if (usersData?.users) {
           usersData.users.slice(0, 5).forEach(u => {
             list.push({
               id: `user-${u._id}`,
               type: 'user',
               title: 'New User Registered',
               desc: `${u.userName} joined the platform.`,
               time: getTimeAgo(u.createdAt),
               rawDate: new Date(u.createdAt),
               link: '/admin-dashboard/total-users'
             });
           });
        }
      } else {
        // User Notifications
        
        // 1. Team Invitations
        const { success: iSuccess, data: invites } = await getMyInvites();
        if (iSuccess && Array.isArray(invites)) {
          invites.forEach(i => {
            list.push({
              id: `inv-${i._id}`,
              type: 'invite',
              title: 'Co-op Invite',
              desc: `${i.sender?.userName || 'A leader'} wants you in "${i.team?.teamName || 'their squad'}".`,
              time: getTimeAgo(i.createdAt),
              rawDate: new Date(i.createdAt),
              link: '/dashboard'
            });
          });
        }

        // 2. Team Status Updates (Approved/Rejected)
        const { success: myTSuccess, data: myTeams } = await viewAllTeams();
        if (myTSuccess && Array.isArray(myTeams)) {
          myTeams.forEach(t => {
            if (t.approvalStatus === 'Approved' || t.approvalStatus === 'Rejected') {
              list.push({
                id: `status-${t._id}`,
                type: 'result',
                title: `Squad ${t.approvalStatus}`,
                desc: `Your team "${t.teamName}" has been ${t.approvalStatus.toLowerCase()}.`,
                time: getTimeAgo(t.updatedAt || t.createdAt),
                rawDate: new Date(t.updatedAt || t.createdAt),
                link: '/dashboard'
              });
            }

            // 3. Join Requests (If leader)
            if (String(t.leader?._id || t.leader) === String(user?._id) && (t.joinRequests?.length > 0)) {
               t.joinRequests.forEach((req, idx) => {
                 list.push({
                   id: `req-${t._id}-${idx}`,
                   type: 'user',
                   title: 'New Join Request',
                   desc: `Someone wants to join your squad "${t.teamName}".`,
                   time: getTimeAgo(t.updatedAt || t.createdAt),
                   rawDate: new Date(t.updatedAt || t.createdAt),
                   link: '/dashboard'
                 });
               });
            }
          });
        }

        // 4. Results
        const res = await fetchMyResults();
        if (res?.success && Array.isArray(res.data)) {
          res.data.slice(0, 5).forEach(r => {
            list.push({
              id: `res-${r._id}`,
              type: 'result',
              title: 'Contest Result',
              desc: `Ranking for ${r.contest?.contestTitle} is now out!`,
              time: getTimeAgo(r.createdAt),
              rawDate: new Date(r.createdAt),
              link: '/dashboard'
            });
          });
        }
      }
    } catch (err) {
      console.error("Notification aggregation error:", err);
    }

    // Sort by latest and remove duplicates (by ID)
    const uniqueNotifications = Array.from(new Map(list.map(item => [item.id, item])).values());
    setNotifications(uniqueNotifications.sort((a, b) => b.rawDate - a.rawDate).slice(0, 15));
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-16 right-0 w-[320px] md:w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Latest Notifications</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time updates</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-[#8cc63f] bg-[#8cc63f]/10 px-2.5 py-1 rounded-full">{notifications.length} Items</span>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#8cc63f]/20 border-t-[#8cc63f] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Synchronizing...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => {
                  navigate(n.link);
                  onClose();
                }}
                className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-transform group-hover:scale-110 ${
                    n.type === 'team_request' ? 'bg-orange-50 border-orange-100 text-orange-500' :
                    n.type === 'invite' ? 'bg-[#fcb900]/10 border-[#fcb900]/20 text-[#fcb900]' :
                    n.type === 'user' ? 'bg-purple-50 border-purple-100 text-purple-500' :
                    'bg-green-50 border-green-100 text-[#8cc63f]'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      {n.type === 'team_request' && <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.971 5.971 0 00-.941 3.197m0 0l.001.031c0 .225.012.447.038.666M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5Z" />}
                      {n.type === 'invite' && <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />}
                      {n.type === 'result' && <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0V9.452a7.033 7.033 0 0 1 5.14-8.823L13.5 1.125m-3.75 0l-.74 4.092a7.033 7.033 0 0 0 5.14 8.823M9 3.75 20.25 10.5M4.125 12 17.25 1.875" />}
                      {n.type === 'user' && <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />}
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[13px] font-black text-gray-800">{n.title}</h4>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">{n.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center mx-auto mb-4 border border-gray-100">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Inbox is empty</p>
             <p className="text-[10px] text-gray-300 mt-2">Check back later for updates</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
         <button 
           onClick={() => {
             navigate(user.role === 'Admin' ? '/admin-dashboard' : '/dashboard');
             onClose();
           }}
           className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-[#8cc63f] transition-colors"
         >
           View Activity Dashboard
         </button>
      </div>
    </div>
  );
}
