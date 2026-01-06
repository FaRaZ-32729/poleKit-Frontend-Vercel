import React, { useState } from "react";
import UserList from "../components/users/UserList";
import AddUser from "../components/users/AddUser";
import { X } from "lucide-react";

const UserManagement = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleUserSelect = (user) => setSelectedUser(user);

    return (
        <div className="bg-white rounded-2xl w-full h-full p-4 md:p-6 relative">
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-col md:flex-row gap-2 h-full w-full shadow-md rounded-2xl px-10 py-5">
                <div className="flex-1 min-h-[400px] md:min-h-0">
                    <UserList onEdit={handleUserSelect} selectedUser={selectedUser} />
                </div>
                {/* <div className="hidden md:block w-px bg-gray-200"></div> */}
                <div className="flex-1 min-h-[400px] md:min-h-0 flex justify-center">
                    <AddUser selectedUser={selectedUser} />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-4 pb-24">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition self-end inline-block"
                >
                    Add User
                </button>

                <UserList onEdit={handleUserSelect} selectedUser={selectedUser} />

                {/* Add User Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-[#EEF3F9] border border-gray-300 rounded-xl shadow-md w-full max-w-md p-6 flex flex-col justify-center relative">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                            >
                                <X size={20} />
                            </button>
                            <AddUser selectedUser={selectedUser} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
