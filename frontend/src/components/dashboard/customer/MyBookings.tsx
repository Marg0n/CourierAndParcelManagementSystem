/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/pages/shared/loading/LoadingPage";

//* Interface for booking/parcel
interface Parcel {
  _id: string;
  customerEmail: string;
  agentEmail?: string;
  status: string;
  createdAt: string;
}

const MyBookings = () => {
  const token = useAuthStore((state) => state.accessToken);
  const [bookings, setBookings] = useState<Parcel[]>([]);
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

  if (!bookings.length) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        No bookings found
      </div>
    );
  }

  return (
    // <div className="p-4">
    //   <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
    //   <div className="overflow-x-auto">
    //     <table className="min-w-full bg-white shadow-md rounded-lg">
    //       <thead>
    //         <tr className="bg-gray-100 text-left">
    //           <th className="px-4 py-2">ID</th>
    //           <th className="px-4 py-2">Status</th>
    //           <th className="px-4 py-2">Created</th>
    //           <th className="px-4 py-2">Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {bookings && bookings?.map((parcel) => (
    //           <tr key={parcel._id} className="border-t">
    //             <td className="px-4 py-2">{parcel._id}</td>
    //             <td className="px-4 py-2">{parcel.status}</td>
    //             <td className="px-4 py-2">
    //               {new Date(parcel.createdAt).toLocaleString()}
    //             </td>
    //             <td className="px-4 py-2">
    //               {/* Track button navigates to ParcelTracking */}
    //               <button
    //                 onClick={() =>
    //                   navigate(`/dashboard/customer/tracking/${parcel._id}`)
    //                 }
    //                 className="px-3 py-1 text-sm bg-sky-500 text-white rounded hover:bg-sky-600 transition"
    //               >
    //                 Track
    //               </button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-sky-700">My Bookings</h2>

      <div className="grid gap-4">
        {bookings.map((parcel) => (
          <div
            key={parcel._id}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Status + Created Date */}
            <div className="flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  parcel.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : parcel.status === "In Transit"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {parcel.status}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(parcel.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Agent info if available */}
            {parcel.agentEmail && (
              <p className="text-sm text-gray-600 mt-1">
                Assigned Agent:{" "}
                <span className="font-medium">{parcel.agentEmail}</span>
              </p>
            )}

            {/* Track button -> navigates to ParcelTracking */}
            <button
              onClick={() =>
                navigate(`/dashboard/customer/tracking/${parcel._id}`)
              }
              className="mt-3 px-3 py-2 bg-sky-600 text-white text-sm rounded hover:bg-sky-700 transition"
            >
              Track Parcel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;