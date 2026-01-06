import { createContext, useContext, useEffect, useState } from "react";
import axios from "../axiosConfig";
import { toast } from "react-toastify";

const DeviceContext = createContext();

export const useDevices = () => useContext(DeviceContext);

export const DeviceProvider = ({ children }) => {
    const [devices, setDevices] = useState([]);
    const [devicesByV, setDevicesByV] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/device/all-devices");
            setDevices(res.data || []);
        } catch (err) {
            console.error("Error fetching devices:", err);
            setError(err.response?.data?.message || "Failed to fetch devices");
        } finally {
            setLoading(false);
        }
    };

    const fetchDevicesByVenue = async (venueId) => {
        try {
            setLoading(true);
            const res = await axios.get(`/device/device-by-venue/${venueId}`);
            console.log(res)
            setDevicesByV(res.data.devices || []);
        } catch (err) {
            setDevicesByV([]);
            if (err.response?.status === 404) {
                toast.info("No devices found for this block");
            } else {
                toast.error("Failed to load devices");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    return (
        <DeviceContext.Provider
            value={{
                devices,
                setDevices,
                devicesByV,
                setDevicesByV,
                loading,
                error,
                fetchDevices,
                fetchDevicesByVenue
            }}
        >
            {children}
        </DeviceContext.Provider>
    );
};
