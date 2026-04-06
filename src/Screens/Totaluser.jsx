import React from 'react';
import useFetchUsers from '../hooks/useFetchUsers';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import useUserActions from '../hooks/useUserActions';
import { useToast } from '../context/ToastContext';

export default function Totaluser() {
  const { data, loading, error, refetch } = useFetchUsers();
  const { deleteUser, getUserById, updateUserRole, loading: actionLoading } = useUserActions();
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

  const handleRoleToggle = async (id, currentRole, name) => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    if (window.confirm(`Change ${name}'s role from "${currentRole}" to "${newRole}"?`)) {
      const result = await updateUserRole(id, newRole);
      if (result.success) {
        showToast(result.message || `Role updated to ${newRole}`, "success");
        refetch();
      } else {
        showToast(result.message || "Failed to update role", "error");
      }
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Total Users</h1>
            <p className="text-gray-500 mt-1">View and manage all registered platform users.</p>
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">
              {searchResults ? "Search Results" : `Users Database (${data?.total || 0})`}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">User ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Gender</th>
                  <th className="p-4 font-semibold">Verified</th>
                  <th className="p-4 font-semibold">Joined At</th>
                  <th className="p-4 font-semibold">Change Role</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {(searchResults || data)?.users?.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-400">{user._id}</td>
                    <td className="p-4 font-medium text-gray-800">{user.userName}</td>
                    <td className="p-4 text-gray-500">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 'Admin' ? 'bg-[#fcb900]/10 text-[#e6a800]' : 'bg-[#8cc63f]/10 text-[#7ab033]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{user.contact || 'N/A'}</td>
                    <td className="p-4 text-gray-500 capitalize">{user.gender || 'N/A'}</td>
                    <td className="p-4">
                      {user.isEmailVerified ? (
                         <span className="text-[#8cc63f]">Yes</span>
                      ) : (
                         <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleRoleToggle(user._id, user.role, user.userName)}
                        disabled={actionLoading}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50 ${
                          user.role === 'Admin'
                            ? 'bg-[#8cc63f]/10 text-[#7ab033] hover:bg-[#8cc63f]/20'
                            : 'bg-[#fcb900]/10 text-[#e6a800] hover:bg-[#fcb900]/20'
                        }`}
                      >
                        {user.role === 'Admin' ? '→ Make User' : '→ Make Admin'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(user._id, user.userName)}
                        disabled={actionLoading}
                        className="text-red-500 hover:text-red-700 font-semibold text-xs transition disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(!data?.users || data.users.length === 0) && (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
