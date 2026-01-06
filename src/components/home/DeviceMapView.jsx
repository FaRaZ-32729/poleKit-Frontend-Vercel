import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// ❌ Remove default marker icon
delete L.Icon.Default.prototype._getIconUrl;

// ✅ Custom Icons
const greenPoleIcon = new L.Icon({
    iconUrl: "/pole_green.png",
    iconSize: [50, 50],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const redPoleIcon = new L.Icon({
    iconUrl: "/pole_red.png",
    iconSize: [50, 50],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// ✅ Helper component to auto-fit bounds
const FitBounds = ({ devices }) => {
    const map = useMap();

    useEffect(() => {
        const validDevices = devices.filter(
            d => d.latitude != null && d.longitude != null
        );

        if (validDevices.length === 0) return;

        const bounds = L.latLngBounds(
            validDevices.map(d => [d.latitude, d.longitude])
        );

        map.fitBounds(bounds, {
            padding: [50, 50], // spacing from edges
            maxZoom: 17,       // prevent over-zoom when very close
            animate: true,
        });
    }, [devices, map]);

    return null;
};

const DeviceMapView = ({ devices }) => {
    const defaultCenter = [24.8607, 67.0011]; // Karachi

    return (
        <MapContainer
            center={defaultCenter}
            zoom={12} // initial zoom (will be overridden by fitBounds)
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap © CartoDB"
            />

            {/* 🔥 Dynamic zoom handler */}
            <FitBounds devices={devices} />

            {devices?.map((device) => {
                if (
                    device.latitude == null ||
                    device.longitude == null
                ) {
                    return null;
                }

                const markerIcon =
                    device.voltage === true
                        ? redPoleIcon
                        : greenPoleIcon;

                return (
                    <Marker
                        key={device._id}
                        position={[device.latitude, device.longitude]}
                        icon={markerIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <p className="font-semibold">
                                    {device.deviceId}
                                </p>
                                <p className="text-gray-500">
                                    Block: {device.venue?.name || "N/A"}
                                </p>
                                <p
                                    className={`mt-1 font-medium ${device.voltage
                                        ? "text-red-600"
                                        : "text-green-600"
                                        }`}
                                >
                                    Voltage:{" "}
                                    {device.voltage ? "Detected" : "Normal"}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default DeviceMapView;