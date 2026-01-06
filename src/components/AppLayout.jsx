import React from "react";
import NavigationBar from "../components/NavigationBar";
import { Outlet } from "react-router";

const AppLayout = ({ children }) => {
    return (
        <div className="w-full h-screen flex flex-col md:flex-row bg-gray-100 relative">
            <NavigationBar />
            <div className="flex-1 "><Outlet /></div>
        </div>
    );
};

export default AppLayout;
