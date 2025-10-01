/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Table from "@/components/dashboard/shared/Table";
import { server } from "@/utils/envUtility";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import type { TUser } from "@/utils/types";
import { formatDateOnly } from "@/utils/formatDate";

const AllUsers = () => {
  const { accessToken } = useAuthStore();
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${server}/admin/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-h-full overflow-y-auto">
      <h1 className="text-2xl font-bold">All Users Dashboard</h1>
      <p className="text-gray-600 mb-4">Manage users</p>

      {users.length > 0 && (
        <Table data={users} onView={(user) => setSelectedUser(user)} />
      )}

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <p><strong>DoB:</strong> {formatDateOnly(selectedUser.dateOfBirth as Date)}</p>
            {/* You can add avatar or other fields here */}
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
