import React, { useMemo, useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import useFetchUsers from '../hooks/useFetchUsers';
import useContests from '../hooks/useContests';
import useTeam from '../hooks/useTeam';
import useInvite from '../hooks/useInvite';
import useResults from '../hooks/useResults';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// Helper for "X time ago" format
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

export default function AdminDashboard() {
  const { user } = useAuthContext();
  const displayName = user?.userName || user?.name || 'Admin';
  const navigate = useNavigate();
  const { data: usersData, loading: usersLoading } = useFetchUsers();
  const { data: contestsData, loading: contestsLoading } = useContests();
  const { viewAllTeams, loading: teamLoading } = useTeam();
  const { fetchAllResults, allResults, loading: resultsFetchingLoading } = useResults();

  const [teamsData, setTeamsData] = useState([]);
  const [invitesData, setInvitesData] = useState([]);
  const [invitesLoading, setInvitesLoading] = useState(false);

  const { getAllInvites, deleteInvite } = useInvite();

  const fetchTeams = async () => {
    const { success, data } = await viewAllTeams();
    if (success) setTeamsData(data || []);
  };

  useEffect(() => {
    const fetchInvites = async () => {
      setInvitesLoading(true);
      const { success, data } = await getAllInvites();
      if (success) setInvitesData(data?.invites || []);
      setInvitesLoading(false);
    };
    fetchTeams();
    fetchInvites();
    fetchAllResults();
  }, [viewAllTeams, getAllInvites, fetchAllResults]);

  const handleDeleteInvite = async (id) => {
    if (window.confirm("Delete this invitation?")) {
      const { success } = await deleteInvite(id);
      if (success) {
        setInvitesData(prev => prev.filter(i => i._id !== id));
      }
    }
  };
  
  const totalUsersValue = usersLoading ? '...' : (usersData?.total || 0);
  const totalContestsValue = contestsLoading ? '...' : (contestsData?.total || 0);
  const activeContestsCount = contestsLoading ? '...' : (contestsData?.contests?.filter(c => c.status === 'On-Going').length || 0);
  const totalTeamsValue = teamLoading ? '...' : (teamsData.length || 0);
  const totalResultsValue = resultsFetchingLoading ? '...' : (allResults?.length || 0);

  // Observations Chart Data Processing
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        month: d.getMonth(),
        year: d.getFullYear(),
        name: months[d.getMonth()],
        Users: 0,
        Contests: 0,
        Teams: 0
      });
    }

    // Process Users
    if (Array.isArray(usersData?.users)) {
      usersData.users.forEach(u => {
        const uDate = new Date(u.createdAt);
        const match = last6Months.find(m => m.month === uDate.getMonth() && m.year === uDate.getFullYear());
        if (match) match.Users++;
      });
    }

    // Process Contests
    if (Array.isArray(contestsData?.contests)) {
      contestsData.contests.forEach(c => {
        const cDate = new Date(c.createdAt);
        const match = last6Months.find(m => m.month === cDate.getMonth() && m.year === cDate.getFullYear());
        if (match) match.Contests++;
      });
    }

    // Process Teams
    if (Array.isArray(teamsData)) {
      teamsData.forEach(t => {
        const tDate = new Date(t.createdAt);
        const match = last6Months.find(m => m.month === tDate.getMonth() && m.year === tDate.getFullYear());
        if (match) match.Teams++;
      });
    }

    return last6Months;
  }, [usersData, contestsData, teamsData]);

  // Aggregate and sort activity feed
  const activities = useMemo(() => {
    const list = [];
    
    // Recent Users
    if (Array.isArray(usersData?.users)) {
      usersData.users.slice(0, 5).forEach(u => {
        list.push({
          id: `u-${u._id}`,
          title: 'New User Registered',
          desc: `${u.userName} joined the platform.`,
          time: getTimeAgo(u.createdAt),
          date: new Date(u.createdAt)
        });
      });
    }

    // Recent Contests
    if (Array.isArray(contestsData?.contests)) {
      contestsData.contests.slice(0, 5).forEach(c => {
        list.push({
          id: `c-${c._id}`,
          title: 'New Contest Launched',
          desc: `${c.contestTitle} is now live!`,
          time: getTimeAgo(c.createdAt),
          date: new Date(c.createdAt)
        });
      });
    }

    // Recent Teams
    if (Array.isArray(teamsData)) {
      teamsData.slice(0, 5).forEach(team => {
        list.push({
          id: `t-${team._id}`,
          title: 'New Team Formed',
          desc: `${team.teamName} (Leader: ${team.leader?.userName || 'User'}) joined ${team.contest?.contestTitle || 'a contest'}.`,
          time: getTimeAgo(team.createdAt),
          date: new Date(team.createdAt)
        });
      });
    }

    return list.sort((a, b) => b.date - a.date).slice(0, 8);
  }, [usersData, contestsData, teamsData]);

  const stats = [
    { label: 'Total Users', value: totalUsersValue, change: '+12%', color: 'from-[#8cc63f] to-[#7ab033]', link: '/admin-dashboard/total-users' },
    { label: 'Active Contests', value: activeContestsCount, change: '+2', color: 'from-[#fcb900] to-[#e6a800]' },
    { label: 'Total Teams', value: totalTeamsValue, change: 'Submissions', color: 'from-purple-500 to-indigo-600', link: '/admin-dashboard/total-participants' },
    { label: 'Total Results', value: totalResultsValue, change: 'Leaderboard', color: 'from-pink-500 to-rose-600', link: '/admin-dashboard/total-results' },
    { label: 'Total Invites', value: invitesData.length, change: 'Registry', color: 'from-orange-400 to-red-500', link: '/admin-dashboard/total-invites' },
    { label: 'Total Contests', value: totalContestsValue, change: 'All time', color: 'from-blue-500 to-blue-600', link: '/admin-dashboard/total-contests' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Enhanced Header Section */}
      <div className="mb-10 bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8cc63f]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#8cc63f] text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg shadow-[#8cc63f]/20">Administrator Account</span>
              <div className="h-px w-8 bg-white/20"></div>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none">Status: Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 font-display">
              You're an <span className="text-[#8cc63f]">Admin</span>.
            </h1>
            <p className="text-gray-400 text-lg max-w-xl font-medium leading-relaxed">
              Welcome back, {displayName}. You have full control over contests, participants, and platform results.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate("/admin-dashboard/total-participants")}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-2 group"
            >
              View Teams
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-[#8cc63f] group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button 
              onClick={() => navigate("/admin-dashboard/add-contest")}
              className="bg-[#8cc63f] hover:bg-[#7ab033] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#8cc63f]/20 hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
              + New Contest
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => stat.link && navigate(stat.link)}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl ${stat.link ? 'cursor-pointer' : ''}`}
          >
            <p className="font-medium text-white/80 mb-2 truncate">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-black">{stat.value}</h2>
              <span className="text-sm font-bold bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Observations Section */}
      <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg text-gray-800">Observations</h3>
            <p className="text-xs text-gray-400">Activity overview across contests, teams, and users.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#8cc63f]"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contests</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teams</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Users</span>
             </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full min-h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#111827' }}
              />
              <Bar dataKey="Contests" fill="#8cc63f" radius={[4, 4, 0, 0]} barSize={34} />
              <Bar dataKey="Teams" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={34} />
              <Bar dataKey="Users" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={34} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Platform Invitations Database */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Platform Invitations Database</h3>
            <button 
              onClick={() => navigate("/admin-dashboard/total-invites")}
              className="text-sm font-semibold text-[#8cc63f] hover:text-[#7ab033]"
            >View All Registry →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                  <th className="p-4 font-black">Sender</th>
                  <th className="p-4 font-black">Receiver</th>
                  <th className="p-4 font-black">Context Team</th>
                  <th className="p-4 font-black">Status</th>
                  <th className="p-4 font-black text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {invitesLoading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading invites...</td></tr>
                ) : invitesData.length > 0 ? (
                  invitesData.slice(0, 8).map((invite) => (
                    <tr key={invite._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-800 text-xs">{invite.sender?.userName || 'N/A'}</div>
                        <div className="text-[10px] text-gray-400">{invite.sender?.email}</div>
                      </td>
                      <td className="p-4 text-gray-600">
                         <div className="font-bold text-gray-800 text-xs">{invite.receiver?.userName || 'N/A'}</div>
                         <div className="text-[10px] text-gray-400">{invite.receiver?.email}</div>
                      </td>
                      <td className="p-4 font-bold text-gray-700 text-xs truncate max-w-[150px]">{invite.team?.teamName || 'Deleted Team'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                          invite.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                          invite.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invite.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteInvite(invite._id)}
                          className="p-1.5 rounded-lg text-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="p-12 text-center text-gray-400 italic">No invitations currently in database.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Contests Table - takes up 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Recent Contests</h3>
            <button 
              onClick={() => navigate("/admin-dashboard/total-contests")}
              className="text-sm font-semibold text-[#8cc63f] hover:text-[#7ab033]"
            >View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Contest Name</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Participants</th>
                  <th className="p-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {contestsLoading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400 font-medium italic">Loading contest data...</td>
                  </tr>
                ) : Array.isArray(contestsData?.contests) && contestsData.contests.length > 0 ? (
                  contestsData.contests.slice(0, 5).map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{item.contestTitle}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'On-Going' ? 'bg-[#8cc63f]/10 text-[#7ab033]' : 
                          item.status === 'Upcoming' ? 'bg-[#fcb900]/10 text-[#e6a800]' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{item.entryLimit} Units</td>
                      <td className="p-4 text-gray-500">{new Date(item.contestDeadLine).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                   <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400 font-medium italic">No contests launched yet. Launch your first one today!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Activity Feed - takes 1 column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-6 font-display">Recent Activity</h3>
          <div className="space-y-6">
            {activities.length > 0 ? (
              activities.map((activity, idx) => (
                <div key={activity.id} className="flex gap-4 relative group">
                  {idx !== activities.length - 1 && (
                    <div className="absolute top-8 bottom-[-24px] left-[11px] w-[2px] bg-gray-50 group-hover:bg-[#8cc63f]/10 transition-colors"></div>
                  )}
                  <div className="w-6 h-6 rounded-full bg-[#8cc63f]/20 flex-shrink-0 flex items-center justify-center relative z-10 border-2 border-white transition-transform group-hover:scale-110">
                     <div className="w-2 h-2 rounded-full bg-[#8cc63f]"></div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-[13px] text-gray-800 tracking-tight leading-tight">{activity.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 font-medium italic opacity-80 leading-relaxed">{activity.desc}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.1em]">{activity.time} ago</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                 <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-1">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                 </div>
                 <p className="text-gray-400 font-bold text-sm italic">Synchronizing activity feed...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
