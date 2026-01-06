import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../axiosConfig";
import { jwtDecode } from "jwt-decode";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(user);

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken && !isTokenExpired(storedToken)) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        } else {
            localStorage.clear();
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        let role;

        if (userData.role === "admin" && userData.createdBy === "admin") {
            role = "admin";
        } else if (userData.role === "user" && userData.createdBy === "admin") {
            role = "manager";
        } else {
            role = "user";
        }

        const finalUser = { ...userData, role };

        setUser(finalUser);
        setToken(authToken);
        localStorage.setItem("user", JSON.stringify(finalUser));
        localStorage.setItem("token", authToken);
    };

    const logout = async () => {
        try {
            await axios.delete(`${BASEURL}/auth/logout`);
        } catch { }
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, loading, isTokenExpired }}
        >
            {children}
        </AuthContext.Provider>
    );
};
