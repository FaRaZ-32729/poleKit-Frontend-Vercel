import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contextApi/AuthContext";
import LogoutConfirmationModal from "./LogoutConfirmationModal ";
import { LogOut, UserRound } from "lucide-react";

const NavigationBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleLogoutConfirm = async () => {
        setLoading(true);
        const success = await logout();
        setLoading(false);

        if (success) {
            setShowLogoutModal(false);
            navigate("/login");
        }
    };

    // Admin management nav items
    const allNavItems = [
        { key: "home", label: "Home", path: "/", icon: "/sidebar-images/1.png", blueIcon: "/sidebar-images-blue/1.svg" },
        { key: "organization-management", label: "Organization Management", path: "/organization", icon: "/sidebar-images/2.png", blueIcon: "/sidebar-images-blue/2.png" },
        { key: "venue-management", label: "Venue Management", path: "/venue", icon: "/sidebar-images/4.png", blueIcon: "/sidebar-images-blue/4.png" },
        { key: "users-management", label: "Users Management", path: "/user", icon: "/sidebar-images/7.png", blueIcon: "/sidebar-images-blue/7.png" },
        { key: "device-management", label: "Device Management", path: "/device", icon: "/sidebar-images/3.png", blueIcon: "/sidebar-images-blue/3.png" },
    ];

    let navItems = [];

    if (user?.role === "admin") {
        navItems = allNavItems;
    } else if (user?.role === "manager") {
        navItems = allNavItems.filter(item =>
            ["home", "venue-management", "users-management"].includes(item.key)
        );
    } else if (user?.role === "user") {
        navItems = allNavItems.filter(item =>
            ["home"].includes(item.key)
        );
    }

    return (
        <>
            {/* MOBILE TOP BAR */}
            <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center md:hidden relative z-50 rounded-tl-lg rounded-tr-lg">
                <img src="/poleKitLogoD.png" alt="logo" className="h-7" />
                <LogOut
                        className="h-6 w-6 text-blue-700 hover:brightness-90 cursor-pointer"
                        onClick={() => setShowLogoutModal(true)}
                    />
            </header>

            {/* DESKTOP LEFT NAV */}
            <aside className="hidden md:flex flex-col w-15 bg-blue-600 text-white items-center py-6  relative rounded-tr-xl rounded-br-xl">
                {/* Logo */}
                <div>
                    <img src="/poleKitLogoHalf.png" alt="logo" className="h-10 w-auto" />
                </div>

                {/* Nav Icons */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div key={item.key} className="relative group w-full flex justify-center">
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`p-2 rounded-lg hover:bg-blue-500 transition-all ${isActive ? "bg-blue-700" : ""}`}
                                >
                                    <img
                                        src={item.icon}
                                        alt={item.label}
                                        className="h-6 w-6"
                                    />
                                </button>

                                {/* Label (on hover) */}
                                <span className="absolute left-full ml-2 px-3 py-1 rounded-md bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap md:block hidden">
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Profile Icon */}
                <div className="mt-auto">
                    <LogOut
                        className="h-6 w-6 hover:brightness-90 cursor-pointer"
                        onClick={() => setShowLogoutModal(true)}
                    />
                </div>
            </aside>

            {/* MOBILE BOTTOM NAV */}
            <nav className="fixed bottom-0 left-0 w-full bg-blue-600 shadow-xl py-1 flex justify-around md:hidden z-50 rounded-tl-xl rounded-tr-xl">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button key={item.key} onClick={() => navigate(item.path)} className="p-1 flex flex-col items-center">
                            <img
                                src={isActive ? item.blueIcon : item.icon}
                                alt={item.label}
                                className={`h-6 w-6 transition-all ${isActive ? "filter brightness-0 invert" : "brightness-100 hover:brightness-90"}`}
                            />
                        </button>
                    );
                })}
            </nav>

            <LogoutConfirmationModal
                isOpen={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                loading={loading}
            />
        </>
    );
};

export default NavigationBar;
