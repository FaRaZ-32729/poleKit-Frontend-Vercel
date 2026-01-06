import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { useOrganizations } from "../../contextApi/OrganizationContext";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const ListOrganization = () => {
    const { fetchOrganizations, organizations, setOrganizations, loading, error } = useOrganizations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [saving, setSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orgToDelete, setOrgToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const openModal = (org) => {
        setSelectedOrg(org);
        setEditedName(org.name);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrg(null);
        setEditedName("");
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const saveChanges = async () => {
        if (!editedName.trim()) {
            toast.error("Sector name cannot be empty");
            return;
        }
        try {
            setSaving(true);
            const res = await axios.put(`${BASEURL}/organization/update/${selectedOrg._id}`, {
                name: editedName.trim(),
            });
            setOrganizations((prev) =>
                prev.map((org) =>
                    org._id === selectedOrg._id ? res.data.organization : org
                )
            );
            toast.success(res.data.message);
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update Sector");
        } finally {
            setSaving(false);
        }
    };

    // Delete logic
    const confirmDelete = (org) => {
        setOrgToDelete(org);
        setIsDeleteModalOpen(true);
    };

    const cancelDelete = () => {
        setOrgToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const res = await axios.delete(`${BASEURL}/organization/delete/${orgToDelete._id}`);
            setOrganizations((prev) =>
                prev.filter((org) => org._id !== orgToDelete._id)
            );
            toast.success(res.data.message);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete Sector");
        } finally {
            setDeleting(false);
            cancelDelete();
        }
    };

    // if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;

    return (
        <div className="bg-white border border-gray-300 rounded-xl shadow-md w-full h-full p-4 flex flex-col">
            <h1 className="text-gray-800 font-semibold text-xl mb-4 hidden md:block">
                Sector Management
            </h1>

            <div className="mb-4">
                <h2 className="text-center text-gray-800 font-semibold text-lg">
                    Sector List
                </h2>
                <div className="mx-auto mt-2 h-px w-4/5 bg-blue-600/40"></div>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full table-auto text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 font-bold text-gray-800">Sector Name</th>
                            <th className="py-2 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? [...Array(6)].map((_, i) => (
                                <tr key={i} className="animate-pulse border-b border-gray-200">
                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                                    </td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                        <div className="flex gap-2">
                                            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                                            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            : organizations.map((org) => (
                                <tr
                                    key={org._id}
                                    className="border-b border-gray-200 hover:bg-blue-50/60 cursor-pointer transition-colors"
                                >
                                    <td className="py-2 sm:py-3 px-2 sm:px-4">{org.name}</td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                        <div className="flex justify-center gap-2 sm:gap-3">
                                            <button
                                                onClick={() => openModal(org)}
                                                className="rounded-full border border-green-500/50 bg-white flex items-center justify-center hover:bg-green-50 p-[3px] transition"
                                            >
                                                <Pencil className="text-green-600" size={16} />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(org)}
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

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Edit Sector</h2>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={cancelDelete}
                onConfirm={handleDelete}
                loading={deleting}
                itemName="Sector"
            />
        </div>
    );
};

export default ListOrganization;
