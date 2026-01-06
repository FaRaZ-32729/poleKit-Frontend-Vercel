import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useOrganizations } from "../../contextApi/OrganizationContext";
import { useVenues } from "../../contextApi/VenueContext";
import CustomSelect from "../CustomSelect";
import { useAuth } from "../../contextApi/AuthContext";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const ListVenue = () => {
    const { venues, loadingVenues, setVenues, fetchVenues } = useVenues();
    const { organizations } = useOrganizations();
    const { user } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedOrg, setEditedOrg] = useState("");
    const [saving, setSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [venueToDelete, setVenueToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const openModal = (venue) => {
        setSelectedVenue(venue);
        setEditedName(venue.name);
        setEditedOrg(venue.organization?._id || "");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVenue(null);
        setEditedName("");
        setEditedOrg("");
    };
    console.log(selectedVenue)

    const saveChanges = async () => {
        if (!editedName.trim()) {
            toast.error("Block name cannot be empty");
            return;
        }

        try {
            setSaving(true);

            let res;

            if (user.role === "admin") {
                // Admin can update name + organization
                res = await axios.put(
                    `${BASEURL}/venue/admin/update/${selectedVenue._id}`,
                    {
                        name: editedName.trim(),
                        organizationId: editedOrg,
                    }
                );
            } else {
                // Non-admin can update only name
                res = await axios.put(
                    `${BASEURL}/venue/update/${selectedVenue._id}`,
                    { name: editedName.trim() }
                );
            }

            // Update local state
            setVenues((prev) =>
                prev.map((v) =>
                    v._id === selectedVenue._id ? res.data.venue : v
                )
            );

            toast.success(res.data.message);
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update Block");
        } finally {
            setSaving(false);
        }
    };


    const confirmDelete = (venue) => {
        setVenueToDelete(venue);
        setIsDeleteModalOpen(true);
    };

    const cancelDelete = () => {
        setVenueToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const res = await axios.delete(
                `${BASEURL}/venue/delete/${venueToDelete._id}`
            );

            // setVenues((prev) =>
            //     prev.filter((v) => v._id !== venueToDelete._id)
            // );

            await fetchVenues();

            toast.success(res.data.message);
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to delete Block"
            );
        } finally {
            setDeleting(false);
            cancelDelete();
        }
    };

    useEffect(() => {
        fetchVenues();
    }, [])

    return (
        <div className="bg-white border border-gray-300 rounded-xl shadow-md w-full h-full p-4 flex flex-col">

            <h1 className="text-gray-800 font-semibold text-xl mb-4 hidden md:block">
                Block Management
            </h1>

            <div className="mb-4">
                <h2 className="text-center text-gray-800 font-semibold text-lg">
                    Block List
                </h2>
                <div className="mx-auto mt-2 h-px w-4/5 bg-blue-600/40"></div>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full table-auto text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 font-bold text-gray-800">
                                Block Name
                            </th>
                            <th className="py-2 px-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loadingVenues
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
                            : venues.map((venue) => (
                                <tr
                                    key={venue._id}
                                    className="border-b border-gray-200 hover:bg-blue-50/60 cursor-pointer transition-colors"
                                >
                                    <td className="py-2 px-4">{venue.name}</td>

                                    <td className="py-2 px-4">
                                        <div className="flex justify-center gap-2 sm:gap-3">
                                            <button
                                                onClick={() => openModal(venue)}
                                                className="rounded-full border border-green-500/50 bg-white flex items-center justify-center hover:bg-green-50 p-[3px] transition"
                                            >
                                                <Pencil className="text-green-600" size={16} />
                                            </button>

                                            <button
                                                onClick={() => confirmDelete(venue)}
                                                className="rounded-full border border-red-500/50 bg-white flex items-center justify-center hover:bg-red-50 p-[3px] transition"
                                            >
                                                <Trash className="text-red-600" size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>

                </table>
            </div>


            {/* EDIT VENUE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Edit Block</h2>

                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {user.role === "admin" ? (
                            <CustomSelect
                                value={editedOrg}
                                onChange={(val) => setEditedOrg(val)}
                                placeholder="Select Sector"
                                options={organizations.map((org) => ({
                                    label: org.name,
                                    value: org._id,
                                }))}
                            />
                        ) : (
                            <input
                                type="text"
                                value={selectedVenue?.organization || ""}
                                disabled
                                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-sm"
                            />
                        )}


                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 disabled:bg-blue-400"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={cancelDelete}
                onConfirm={handleDelete}
                loading={deleting}
                itemName="Block"
            />
        </div>
    );
};

export default ListVenue;
