import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const VenueSelectDropdown = ({ venues, selectedVenues, onChange }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleVenue = (id) => {
        if (selectedVenues.includes(id)) {
            onChange(selectedVenues.filter((v) => v !== id));
        } else {
            onChange([...selectedVenues, id]);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Input */}
            <div
                onClick={() => setOpen(!open)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white cursor-pointer flex justify-between items-center"
            >
                <span className="text-gray-600 text-sm md:text-base">
                    {selectedVenues.length > 0
                        ? `${selectedVenues.length} block(s) selected`
                        : "Assign Blocks"}
                </span>
                <ChevronDown size={18} className="text-gray-500" />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-23 md:max-h-30 overflow-y-auto">
                    {venues.map((venue) => {
                        const isSelected = selectedVenues.includes(venue._id);
                        return (
                            <div
                                key={venue._id}
                                onClick={() => toggleVenue(venue._id)}
                                className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            >
                                <span className="text-sm md:text-base">
                                    {venue.name}
                                </span>
                                {isSelected && (
                                    <Check size={16} className="text-blue-600" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default VenueSelectDropdown;
