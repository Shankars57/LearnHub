import React, { useEffect, useState } from "react";
import { useColors } from "../hooks/useColors";
import { useUserData } from "../store/useUsersData";
import moment from "moment";
import { Ban, Eye, MoreVertical, Trash2, UserCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const colors = useColors();
  const { users } = useUserData();
  const [localUsers, setLocalUsers] = useState(users);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const usersPerPage = 7;
  const navigate = useNavigate();
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const filteredUsers = localUsers.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const handleBan = async (id) => {
    try {
      const { data } = await axios.post(`/api/user/profile/${id}`);
      if (data.success) {
        toast.success(data.message);

        const updated = localUsers.map((u) =>
          u._id === id ? { ...u, ban: !u.ban } : u
        );
        setLocalUsers(updated);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const handleUnBan = async (id) => {
    try {
      const { data } = await axios.post(`/api/user/profile/${id}`);
      if (data.success) {
        toast.success(data.message);

        const updated = localUsers.map((u) =>
          u._id === id ? { ...u, ban: !u.ban } : u
        );
        setLocalUsers(updated);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className={`${colors.bg} px-6 py-6 min-h-screen`}>
      <div className="mb-6">
        <h1 className={`${colors.text} text-3xl font-bold`}>User Management</h1>
        <p className={`${colors.text} opacity-70 text-lg`}>
          Monitor and manage all registered users
        </p>
      </div>

      <input
        type="text"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className={`w-full md:w-1/3 p-2 rounded-lg border border-[#30363d] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 placeholder:text-gray-400 ${colors.text} ${colors.bg}`}
      />

      <div className={`overflow-x-auto rounded-xl ${colors.shadow}`}>
        <table className="w-full text-left border-collapse">
          <thead className={`${colors.text} bg-opacity-70`}>
            <tr>
              <th className="p-3">Profile</th>
              <th className="p-3">User Info</th>
              <th className="p-3">Role</th>
              <th className="p-3">Join Date</th>
              <th className="p-3">Last Login</th>
              <th className="p-3">Sessions</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, i) => (
                <tr
                  key={i}
                  className={`${colors.text} ${colors.bg} transition hover:bg-black/10`}
                >
                  <td className="px-4 py-3">
                    {user.profile ? (
                      <img
                        src={user.profile}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border border-[#30363d] object-cover"
                      />
                    ) : (
                      <UserCircle className="w-10 h-10 text-gray-400" />
                    )}
                  </td>

                  <td className="p-3">
                    <div>
                      <p className={`font-semibold ${colors.text}`}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className={`text-sm opacity-70 ${colors.text}`}>
                        {user.email}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 capitalize">{user.role || "student"}</td>
                  <td className="p-3">
                    {moment(user.createdAt).format("MMM DD, YYYY")}
                  </td>
                  <td className="p-3">
                    {moment(user.lastLogin || user.updatedAt).format(
                      "MMM DD, YYYY"
                    )}
                  </td>
                  <td className="p-3 text-center">{user.sessions || "0"}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.ban
                          ? "bg-red-600/20 text-red-400 border border-red-500/30"
                          : "bg-green-600/20 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {user.ban ? "Banned" : "Active"}
                    </span>
                  </td>

                  <td className="p-3 relative">
                    <button
                      onClick={() => {
                        setOpen(open && idx === i ? false : true);
                        setIdx(i);
                      }}
                      className={`p-2 rounded-lg ${colors.hover} transition`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {open && idx === i && (
                      <div
                        className={`absolute right-0 top-10 w-44 z-50 ${colors.card} ${colors.shadow} border border-[#30363d] rounded-lg p-2 flex flex-col gap-1`}
                      >
                        <button
                          onClick={() => navigate(`/profile/${user._id}`)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left text-sm ${colors.text} ${colors.hover}`}
                        >
                          <Eye size={16} /> View Profile
                        </button>
                        {user.ban ? (
                          <button
                            onClick={() => handleBan(user._id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left text-sm ${colors.text} ${colors.hover}`}
                          >
                            <Ban size={16} />
                            {user.ban ? "Unban User" : "Ban User"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnBan(user._id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left text-sm ${colors.text} ${colors.hover}`}
                          >
                            <Ban size={16} />
                            {user.ban ? "Unban User" : "Ban User"}
                          </button>
                        )}
                        <button
                          className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left text-sm text-red-400 hover:bg-red-600/20`}
                        >
                          <Trash2 size={16} /> Delete User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className={`${colors.text} opacity-70 text-center py-6`}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 0 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded-lg border ${colors.text} ${
              colors.bg
            } ${colors.shadow} ${
              page === 1 ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            Prev
          </button>

          <span className={`${colors.text} text-sm`}>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg border ${colors.text} ${
              colors.bg
            } ${colors.shadow} ${
              page === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:opacity-80"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;
