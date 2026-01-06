import { Box } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOrganizations } from "../../contextApi/OrganizationContext";


const BASEURL = import.meta.env.VITE_BACKEND_URL;


const AddOrganization = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { fetchOrganizations } = useOrganizations();

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Sector name is required");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${BASEURL}/organization/add`, { name });

            toast.success(res.data.message || "Sector added successfully");
            fetchOrganizations();

            // Navigate to organization list page after 1s
            setTimeout(() => {
                navigate("/organization");
            }, 1000);

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong while adding Sector");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#EEF3F9] border border-gray-300 rounded-xl shadow-md w-full max-w-md p-6 flex flex-col justify-center">
            <h2 className="text-center text-xl font-semibold mb-1">Add Sector</h2>
            <p className="text-center text-gray-500 mb-6">
                Welcome back! Enter Sector details
            </p>

            <form className="space-y-4 w-full" onSubmit={(e) => e.preventDefault()}>
                {/* Organization Name Input */}
                <div className="relative">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="organization_name"
                        placeholder="Sector Name"
                        className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

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

export default AddOrganization;
