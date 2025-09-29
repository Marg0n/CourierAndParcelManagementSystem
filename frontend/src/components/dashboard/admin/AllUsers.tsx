/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Table from "@/components/dashboard/shared/Table";
import { server } from "@/utils/envUtility"; 
import { useAuthStore } from "@/store/useAuthStore";

const AllUsers = () => {

  //* State data from store
  const { accessToken } = useAuthStore();

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${server}/get-user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .then((data) => console.log(data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">All Users Dashboard</h1>
      <p className="text-gray-600 mb-4">Manage users</p>

      {users.length > 0 ? <Table data={users} /> : <p>Loading users...</p>}
    </div>
  );
};

export default AllUsers;