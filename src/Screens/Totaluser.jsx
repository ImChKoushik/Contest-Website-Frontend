import React from 'react';
import useFetchUsers from '../hooks/useFetchUsers';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import useUserActions from '../hooks/useUserActions';
import { useToast } from '../context/ToastContext';
import { useAuthContext } from '../context/AuthContext';

export default function Totaluser() {
  const { data, loading, error, refetch } = useFetchUsers();
  const { deleteUser, getUserById, updateUserRole, loading: actionLoading } = useUserActions();
  const { user: loggedInUser } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }

    const result = await getUserById(searchTerm.trim());
    if (result.success) {
      setSearchResults({ users: [result.data], total: 1 });
    } else {
      showToast(result.message || "User not found with this ID", "error");
      setSearchResults(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (id === loggedInUser?._id) return; // Extra safety
    if (window.confirm(`Are you sure you want to delete user: ${name}?`)) {
      const result = await deleteUser(id);
      if (result.success) {
        showToast(result.message || "User deleted successfully", "success");
        refetch();
      } else {
        showToast(result.message || "Failed to delete user", "error");
      }
    }
  };

  const allUsers = (searchResults || data)?.users || [];
  const admins = allUsers.filter(u => u.role === 'Admin');
  const regularUsers = allUsers.filter(u => u.role !== 'Admin');

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-gray-500 mt-1">Manage administrators and platform participants separately.</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8cc63f] transition-all min-w-[200px]"
            />
            <Button type="submit" variant="secondary" className="px-4 py-2 text-sm font-semibold">Search</Button>
            {searchResults && (
              <Button onClick={() => { setSearchResults(null); setSearchTerm(""); }} variant="outline" className="px-4 py-2 text-sm font-semibold border-gray-300">Clear</Button>
            )}
          </form>
          <Button variant="secondary" className="px-4 py-2 text-sm font-semibold">Export CSV</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8cc63f]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Admin Segment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#fcb900]/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fcb900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Administrators ({admins.length})</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest">
                    <th className="p-4 font-bold">User ID</th>
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Contact</th>
                    <th className="p-4 font-bold">Gender</th>
                    <th className="p-4 font-bold">Verified as Admin</th>
                    <th className="p-4 font-bold">Joined At</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="p-4 font-mono text-[10px] text-gray-400">{admin._id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 border border-amber-200">
                             {(admin.userName || 'A').substring(0,2).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-800">{admin.userName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{admin.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-[#fcb900]/10 text-[#e6a800] border border-[#fcb900]/20">
                          {admin.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{admin.contact || 'N/A'}</td>
                      <td className="p-4 text-gray-500 capitalize">{admin.gender || 'N/A'}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 font-bold text-[#8cc63f]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Yes
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-gray-500 italic">No administrators found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regular Users Segment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8cc63f]/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8cc63f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Regular Users List ({regularUsers.length})</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest">
                    <th className="p-4 font-bold">User ID</th>
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Contact</th>
                    <th className="p-4 font-bold">Gender</th>
                    <th className="p-4 font-bold">Verified Status</th>
                    <th className="p-4 font-bold">Joined At</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {regularUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono text-[10px] text-gray-400">{user._id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                             {(user.userName || 'U').substring(0,2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{user.userName}</span>
                            <span className="text-[10px] font-medium text-gray-400">User</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 font-medium">{user.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-[#8cc63f]/10 text-[#7ab033] border border-[#8cc63f]/20">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{user.contact || 'N/A'}</td>
                      <td className="p-4 text-gray-500 capitalize">{user.gender || 'N/A'}</td>
                      <td className="p-4">
                        {user.isEmailVerified ? (
                          <span className="text-[#8cc63f] font-semibold">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(user._id, user.userName)}
                          disabled={actionLoading}
                          className="group relative inline-flex items-center justify-center px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] rounded-xl overflow-hidden hover:bg-[#ef4444] hover:text-white transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95 shadow-sm"
                        >
                          <span className="relative flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {regularUsers.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-gray-500 italic">No regular users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
