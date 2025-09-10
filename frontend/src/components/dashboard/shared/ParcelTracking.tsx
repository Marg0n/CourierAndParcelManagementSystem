/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import { Button } from "@/components/ui/button";

//* Fix Leaflet default icon issue
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

//* Interface for tracking
interface TrackingEvent {
  status: string;
  timestamp: string;
  location?: { lat: number; lng: number };
}

//* Interface for parcel
interface Parcel {
  _id: string;
  customerEmail: string;
  agentEmail?: string;
  status: string;
  trackingHistory: TrackingEvent[];
  currentLocation?: { lat: number; lng: number };
}

export const ParcelTracking = () => {

  const { id } = useParams(); //? Parcel ID
  const token = useAuthStore((state) => state.accessToken);

  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(true);

  //* Navigation
  const navigate = useNavigate();

  //* Fetch parcel tracking data
  useEffect(() => {
    const fetchParcel = async () => {
      if (!id || !token) return setLoading(false);

      try {
        const res = await fetch(`http://localhost:5000/parcels/${id}/tracking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Tracking fetch failed:", error);
          setParcel(null);
          return;
        }

        const data = await res.json();
        console.log(data)
        setParcel(data);
      } catch (err) {
        console.error("Error fetching parcel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParcel();
  }, [id, token]);

  if (loading) return <LoadingPage />;
  
  if (!parcel) return (
    <>
      <div className="flex flex-col justify-center items-center-safe text-red-500 h-full">
        <h1 className="text-5xl font-bold text-sky-800 mb-4">
          Parcel not found!
        </h1>
        <Button size="lg" onClick={() => navigate(-1)}>
            Go Back
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Timeline */}
      <div className="md:w-1/3 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-sky-700 mb-2">Tracking History</h2>
        <div className="flex flex-col gap-2">
          {parcel.trackingHistory
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((event, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-sky-500 mt-1"></div>
                  {idx < parcel.trackingHistory.length - 1 && (
                    <div className="w-px flex-1 bg-gray-300"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.status}</p>
                  <p className="text-gray-500 text-sm">{new Date(event.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Map */}
      <div className="md:w-2/3 h-80 md:h-[500px] rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={
            parcel.currentLocation
              ? [parcel.currentLocation.lat, parcel.currentLocation.lng]
              : [23.8103, 90.4125] //? fallback: Dhaka
          }
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {parcel.currentLocation && (
            <Marker
              position={[parcel.currentLocation.lat, parcel.currentLocation.lng]}
            >
              <Popup>
                Current Status: {parcel.status}
                <br />
                {parcel.agentEmail ? `Agent: ${parcel.agentEmail}` : ""}
              </Popup>
            </Marker>
          )}
          {parcel.trackingHistory
            .filter((ev) => ev.location)
            .map((ev, idx) => (
              <Marker
                key={idx}
                position={[ev.location!.lat, ev.location!.lng]}
              >
                <Popup>
                  Status: {ev.status}
                  <br />
                  {new Date(ev.timestamp).toLocaleString()}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};
