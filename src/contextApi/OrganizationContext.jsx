import { createContext, useContext, useEffect, useState } from "react";
import axios from "../axiosConfig";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const OrganizationContext = createContext();

export const useOrganizations = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASEURL}/organization/all-org`);
            setOrganizations(res.data || []);
        } catch (err) {
            console.error("Error fetching sector:", err);
            setError(err.response?.data?.message || "Failed to fetch sector");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    return (
        <OrganizationContext.Provider
            value={{
                organizations,
                setOrganizations,
                loading,
                error,
                fetchOrganizations,
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
};
