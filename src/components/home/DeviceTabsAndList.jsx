import React, { useMemo } from "react";
import { AlertCircle } from "lucide-react";

const DeviceTabsAndList = ({ devices, loading, activeTab, initialLoading }) => {

    // 🔹 Filter devices based on active tab
    const filteredDevices = useMemo(() => {
        if (activeTab === "detected") {
            return devices.filter(d => d.voltage === true);
        }
        if (activeTab === "normal") {
            return devices.filter(d => d.voltage === false);
        }
        return devices;
    }, [devices, activeTab]);

    return (
        <>
            {/* ================= DESKTOP ================= */}
            <div className="p-4 overflow-y-auto space-y-3 hidden md:block">
                {initialLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="p-3 border rounded-xl flex justify-between items-center animate-pulse"
                        >
                            <div className="space-y-2 w-full">
                                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                        </div>
                    ))
                ) : filteredDevices.length === 0 ? (
                    <p className="text-sm text-gray-400">No devices found</p>
                ) : (
                    filteredDevices.map((device) => (
                        <div
                            key={device._id}
                            className="p-3 border rounded-xl flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        >
                            <div>
                                <p className="font-medium">{device.deviceId}</p>
                                <p className="text-gray-500 text-xs">
                                    Block: {device.venue?.name || "N/A"}
                                </p>
                            </div>

                            <AlertCircle
                                className={`h-5 w-5 ${device.voltage ? "text-red-500" : "text-green-500"
                                    }`}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* ================= MOBILE ================= */}
            <div className="px-3 flex gap-4 overflow-x-auto pb-5 md:hidden">
                {initialLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="min-w-[150px] bg-white border rounded-2xl shadow-sm p-4 animate-pulse"
                        >
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mt-3"></div>
                        </div>
                    ))
                ) : (
                    filteredDevices.map((device) => (
                        <div
                            key={device._id}
                            className="min-w-[150px] bg-white border rounded-2xl shadow-sm p-4"
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{device.deviceId}</p>
                                <AlertCircle
                                    className={`h-4 w-4 ${device.voltage ? "text-red-500" : "text-green-500"
                                        }`}
                                />
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                                {device.venue?.name || "N/A"}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default DeviceTabsAndList;
