import React, { useState, useRef, useEffect } from "react";
import { List, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { useOrganizations } from "../../contextApi/OrganizationContext";
import { useVenues } from "../../contextApi/VenueContext";
import { useDevices } from "../../contextApi/DeviceContext";
import { useAuth } from "../../contextApi/AuthContext";
import DeviceTabsAndList from "./DeviceTabsAndList";

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [orgOpen, setOrgOpen] = useState(false);
    const [venueOpen, setVenueOpen] = useState(false);
    const [orgSearch, setOrgSearch] = useState("");
    const [venueSearch, setVenueSearch] = useState("");
    const orgRef = useRef(null);
    const venueRef = useRef(null);
    const hasLoadedOnceRef = useRef(false);
    const { user } = useAuth();

    // roles
    const isAdmin = user?.role === "admin";
    const isManager = user?.role === "manager";
    const isUser = user?.role === "user";


    // logic state
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const { organizations, fetchOrganizations } = useOrganizations();
    const { venues, fetchVenuesByOrg } = useVenues();
    const { devicesByV, loading, fetchDevicesByVenue, setDevicesByV } = useDevices();



    useEffect(() => {
        if (isAdmin) {
            fetchOrganizations();
        }
    }, [isAdmin]);

    useEffect(() => {
        if (!selectedVenue?._id) return;

        const fetchDevices = async () => {
            await fetchDevicesByVenue(selectedVenue._id);
            hasLoadedOnceRef.current = true;
        };

        fetchDevices();

        const intervalId = setInterval(() => {
            fetchDevicesByVenue(selectedVenue._id);
        }, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [selectedVenue?._id]);



    const userVenues =
        isUser && user?.venues?.length > 0
            ? user.venues.map(v => ({
                _id: v.venueId,
                name: v.venueName,
            }))
            : venues;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (orgRef.current && !orgRef.current.contains(e.target)) {
                setOrgOpen(false);
            }
            if (venueRef.current && !venueRef.current.contains(e.target)) {
                setVenueOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (
            isAdmin &&
            organizations.length > 0 &&
            !selectedOrg
        ) {
            const firstOrg = organizations[0];
            setSelectedOrg(firstOrg);
            fetchVenuesByOrg(firstOrg._id);
        }
    }, [organizations, isAdmin]);

    useEffect(() => {
        if (isManager && user?.organization) {
            setSelectedOrg(user.organization);
            fetchVenuesByOrg(user.organization._id);
        }

        if (isUser && user?.organization) {
            setSelectedOrg(user.organization);
        }
    }, [isManager, isUser, user?.organization]);


    useEffect(() => {
        const venueList = isUser ? userVenues : venues;

        if (venueList.length > 0 && selectedOrg && !selectedVenue) {
            const firstVenue = venueList[0];
            setSelectedVenue(firstVenue);
            fetchDevicesByVenue(firstVenue._id);
        }
    }, [venues, userVenues, isUser]);

    const tabs = [
        { id: "all", label: "All", icon: List },
        { id: "normal", label: "Normal", icon: CheckCircle },
        { id: "detected", label: "Detected", icon: AlertCircle },
    ];


    return (
        <aside className="md:w-96 w-full bg-white shadow-md flex flex-col order-1 md:order-1">
            {/* Top Dropdown Buttons  border-b*/}
            <div className="flex justify-between items-center p-4 ">
                {/* Organization Dropdown */}
                <div className="relative" ref={orgRef}>
                    <button
                        onClick={() => !(isManager || isUser) && setOrgOpen(!orgOpen)}
                        disabled={isManager || isUser}
                        title={selectedOrg?.name || "Sector"}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow
                            ${(isManager || isUser)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-blue-100 text-blue-700"
                            }
                         `}
                    >
                        {selectedOrg
                            ? selectedOrg.name.length > 5
                                ? `${selectedOrg.name.slice(0, 6)}...`
                                : selectedOrg.name
                            : "Sector"}
                        {!(isManager || isUser) && <ChevronDown className="h-4 w-4" />}
                    </button>

                    {orgOpen && !(isManager || isUser) && (
                        <div className="absolute mt-2 w-64 bg-white border rounded-lg shadow-md z-10">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search Sector..."
                                value={orgSearch}
                                onChange={(e) => setOrgSearch(e.target.value)}
                                className="w-full px-3 py-2 border-b text-sm outline-none"
                            />

                            {/* List */}
                            <div className="max-h-56 overflow-y-auto">
                                {organizations
                                    .filter(org =>
                                        org.name.toLowerCase().includes(orgSearch.toLowerCase())
                                    )
                                    .map((org) => (
                                        <div
                                            key={org._id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                            onClick={async () => {
                                                setSelectedOrg(org);
                                                setSelectedVenue(null);
                                                setOrgOpen(false);
                                                setOrgSearch("");
                                                await fetchVenuesByOrg(org._id);
                                                setDevicesByV([]);
                                            }}
                                        >
                                            {org.name}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Venue Dropdown */}
                <div className="relative" ref={venueRef}>
                    <button
                        onClick={() => setVenueOpen(!venueOpen)}
                        title={selectedVenue?.name || "Block"}
                        className="flex items-center gap-2 px-4 py-2 text-blue-700 rounded-full font-medium shadow"
                    >
                        {/* {selectedVenue ? selectedVenue.name : "Venue"} */}
                        {selectedVenue
                            ? selectedVenue.name.length > 5
                                ? `${selectedVenue.name.slice(0, 6)}...`
                                : selectedVenue.name
                            : "Block"}
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {venueOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-md z-10">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search block..."
                                value={venueSearch}
                                onChange={(e) => setVenueSearch(e.target.value)}
                                className="w-full px-3 py-2 border-b text-sm outline-none"
                                disabled={!selectedOrg}
                            />

                            <div className="max-h-23 md:max-h-30 overflow-y-auto">
                                {!selectedOrg ? (
                                    <div className="px-4 py-2 text-gray-400 text-sm">
                                        Select sector first
                                    </div>
                                ) : (isUser ? userVenues.length === 0 : venues.length === 0) ? (
                                    <div className="px-4 py-2 text-gray-400 text-sm">
                                        No block found
                                    </div>
                                ) : (
                                    (isUser ? userVenues : venues)
                                        .filter(venue =>
                                            venue.name.toLowerCase().includes(venueSearch.toLowerCase())
                                        )

                                        .map((venue) => (
                                            <div
                                                key={venue._id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                onClick={() => {
                                                    setSelectedVenue(venue);
                                                    setVenueOpen(false);
                                                    setVenueSearch("");
                                                    fetchDevicesByVenue(venue._id);
                                                }}
                                            >
                                                {venue.name}
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Tabs (Desktop) */}
            <div className="hidden md:flex border-b">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium
                ${activeTab === id
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500"
                            }`}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </button>
                ))}
            </div>

            <DeviceTabsAndList
                devices={devicesByV}
                loading={loading}
                activeTab={activeTab}
                initialLoading={!hasLoadedOnceRef.current && loading}
            />
        </aside>
    );
};

export default Sidebar;
