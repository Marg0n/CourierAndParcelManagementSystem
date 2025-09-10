/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/pages/shared/loading/LoadingPage";

//* Interface for booking/parcel
interface Parcel {
  _id: string;
  status: string;
  createdAt: string;
}

const MyBookings = () => {
  const token = useAuthStore((state) => state.accessToken);
  const [bookings, setBookings] = useState<Parcel[] | any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  //* Fetch customer bookings
  //TODO: need to do further improvements
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // const res = await fetch("http://localhost:5000/parcels/myBooking", {
        const res = await fetch("/parcels.json", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        
        //? Normalize: if it's not an array, fallback to []
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]); //? fallback
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  if (loading) return <LoadingPage />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings && bookings?.map((parcel) => (
              <tr key={parcel._id} className="border-t">
                <td className="px-4 py-2">{parcel._id}</td>
                <td className="px-4 py-2">{parcel.status}</td>
                <td className="px-4 py-2">
                  {new Date(parcel.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {/* Track button navigates to ParcelTracking */}
                  <button
                    onClick={() =>
                      navigate(`/dashboard/customer/tracking/${parcel._id}`)
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
  );
};

export default MyBookings;