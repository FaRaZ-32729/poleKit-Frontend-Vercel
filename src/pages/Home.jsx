import React from "react";
import MainContent from "../components/home/MainContent";
import Sidebar from "../components/home/Sidebar";

const Home = () => {
    return (
        <div className="w-full h-screen flex flex-col md:flex-row bg-gray-100 relative">
            <Sidebar />
            <MainContent />
        </div>
    );
};

export default Home;
