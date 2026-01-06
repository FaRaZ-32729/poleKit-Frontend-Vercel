import React from "react";

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, loading, itemName = "item" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
                <h2 className="text-lg font-semibold mb-4 text-center">
                    Are you sure you want to delete this{" "}
                    <span className="text-red-600 font-semibold">
                        {itemName}
                    </span>
                    ?
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
