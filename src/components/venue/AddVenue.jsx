import React, { useEffect, useState } from "react";
import { Box } from "lucide-react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useOrganizations } from "../../contextApi/OrganizationContext";
import CustomSelect from "../CustomSelect";
import { useAuth } from "../../contextApi/AuthContext";
import { useVenues } from "../../contextApi/VenueContext";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const AddVenue = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [organization, setOrganization] = useState("");
    const [loading, setLoading] = useState(false);

    const { organizations, fetchOrganizations } = useOrganizations();
    const { fetchVenues } = useVenues();


    useEffect(() => {
        if (user.role !== "admin") {
            setOrganization(user.organization._id);
        }
    }, [user]);

    const handleSave = async () => {
        if (!name.trim()) return toast.error("Block name is required");
        if (!organization) return toast.error("Please select an sector");

        try {
            setLoading(true);

            const res = await axios.post(`${BASEURL}/venue/add`, {
                name,
                organization,
            });

            toast.success(res.data.message || "Block created successfully");

            //reset input values
            setName("");
            if (user.role === "admin") {
                setOrganization("");
            }

            // Refresh list
            fetchOrganizations();
            fetchVenues();

            setTimeout(() => {
                navigate("/venue");
            }, 1000);

        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message ||
                "Something went wrong while adding Block"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#EEF3F9] border border-gray-300 rounded-xl shadow-md w-full max-w-md p-6 flex flex-col justify-center ">
            <h2 className="text-center text-xl font-semibold mb-1">Add Block</h2>
            <p className="text-center text-gray-500 mb-6">
                Welcome back! Select method to add Block
            </p>

            <form className="space-y-4 w-full" onSubmit={(e) => e.preventDefault()}>
                {/* Venue Name Input */}
                <div className="relative">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Block Name"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Organization Select */}
                {/* <div className="relative">
                    <CustomSelect
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Select Organization"
                        options={organizations.map((org) => ({ label: org.name, value: org._id }))}
                    />
                </div> */}
                {user.role === "admin" ? (
                    <CustomSelect
                        value={organization}
                        onChange={(val) => setOrganization(val)}
                        placeholder="Select Sector"
                        options={organizations.map((org) => ({ label: org.name, value: org._id }))}
                    />
                ) : (
                    <input
                        type="text"
                        value={user.organization.name}
                        disabled
                        className="w-full pl-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-xs md:text-base"
                    />
                )}

                {/* Save Button */}
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-md transition duration-300 shadow-md disabled:bg-blue-400"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
};

export default AddVenue;
