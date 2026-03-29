import { useAuthContext } from '../context/AuthContext';
import Button from '../components/Button';

export default function UserDashboard() {
  const { user } = useAuthContext();
  const displayName = user?.userName || user?.name || 'User';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#8cc63f] to-[#609918] rounded-3xl p-8 text-white shadow-xl mb-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 right-24 w-48 h-48 bg-black/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 md:flex md:items-center md:justify-between">
          <div>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm mb-4 inline-block">
              Student Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">Welcome back, {displayName}! 👋</h1>
            <p className="text-white/80 max-w-xl text-sm sm:text-base">
              Ready for your next challenge? You have 2 upcoming contests. Compete, learn, and grow your ranking!
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end">
             <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/20 text-center min-w-[140px]">
                <p className="text-xs uppercase tracking-wider text-white/70 font-bold mb-1">Global Rank</p>
                <h3 className="text-3xl font-black text-[#fcb900] drop-shadow-sm">#42</h3>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Contests Joined', value: '12', icon: '🎯' },
              { label: 'Total Score', value: '8,450', icon: '⭐' },
              { label: 'Win Rate', value: '18%', icon: '🏆' },
              { label: 'Certificates', value: '3', icon: '🎓' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-[#8cc63f]/50 transition-colors">
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</span>
                <h4 className="font-black text-2xl text-gray-800">{stat.value}</h4>
                <p className="text-xs text-gray-500 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Enrolled Contests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active & Upcoming</h2>
              <button className="text-sm font-bold text-[#8cc63f] hover:text-[#609918]">Browse All</button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'React Advance Hackathon', date: 'Starts in 2 days', tags: ['Frontend', 'React'], status: 'Registered' },
                { name: 'Data Structure Sprint', date: 'Starts in 5 days', tags: ['Backend', 'Algorithms'], status: 'Registered' },
              ].map((contest, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{contest.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {contest.date}
                      </span>
                      <div className="flex gap-1">
                        {contest.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" className="whitespace-nowrap shadow-sm font-semibold border-gray-200 py-2">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           {/* Progress Tracker */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Skill Progress</h3>
              <div className="space-y-5">
                {[
                  { skill: 'React.js', progress: 85, color: 'bg-blue-500' },
                  { skill: 'JavaScript', progress: 92, color: 'bg-yellow-400' },
                  { skill: 'CSS / UI', progress: 78, color: 'bg-pink-500' },
                  { skill: 'Node.js', progress: 45, color: 'bg-green-500' },
                ].map(item => (
                  <div key={item.skill}>
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                      <span>{item.skill}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Recommended Banner */}
           <div className="bg-[#fff9e6] rounded-2xl shadow-sm border border-[#fcb900]/30 p-6 relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-500 text-9xl">🏆</div>
              <h3 className="font-bold text-gray-900 mb-2">New Certification Path</h3>
              <p className="text-sm text-gray-600 mb-5 text-balance relative z-10">Complete the "Full Stack Master" series to earn a verified Desun badge.</p>
              <Button variant="primary" className="w-full font-bold shadow-sm relative z-10 py-2.5 bg-[#fcb900] hover:bg-[#e6a800] text-gray-900">
                Start Path
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
