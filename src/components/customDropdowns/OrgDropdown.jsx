import React, { useState, useRef, useEffect } from "react";

const OrgDropdown = ({ organizations, formData, handleOrgChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full mb-3" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="border border-gray-300 rounded-md p-2 cursor-pointer flex justify-between items-center"
            >
                <span>
                    {formData.orgId
                        ? organizations.find((org) => org._id === formData.orgId)?.name
                        : "Select Sector"}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-23 md:max-h-30 overflow-y-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {organizations
                        .filter((org) => org.name.toLowerCase().includes(search.toLowerCase()))
                        .map((org) => (
                            <div
                                key={org._id}
                                onClick={() => {
                                    handleOrgChange({ target: { value: org._id } });
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                                className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                            >
                                {org.name}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default OrgDropdown;
