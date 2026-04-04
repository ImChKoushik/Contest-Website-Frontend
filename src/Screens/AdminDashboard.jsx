import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import useFetchUsers from '../hooks/useFetchUsers';
import useContests from '../hooks/useContests';
import useParticipation from '../hooks/useParticipation';

export default function AdminDashboard() {
  const { user } = useAuthContext();
  const displayName = user?.userName || user?.name || 'Admin';
  const navigate = useNavigate();
  const { data: usersData, loading: usersLoading } = useFetchUsers();
  const { data: contestsData, loading: contestsLoading } = useContests();
  const { fetchAllParticipants, participantsData, loading: participantsLoading } = useParticipation();

  React.useEffect(() => {
    fetchAllParticipants();
  }, []);
  
  const totalUsersValue = usersLoading ? '...' : (usersData?.total || 0);
  const totalContestsValue = contestsLoading ? '...' : (contestsData?.total || 0);
  const activeContestsCount = contestsLoading ? '...' : (contestsData?.contests?.filter(c => c.status === 'Active').length || 0);
  const totalParticipantsValue = participantsLoading ? '...' : (participantsData?.total || 0);

  const stats = [
    { label: 'Total Users', value: totalUsersValue, change: '+12%', color: 'from-[#8cc63f] to-[#7ab033]', link: '/admin-dashboard/total-users' },
    { label: 'Active Contests', value: activeContestsCount, change: '+2', color: 'from-[#fcb900] to-[#e6a800]' },
    { label: 'Total Participants', value: totalParticipantsValue, change: 'Joined', color: 'from-purple-500 to-indigo-600', link: '/admin-dashboard/total-participants' },
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
            <button className="text-sm font-semibold text-[#8cc63f] hover:text-[#7ab033]">View All →</button>
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
                ) : contestsData?.contests?.length > 0 ? (
                  contestsData.contests.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{item.contestTitle}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'Active' ? 'bg-[#8cc63f]/10 text-[#7ab033]' : 
                          item.status === 'Upcoming' ? 'bg-[#fcb900]/10 text-[#e6a800]' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{item.limit} Units</td>
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

        {/* Quick Actions / Activity Feed - takes 1 column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { title: 'New User Registered', desc: 'Alice Johnson joined...', time: '5m ' },
              { title: 'Contest Completed', desc: 'UI/UX Design Sprint finalized.', time: '2h ' },
              { title: 'Prize Claimed', desc: 'Bob Smith claimed his prize.', time: '4h ' },
              { title: 'Support Ticket', desc: 'Login issue reported by #4592.', time: '1d ' },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {idx !== 3 && <div className="absolute top-8 bottom-[-24px] left-[11px] w-[2px] bg-gray-100"></div>}
                <div className="w-6 h-6 rounded-full bg-[#8cc63f]/20 flex-shrink-0 flex items-center justify-center relative z-10 border-2 border-white">
                   <div className="w-2 h-2 rounded-full bg-[#8cc63f]"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">{activity.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{activity.desc}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{activity.time} ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
