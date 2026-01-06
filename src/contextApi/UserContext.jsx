import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "../axiosConfig";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { token, user } = useAuth();

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const fetchUsers = useCallback(async () => {
        if (!token || !user) return;

        try {
            setLoadingUsers(true);
            let res;

            if (user.role === "admin") {
                res = await axios.get("/users/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else if (user.role === "manager") {
                res = await axios.get(`/users/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            setUsers(res?.data?.users || res?.data || []);
        } catch (err) {
            console.error("Fetch users error:", err);
            toast.error(err.response?.data?.message || "Failed to fetch users");
            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    }, [token, user]);

    return (
        <UserContext.Provider
            value={{
                users,
                loadingUsers,
                fetchUsers,
                setUsers,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => useContext(UserContext);
