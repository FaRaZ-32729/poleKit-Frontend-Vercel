// src/pages/auth/SetupPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const SetupPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password.trim() || !confirmPassword.trim()) {
            toast.warning("Both password fields are required");
            return;
        }

        if (password !== confirmPassword) {
            toast.warning("Passwords do not match");
            return;
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!passwordRegex.test(password)) {
            toast.warning(
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
            );
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`/auth/set-password/${encodeURIComponent(token)}`, {
                password,
            });

            toast.success(res.data.message || "Password set successfully");
            navigate(`/verify-otp/${encodeURIComponent(token)}`);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to set password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-0">
            <div className="grid md:grid-cols-2 rounded-4xl items-stretch max-w-7xl w-full bg-white shadow-lg overflow-hidden">
                {/* Left (Form) Section */}
                <div className="p-8 w-full">
                    <form className="space-y-6 lg:p-24 p-0" onSubmit={handleSubmit}>
                        <div className="mb-8 text-center md:text-left">
                            {/* <img
                                src="/logo.png"
                                alt="IoTify Logo"
                                className="h-10 mx-auto md:mx-0 mb-4"
                            /> */}
                            <img src="/poleKitLogoD.png" alt="SmartVolt Logo" className="h-10 sm:h-15 mx-auto md:mx-0 mb-4" />
                            <h3 className="text-slate-900 text-2xl font-semibold">
                                Set Your Password
                            </h3>
                            <p className="text-slate-500 text-sm mt-2">
                                Create a secure password with at least one uppercase letter,
                                one special character, and minimum 8 characters.
                            </p>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        <div className="!mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                                    } focus:outline-none`}
                            >
                                {loading ? "Saving..." : "Set Password"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right (Images) Section */}
                <div className="h-full hidden md:flex flex-col items-center justify-between p-4 bg-[#EAEAEA]">
                    {/* Top Image */}
                    <div className="w-full flex justify-end p-4">
                        <img
                            src="/login-right-top-image.png"
                            className="h-16 w-auto object-contain"
                            alt="Top Right Illustration"
                        />
                    </div>

                    {/* Main Image */}
                    {/* <div className="flex-grow flex items-center justify-center p-4">
                        <img
                            src="/login-image.png"
                            className="w-full h-auto object-contain"
                            alt="Illustration"
                        />
                    </div> */}
                    {/* Right Panel */}
                    <div style={{ backgroundColor: "#EAEAEA" }} className="h-full hidden md:flex flex-col items-center justify-between p-4">

                        <div className="flex-grow flex items-center justify-center p-4">
                            <img src="/poleKitLogin.png" className="w-full h-auto object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupPassword;
