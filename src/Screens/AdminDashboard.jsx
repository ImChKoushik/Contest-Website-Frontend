import React, { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import useFetchUsers from '../hooks/useFetchUsers';
import useContests from '../hooks/useContests';
import useTeam from '../hooks/useTeam';
import useResults from '../hooks/useResults';

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

  const [teamsData, setTeamsData] = React.useState([]);

  React.useEffect(() => {
    const fetchTeams = async () => {
      const { success, data } = await viewAllTeams();
      if (success) setTeamsData(data || []);
    };
    fetchTeams();
    fetchAllResults();
  }, [viewAllTeams]);
  
  const totalUsersValue = usersLoading ? '...' : (usersData?.total || 0);
  const totalContestsValue = contestsLoading ? '...' : (contestsData?.total || 0);
  const activeContestsCount = contestsLoading ? '...' : (contestsData?.contests?.filter(c => c.status === 'On-Going').length || 0);
  const totalTeamsValue = teamLoading ? '...' : (teamsData.length || 0);
  const totalResultsValue = resultsFetchingLoading ? '...' : (allResults?.length || 0);

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
    { label: 'Total Contests', value: totalContestsValue, change: 'All time', color: 'from-blue-500 to-blue-600', link: '/admin-dashboard/total-contests' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, {displayName}. Here's what's happening today.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button variant="secondary" className="px-4 py-2 text-sm font-semibold">Generate Reports</Button>
          <Button variant="primary" onClick={() => navigate("/admin-dashboard/add-contest")} className="px-4 py-2 text-sm font-semibold shadow-md active:scale-95 transition-transform">+ New Contest</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Main Content Area */}
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
