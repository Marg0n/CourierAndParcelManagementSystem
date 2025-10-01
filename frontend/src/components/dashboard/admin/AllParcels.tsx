import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import type { Parcel } from "@/utils/types";


const AllParcels = () => {

  //* State managements
  const token = useAuthStore((state) => state.accessToken);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  //* Fetch all parcels for Admin
  //TODO: need to do further improvements
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        // const res = await fetch("http://localhost:5000/admin/parcels", {
        const res = await fetch("/parcels.json", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setParcels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching parcels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, [token]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800">All Parcels</h1>
      <p className="text-gray-600 mt-2">Manage parcels.</p>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">All Parcels</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Agent</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="border-t">
                  <td className="px-4 py-2">{parcel._id}</td>
                  <td className="px-4 py-2">{parcel.customerEmail}</td>
                  <td className="px-4 py-2">{parcel.agentEmail}</td>
                  <td className="px-4 py-2">{parcel.status}</td>
                  <td className="px-4 py-2">
                    {new Date(parcel.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {/* Track button navigates to ParcelTracking */}
                    <button
                      onClick={() =>
                        navigate(`/dashboard/admin/tracking/${parcel._id}`)
                      }
                      className="px-3 py-1 text-sm bg-sky-500 text-white rounded hover:bg-sky-600 transition"
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllParcels;
