import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import axiosInstance from "../axiosConfig";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const StatusContext = createContext();

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {
    const { token } = useAuth();
    const [updating, setUpdating] = useState(false);

    const updateUserStatus = async (userId, isActive, suspensionReason = "") => {
        try {
            setUpdating(true);

            const res = await axiosInstance.put(
                `${BASEURL}/users/update-status/${userId}`,
                { isActive, suspensionReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return res.data.user;
        } finally {
            setUpdating(false);
        }
    };

    return (
        <StatusContext.Provider value={{ updateUserStatus, updating }}>
            {children}
        </StatusContext.Provider>
    );
};
