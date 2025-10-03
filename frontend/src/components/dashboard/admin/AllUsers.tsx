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
  // const [avatarDataUrl, setAvatarDataUrl] = useState("");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${server}/admin/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      console.log(data)
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

  // //* Explicitly get the Content-Type
  // const mimeType = res.headers.get("Content-Type") || "image/png";

  // //* Get the response body as a Blob (binary data)
  // const imageBlob = await res.blob();

  // //* Convert Blob to Base64 Data URL
  // const base64Url = await blobToBase64(imageBlob, mimeType);

  // setAvatarDataUrl(base64Url);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-h-full overflow-y-auto">
      <h1 className="text-2xl font-bold">All Users Dashboard</h1>
      <p className="text-gray-600 mb-4">Manage users</p>

      {users.length > 0 && (
        <Table data={users} onView={(user) => setSelectedUser(user as TUser)} />
      )}

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] h-[80vh] relative overflow-x-auto">
            {/* <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <p><strong>DoB:</strong> {formatDateOnly(selectedUser.dateOfBirth as Date)}</p> */}
            {/* You can add avatar or other fields here */}
            <div
                className="w-full h-[150px] rounded-t-md relative bg-[url('https://img.freepik.com/premium-vector/content-writer-vector-colored-round-line-illustration_104589-2571.jpg')] bg-center">
                <img
                    src={"https://images.pexels.com/photos/3772623/pexels-photo-3772623.jpeg"}
                    alt=""
                    className="w-[80px] h-[80px] rounded-full border-secondary border-4 absolute -bottom-12 left-1/2 transform -translate-x-1/2 object-cover"
                />
            </div>

            <div className="w-full text-center mt-16">
                <h2 className="font-[600] dark:text-[#abc2d3] text-[1.4rem]">{selectedUser.name}</h2>
                <p className="text-[#424242] dark:text-[#abc2d3]/80 text-[0.9rem]">{selectedUser.email}</p>
            </div>
            <div
                className="w-full p-4 mt-8 border-t dark:border-slate-700 border-border flex items-center justify-between">
                <div className="flex items-center justify-center flex-col">
                    <h2 className=" text-[1.2rem] dark:text-[#abc2d3] font-[600]">Role</h2>
                    <p className="text-[#424242] dark:text-[#abc2d3]/80 text-[0.9rem]">{selectedUser.role}</p>
                </div>

                <div className="flex items-center justify-center flex-col">
                    <h2 className=" text-[1.2rem] dark:text-[#abc2d3] font-[600]">Status</h2>
                    <p className="text-[#424242] dark:text-[#abc2d3]/80 text-[0.9rem]">{selectedUser.status}</p>
                </div>

                <div className="flex items-center justify-center flex-col">
                    <h2 className=" text-[1.2rem] dark:text-[#abc2d3] font-[600]">DoB</h2>
                    <p className="text-[#424242] dark:text-[#abc2d3]/80 text-[0.9rem]">{formatDateOnly(selectedUser.dateOfBirth as Date)}</p>
                </div>
            </div>
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
