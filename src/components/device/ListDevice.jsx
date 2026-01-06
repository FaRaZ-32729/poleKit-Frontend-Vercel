import React, { useEffect, useState, useRef } from "react";
import { Pencil, Trash } from "lucide-react";
import { toast } from "react-toastify";
import axios from "../../axiosConfig";
import { useDevices } from "../../contextApi/DeviceContext";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useOrganizations } from "../../contextApi/OrganizationContext";
import { useVenues } from "../../contextApi/VenueContext";
import CustomSelect from "../CustomSelect";
import MapPicker from "./MapPicker";
import VenueDropdown from "../customDropdowns/VenueDropdown.jsx";
import OrgDropdown from "../customDropdowns/OrgDropdown";

const ListDevice = () => {
    const { devices, setDevices, fetchDevices, loading } = useDevices();
    const { organizations } = useOrganizations();
    const { fetchVenuesByOrg } = useVenues();
    const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
    const [venueSearch, setVenueSearch] = useState("");
    const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [orgSearch, setOrgSearch] = useState("");
    const orgDropdownRef = useRef(null);
    const venueDropdownRef = useRef(null);




    const [filteredVenues, setFilteredVenues] = useState([]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        deviceId: "",
        orgId: "",
        venueId: "",
        latitude: "",
        longitude: "",
    });


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchDevices();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target)) {
                setIsOrgDropdownOpen(false);
            }
            if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target)) {
                setIsVenueDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    /* ================= EDIT ================= */
    const handleOrgChange = async (e) => {
        const selectedOrgId = e.target.value;

        setFormData((prev) => ({
            ...prev,
            orgId: selectedOrgId,
            venueId: "",
        }));

        // Fetch filtered venues using context function
        const venues = await fetchVenuesByOrg(selectedOrgId);
        setFilteredVenues(venues);
    };

    const openModal = async (device) => {
        setSelectedDevice(device);

        const orgId = device.orgId || (device.venue?.organization?._id || device.venue?.organization);
        const venueId = device.venue?._id || device.venue || "";

        setFormData({
            deviceId: device.deviceId || "",
            orgId: orgId || "",
            venueId: venueId,
            latitude: device.latitude ?? "",
            longitude: device.longitude ?? "",
        });

        // fetch venues for this org to populate dropdown
        if (orgId) {
            try {
                const res = await axios.get(`/venue/venue-by-org/${orgId}`);
                setFilteredVenues(res.data.venues || []);
            } catch (err) {
                console.error(err);
                setFilteredVenues([]);
            }
        } else {
            setFilteredVenues([]);
        }

        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDevice(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveChanges = async () => {
        if (!formData.deviceId.trim()) {
            toast.error("Device ID cannot be empty");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                deviceId: formData.deviceId.trim() || selectedDevice.deviceId,
                orgId: formData.orgId || selectedDevice.orgId,
                venueId: formData.venueId || selectedDevice.venue?._id,
                latitude:
                    formData.latitude !== ""
                        ? Number(formData.latitude)
                        : selectedDevice.latitude,
                longitude:
                    formData.longitude !== ""
                        ? Number(formData.longitude)
                        : selectedDevice.longitude,
            };

            const res = await axios.put(`/device/update/${selectedDevice._id}`, payload);

            setDevices((prev) =>
                prev.map((d) =>
                    d._id === selectedDevice._id ? res.data.device : d
                )
            );

            toast.success(res.data.message);
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update device");
        } finally {
            setSaving(false);
        }
    };


    /* ================= DELETE ================= */

    const confirmDelete = (device) => {
        setDeviceToDelete(device);
        setIsDeleteModalOpen(true);
    };

    const cancelDelete = () => {
        setDeviceToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const res = await axios.delete(
                `/device/delete/${deviceToDelete._id}`
            );

            setDevices((prev) =>
                prev.filter((d) => d._id !== deviceToDelete._id)
            );

            toast.success(res.data.message);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete device");
        } finally {
            setDeleting(false);
            cancelDelete();
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded-xl shadow-md w-full h-full p-4 flex flex-col">
            <h1 className="text-gray-800 font-semibold text-xl mb-4 hidden md:block">
                Device Management
            </h1>

            <div className="mb-4">
                <h2 className="text-center text-gray-800 font-semibold text-lg">
                    Device List
                </h2>
                <div className="mx-auto mt-2 h-px w-4/5 bg-blue-600/40"></div>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full table-auto text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 font-bold text-gray-800">
                                Device ID
                            </th>
                            <th className="py-2 px-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading
                            ? [...Array(6)].map((_, i) => (
                                <tr
                                    key={i}
                                    className="animate-pulse border-b border-gray-200"
                                >
                                    <td className="py-2 px-4">
                                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="flex justify-center gap-2">
                                            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                                            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            : devices.map((device) => (
                                <tr
                                    key={device._id}
                                    className="border-b border-gray-200 hover:bg-blue-50/60 cursor-pointer transition-colors"
                                >
                                    <td className="py-2 px-4">
                                        {device.deviceId}
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    openModal(device)
                                                }
                                                className="rounded-full border border-green-500/50 bg-white hover:bg-green-50 p-[3px]"
                                            >
                                                <Pencil
                                                    className="text-green-600"
                                                    size={16}
                                                />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    confirmDelete(device)
                                                }
                                                className="rounded-full border border-red-500/50 bg-white hover:bg-red-50 p-[3px]"
                                            >
                                                <Trash
                                                    className="text-red-600"
                                                    size={16}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {/* ================= EDIT MODAL ================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Edit Device</h2>

                        <div className="space-y-3">
                            <input
                                name="deviceId"
                                value={formData.deviceId}
                                onChange={handleChange}
                                placeholder="Device ID"
                                className="w-full border rounded-md p-2"
                            />

                            <OrgDropdown
                                organizations={organizations}
                                formData={formData}
                                handleOrgChange={handleOrgChange}
                            />

                            <VenueDropdown
                                filteredVenues={filteredVenues}
                                formData={formData}
                                setFormData={setFormData}
                                selectedDevice={selectedDevice}
                            />

                            <button
                                onClick={() => setShowMap(true)}
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-md"
                            >
                                Select Location on Map
                            </button>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={closeModal} className="px-4 py-2 border rounded-md">
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="px-4 py-2 bg-blue-700 text-white rounded-md disabled:bg-blue-400"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}




            {/* ================= DELETE MODAL ================= */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={cancelDelete}
                onConfirm={handleDelete}
                loading={deleting}
                itemName="device"
            />

            {/* Map Modal */}
            {showMap && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-11/12 max-w-2xl p-4">
                        <MapPicker
                            initialPosition={
                                formData.latitude && formData.longitude
                                    ? { lat: Number(formData.latitude), lng: Number(formData.longitude) }
                                    : null
                            }
                            onSelect={(latlng) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    latitude: latlng.lat,
                                    longitude: latlng.lng,
                                }));
                            }}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowMap(false)} className="px-4 py-2 border rounded-md">
                                Cancel
                            </button>
                            <button onClick={() => setShowMap(false)} className="px-4 py-2 bg-blue-700 text-white rounded-md">
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ListDevice;
