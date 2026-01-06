import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contextApi/AuthContext";
import axios from "../../axiosConfig";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const UserStatusChecker = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?._id) return;

        const checkStatus = async () => {
            try {
                const res = await axios.get(`/users/status/${user._id}`);
                const { isActive } = res.data;

                if (!isActive) {
                    toast.error("Your account has been deactivated by admin.");
                    logout(); // Clear auth context
                    navigate("/login"); // Redirect to login page
                }
            } catch (err) {
                console.error("Failed to fetch user status:", err);
            }
        };

        // Initial check
        checkStatus();

        // Poll every 15 seconds
        const intervalId = setInterval(checkStatus, 2 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [user, logout, navigate]);

    return null; // This component doesn't render anything
};

export default UserStatusChecker;
