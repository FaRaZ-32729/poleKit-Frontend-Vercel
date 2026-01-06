import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMarker = ({ setLatLng, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition || null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setLatLng(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ onSelect, initialPosition }) => {
    return (
        <MapContainer
            center={initialPosition || [24.8607, 67.0011]} // default Karachi
            zoom={12}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap © CartoDB"
            />
            <LocationMarker setLatLng={onSelect} initialPosition={initialPosition} />
        </MapContainer>
    );
};



export default MapPicker;
