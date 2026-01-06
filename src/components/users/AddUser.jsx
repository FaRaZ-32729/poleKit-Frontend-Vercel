import React, { useState } from "react";
import { Mail, User, X } from "lucide-react";
import { useAuth } from "../../contextApi/AuthContext";
import { useOrganizations } from "../../contextApi/OrganizationContext";
import { useVenues } from "../../contextApi/VenueContext";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import CustomSelect from "../CustomSelect";
import { useUsers } from "../../contextApi/UserContext";
import VenueSelectDropdown from "../VenueSelectDropdown";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const AddUser = () => {
    const { user: loggedInUser, token } = useAuth();
    const { organizations } = useOrganizations();
    const { venues } = useVenues();
    const { fetchUsers } = useUsers();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [organizationId, setOrganizationId] = useState("");
    const [selectedVenues, setSelectedVenues] = useState([]);
    const [saving, setSaving] = useState(false);

    const isAdmin = loggedInUser?.role === "admin";

    const handleVenueSelect = (venueId) => {
        if (!venueId) return;

        setSelectedVenues((prev) =>
            prev.includes(venueId) ? prev : [...prev, venueId]
        );
    };

    const removeVenue = (venueId) => {
        setSelectedVenues((prev) => prev.filter((id) => id !== venueId));
    };

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim()) {
            toast.error("Name and email are required");
            return;
        }

        if (isAdmin && !organizationId) {
            toast.error("Sector is required");
            return;
        }

        if (!isAdmin && selectedVenues.length === 0) {
            toast.error("Please select at least one block");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: name.trim(),
                email: email.trim(),
                role: "user",
                ...(isAdmin
                    ? { organizationId }
                    : { venues: selectedVenues }),
            };

            const res = await axios.post(`${BASEURL}/auth/register`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success(res.data.message);

            setName("");
            setEmail("");
            setOrganizationId("");
            setSelectedVenues([]);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create user");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-[#EEF3F9] border border-gray-300 rounded-xl shadow-md w-full max-w-md p-6 flex flex-col justify-center">
            <h2 className="text-center text-xl font-semibold mb-1">Add User</h2>
            <p className="text-center text-gray-500 mb-6">
                Fill the form to add a user
            </p>

            <div className="space-y-4 w-full">
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Organization (Admin only) */}
                {isAdmin && (
                    <CustomSelect
                        value={organizationId}
                        onChange={(val) => setOrganizationId(val)}
                        placeholder="Select sector"
                        options={organizations.map((org) => ({
                            label: org.name,
                            value: org._id,
                        }))}
                    />
                )}

                {/* Venues (Normal user) */}
                {!isAdmin && (
                    <VenueSelectDropdown
                        venues={venues}
                        selectedVenues={selectedVenues}
                        onChange={setSelectedVenues}
                    />
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-md transition duration-300 shadow-md"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default AddUser;
