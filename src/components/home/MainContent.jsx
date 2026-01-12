import React from "react";
import { useDevices } from "../../contextApi/DeviceContext";
import DeviceMapView from "./DeviceMapView";

const MainContent = () => {
    const { devicesByV } = useDevices();

    return (
        <main className="flex-1 order-1 md:order-2 relative bg-[#EEF3F9] md:bg-transparent overflow-hidden">
            {/* Desktop Map */}
            <div className="hidden md:block w-full h-full">
                <DeviceMapView devices={devicesByV} />
            </div>

            {/* Mobile Map Card */}
            <div className="md:hidden h-full px-3 pt-3 pb-[70px]">
                {/* pb-[76px] = bottom nav height + gap */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                    <DeviceMapView devices={devicesByV} />
                </div>
            </div>
        </main>
    );
};


export default MainContent;
