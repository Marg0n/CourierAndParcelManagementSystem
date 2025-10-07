import Table from "@/components/dashboard/shared/Table";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import { useAuthStore } from "@/store/useAuthStore";
import { server } from "@/utils/envUtility";
import { formatDateOnly } from "@/utils/formatDate";
import type { TUser } from "@/utils/types";
import { useEffect, useState } from "react";
import ProfileBanner from "../shared/ProfileBanner";
import { Badge } from "@/components/ui/badge";
import { Bike, CircleUser, ShieldUser } from 'lucide-react';
import clsx from "clsx";
import UserInfo from "./UserInfo";

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
      console.log(data);
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
        <Table data={users} onView={(user) => setSelectedUser(user as TUser)} />
      )}

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] h-[80vh] relative overflow-x-auto">
            {/* Avatar or other fields here */}
            <ProfileBanner profile={selectedUser!} />

            <div className="w-full text-center mt-16">
              <h2 className="font-[600] dark:text-[#abc2d3] text-[1.4rem]">
                {selectedUser.name}
              </h2>
              <Badge 
                variant="secondary"
                className={clsx(
                  selectedUser?.role === "Admin" && "bg-blue-500 dark:bg-blue-600",
                  selectedUser?.role === "Delivery Agent" && "bg-pink-500 dark:bg-gray-600",
                  selectedUser?.role === "Customer" && "bg-green-500 dark:bg-green-600",
                  " text-white"
                )}
              >
                {
                  selectedUser?.role === "Admin" && <CircleUser />
                }
                {
                  selectedUser?.role === "Delivery Agent" && <Bike />
                }
                {
                  selectedUser?.role === "Customer" && <ShieldUser />
                }
                {selectedUser.role}
              </Badge>
              <p className="text-[#424242] dark:text-[#abc2d3]/80 text-[0.9rem] font-semibold italic">
                {selectedUser.email}
              </p>
            </div>

            <div className="w-full p-4 mt-8 border-t dark:border-slate-700 border-border flex items-center justify-between">
              <div className="flex items-center justify-center flex-col">
                <h2 className=" text-[1.2rem] dark:text-[#abc2d3] font-[600]">
                  Gender
                </h2>
                <p className="text-[#424242] dark:text-[#abc2d3]/80 text-[0.9rem]">
                  {selectedUser.gender || "Not Provided"}
                </p>
              </div>

              <div className="flex items-center justify-center flex-col">
                <h2 className=" text-[1.2rem] dark:text-[#abc2d3] font-[600]">
                  Status
                </h2>
                <p className={clsx(
                    "text-[#424242] dark:text-[#abc2d3]/80 text-[0.9rem]",
                    selectedUser.status === "active" && "text-green-700",
                    selectedUser.status === "inactive" && "text-red-700",
                  )}>
                  {selectedUser.status || "Not Provided"}
                </p>
              </div>

              <div className="flex items-center justify-center flex-col">
                <h2 className=" text-[1.2rem] dark:text-[#abc2d3] font-[600]">
                  DoB
                </h2>
                <p className="text-[#424242] dark:text-[#abc2d3]/80 text-[0.9rem]">
                  {formatDateOnly(selectedUser.dateOfBirth as Date) || "Not Provided"}
                </p>
              </div>
            </div>

            <div className="w-full p-4 mt-4 border-t dark:border-slate-700 border-border">
              <h3 className="text-lg font-semibold text-center">Other Information</h3>
              <UserInfo profile={selectedUser!} />
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
