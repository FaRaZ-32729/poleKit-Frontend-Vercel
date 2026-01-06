import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import { useAuth } from "../../contextApi/AuthContext";
import { useOrganizations } from "../../contextApi/OrganizationContext";
import { useUsers } from "../../contextApi/UserContext";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import CustomSelect from "../CustomSelect";
import { useStatus } from "../../contextApi/StatusContext";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const UserList = () => {
    const { token, user } = useAuth();
    const { organizations } = useOrganizations();
    const { users, loadingUsers, fetchUsers, setUsers } = useUsers();
    const { updateUserStatus, updating } = useStatus();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserModal, setSelectedUserModal] = useState(null);

    // Form fields
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [editedPassword, setEditedPassword] = useState("");
    const [editedOrganization, setEditedOrganization] = useState("");

    // Delete confirmation state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    // status state
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [activationModalOpen, setActivationModalOpen] = useState(false);
    const [statusUser, setStatusUser] = useState(null);
    const [suspensionReason, setSuspensionReason] = useState("");

    // Fetch users from context
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Edit modal handlers
    const openModal = (user) => {
        setSelectedUserModal(user);
        setEditedName(user.name || "");
        setEditedEmail(user.email || "");
        setEditedPassword("");
        setEditedOrganization(user.organization || "");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserModal(null);
        setEditedName("");
        setEditedEmail("");
        setEditedPassword("");
        setEditedOrganization("");
    };

    const saveChanges = async () => {
        if (!editedName.trim() || !editedEmail.trim()) {
            toast.error("Name and email are required");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: editedName.trim(),
                email: editedEmail.trim(),
                ...(editedPassword.trim() && { password: editedPassword.trim() }),
                organization: editedOrganization || undefined,
            };

            const res = await axios.put(
                `${BASEURL}/users/update/${selectedUserModal._id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers((prev) =>
                prev.map((u) =>
                    u._id === selectedUserModal._id ? res.data.user : u
                )
            );

            toast.success("User updated successfully");
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update user");
        } finally {
            setSaving(false);
        }
    };

    // Delete modal handlers
    const confirmDelete = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const cancelDelete = () => {
        setUserToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);

            await axios.delete(`${BASEURL}/users/delete/${userToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers((prev) =>
                prev.filter((u) => u._id !== userToDelete._id)
            );

            toast.success("User deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete user");
        } finally {
            setDeleting(false);
            cancelDelete();
        }
    };

    const handleStatusClick = (user) => {
        if (user.isActive) {
            setStatusUser(user);
            setSuspensionReason("");
            setStatusModalOpen(true);
        } else {
            setStatusUser(user);
            setActivationModalOpen(true);
        }
    };

    const deactivateUser = async () => {
        if (!suspensionReason.trim()) {
            toast.error("Suspension reason is required");
            return;
        }

        try {
            const updatedUser = await updateUserStatus(
                statusUser._id,
                false,
                suspensionReason
            );

            setUsers((prev) =>
                prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
            );

            toast.success("User deactivated");
            setStatusModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status");
        }
    };

    const activateUser = async () => {
        try {
            const updatedUser = await updateUserStatus(statusUser._id, true);

            setUsers((prev) =>
                prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
            );

            toast.success("User activated");
            setActivationModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status");
        }
    };



    return (
        <div className="bg-white border border-gray-300 rounded-xl shadow-md w-full h-full p-4 flex flex-col">
            <h1 className="text-gray-800 font-semibold text-xl mb-4 hidden md:block">
                User Management
            </h1>

            <div className="mb-4">
                <h2 className="text-center text-gray-800 font-semibold text-lg">
                    User List
                </h2>
                <div className="mx-auto mt-2 h-px w-4/5 bg-blue-600/40"></div>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full table-auto text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 font-bold text-gray-800">Name</th>
                            {
                                user?.role === "admin" && (
                                    <th className="py-2 px-4 font-bold text-gray-800 text-center">Status</th>
                                )
                            }
                            <th className="py-2 px-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loadingUsers
                            ? [...Array(4)].map((_, i) => (
                                <tr key={i} className="animate-pulse border-b border-gray-200">
                                    <td className="py-2 px-4">
                                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto"></div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="flex justify-center gap-2">
                                            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                                            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            : users.map((u) => (
                                <tr
                                    key={u._id}
                                    className="border-b border-gray-200 hover:bg-blue-50/60 transition-colors text-sm md:text-base"
                                >
                                    <td className="py-2 px-4">{u.name}</td>
                                    {/* <td className="py-2 px-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-sm font-medium ${user.isActive
                                                ? "bg-green-500/70"
                                                : "bg-red-500/70"
                                                }`}
                                        >
                                            {user.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td> */}
                                    {user?.role === "admin" && (
                                        <td className="py-2 px-4 text-center">
                                            <span
                                                onClick={() => handleStatusClick(u)}
                                                className={`px-3 py-1 rounded-full text-white text-sm font-medium cursor-pointer ${u.isActive ? "bg-green-500/70" : "bg-red-500/70"
                                                    }`}
                                            >
                                                {u.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    )}

                                    <td className="py-2 px-4 flex justify-center gap-2">
                                        <button
                                            onClick={() => openModal(u)}
                                            className="rounded-full border border-green-500/50 bg-white flex items-center justify-center hover:bg-green-50 p-[3px] transition"
                                        >
                                            <Pencil className="text-green-600" size={16} />
                                        </button>

                                        <button
                                            onClick={() => confirmDelete(u)}
                                            className="rounded-full border border-red-500/50 bg-white flex items-center justify-center hover:bg-red-50 p-[3px] transition"
                                        >
                                            <Trash className="text-red-600" size={16} />
                                        </button>
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
                        <h2 className="text-lg font-semibold mb-4">Edit User</h2>

                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Name"
                            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            value={editedPassword}
                            onChange={(e) => setEditedPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <CustomSelect
                            value={editedOrganization}
                            onChange={setEditedOrganization}
                            placeholder="Select Sector"
                            options={organizations.map((org) => ({
                                label: org.name,
                                value: org._id,
                            }))}
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
            {/* Deactivation Modal */}
            {statusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-3">Deactivate User</h2>

                        <textarea
                            value={suspensionReason}
                            onChange={(e) => setSuspensionReason(e.target.value)}
                            placeholder="Enter suspension reason"
                            className="w-full border border-gray-300 rounded-md p-2 mb-4"
                            rows={4}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setStatusModalOpen(false)}
                                className="px-4 py-2 border rounded-md"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deactivateUser}
                                disabled={updating}
                                className="px-4 py-2 bg-red-600 text-white rounded-md"
                            >
                                {updating ? "Updating..." : "Deactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Activation Confirmation Modal */}
            {activationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Activate this user?
                        </h2>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setActivationModalOpen(false)}
                                className="px-4 py-2 border rounded-md"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={activateUser}
                                disabled={updating}
                                className="px-4 py-2 bg-green-600 text-white rounded-md"
                            >
                                {updating ? "Updating..." : "Activate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={cancelDelete}
                onConfirm={handleDelete}
                loading={deleting}
                itemName="user"
            />
        </div>
    );
};

export default UserList;
