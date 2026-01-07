import React from "react";
import { useDevices } from "../../contextApi/DeviceContext";
import DeviceMapView from "./DeviceMapView";

const MainContent = () => {
    const { devicesByV } = useDevices();

    return (
        <main className="flex-1 order-1 md:order-2 relative">
            {/* Desktop Map */}
            <div className="hidden md:block w-full h-full">
                <DeviceMapView devices={devicesByV} />
            </div>

            {/* Mobile Map */}
            {/* <div className="md:hidden w-full h-[calc(100vh-64px)]">
                <DeviceMapView devices={devicesByV} />
            </div> */}
            <div className="md:hidden px-4 pt-4">
                <div
                    className="
                        bg-white rounded-xl shadow-md overflow-hidden
                        h-[calc(100vh-154px)]
                    "
                >
                    <DeviceMapView devices={devicesByV} />
                </div>
            </div>
        </main>
    );
};

export default MainContent;
