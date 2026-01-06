// src/pages/auth/VerifyOtp.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import { KeyRound } from "lucide-react";

const VerifyOtp = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // 🚫 Prevent going back after verification
    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
        };
        window.addEventListener("popstate", handlePopState);

        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!otp.trim()) {
            toast.warning("OTP is required");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `/auth/verify-otp/${encodeURIComponent(token)}`,
                { otp: otp.trim() }
            );

            toast.success(res.data.message || "Account verified successfully");

            // 🔁 Replace history so back button won't work
            navigate("/login", { replace: true });
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-0">
            <div className="grid md:grid-cols-2 rounded-4xl items-stretch max-w-7xl w-full bg-white shadow-lg overflow-hidden">

                {/* Left (Form) Section */}
                <div className="p-8 w-full">
                    <form
                        className="space-y-6 lg:p-24 p-0"
                        onSubmit={handleVerify}
                    >
                        <div className="mb-8 text-center md:text-left">
                            <img
                                src="/logo.png"
                                alt="IoTify Logo"
                                className="h-10 mx-auto md:mx-0 mb-4"
                            />
                            <h3 className="text-slate-900 text-2xl font-semibold">
                                Verify OTP
                            </h3>
                            <p className="text-slate-500 text-sm mt-2">
                                Enter the 1-time OTP sent to your email to activate your account.
                            </p>
                        </div>

                        {/* OTP Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full text-sm text-slate-800 border border-slate-300 pl-10 pr-4 py-3 rounded-lg outline-blue-600"
                            />
                            <KeyRound
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="!mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white ${loading
                                        ? "bg-blue-400"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    } focus:outline-none`}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right (Images) Section */}
                <div className="h-full hidden md:flex flex-col items-center justify-between p-4 bg-[#EAEAEA]">
                    <div className="w-full flex justify-end p-4">
                        <img
                            src="/login-right-top-image.png"
                            className="h-16 w-auto object-contain"
                            alt="Top Right Illustration"
                        />
                    </div>

                    <div className="flex-grow flex items-center justify-center p-4">
                        <img
                            src="/login-image.png"
                            className="w-full h-auto object-contain"
                            alt="Illustration"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VerifyOtp;
