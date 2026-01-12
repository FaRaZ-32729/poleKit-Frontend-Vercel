import React from 'react'

const ResetPassword = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-0">
            <div className="grid md:grid-cols-2 rounded-4xl items-stretch max-w-7xl w-full bg-white shadow-lg overflow-hidden">

                {/* Left (Form) Section */}
                <div className="lg:p-0 p-8 w-full">
                    <form className="space-y-6 lg:p-24 p-0">
                        <div className="mb-8 text-center md:text-left">
                            {/* <img
                                src="/logo.png"
                                alt="IoTify Logo"
                                className="h-10 mx-auto md:mx-0 mb-4"
                            /> */}
                            <img src="/poleKitLogoD.png" alt="SmartVolt Logo" className="h-10 sm:h-15 mx-auto md:mx-0 mb-4" />
                            <h3 className="text-slate-900 text-2xl font-semibold">
                                Set a New Password
                            </h3>
                            <p className="text-slate-500 text-sm mt-2">
                                Create a secure password with at least one uppercase letter,
                                one special character, and minimum 8 characters.
                            </p>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="sr-only">New Password</label>
                            <div className="relative flex items-center">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full text-sm text-slate-800 border border-slate-300 pl-10 pr-10 py-3 rounded-lg outline-blue-600"
                                />

                                {/* Lock icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#bbb"
                                    stroke="#bbb"
                                    className="w-[18px] h-[18px] absolute left-4"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17 9v-2c0-2.76-2.24-5-5-5s-5 2.24-5 5v2h-3v14h16v-14h-3zm-9 0v-2c0-2.209 1.791-4 4-4s4 1.791 4 4v2h-8zm12 12h-12v-10h12v10z" />
                                </svg>

                                {/* Eye icon (visual only) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#bbb"
                                    stroke="#bbb"
                                    className="w-[18px] h-[18px] absolute right-4"
                                    viewBox="0 0 128 128"
                                >
                                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104z" />
                                </svg>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="sr-only">Confirm Password</label>
                            <div className="relative flex items-center">
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full text-sm text-slate-800 border border-slate-300 pl-10 pr-10 py-3 rounded-lg outline-blue-600"
                                />

                                {/* Lock icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#bbb"
                                    stroke="#bbb"
                                    className="w-[18px] h-[18px] absolute left-4"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17 9v-2c0-2.76-2.24-5-5-5s-5 2.24-5 5v2h-3v14h16v-14h-3zm-9 0v-2c0-2.209 1.791-4 4-4s4 1.791 4 4v2h-8zm12 12h-12v-10h12v10z" />
                                </svg>

                                {/* Eye icon (visual only) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#bbb"
                                    stroke="#bbb"
                                    className="w-[18px] h-[18px] absolute right-4"
                                    viewBox="0 0 128 128"
                                >
                                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104z" />
                                </svg>
                            </div>
                        </div>

                        <div className="!mt-6">
                            <button
                                type="button"
                                className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                                Set Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right (Images) Section */}
                {/* <div className="h-full hidden md:flex flex-col items-center justify-between p-4 bg-[#EAEAEA]">
                    <div className="w-full flex justify-end p-4">
                        <img
                            src="/login-right-top-image.png"
                            className="h-16 w-auto object-contain"
                            alt="Top Right Illustration"
                        />
                    </div>

                    <div className="flex-grow flex items-center justify-center p-4">
                        <img
                            src="/login-image.png"
                            className="w-full h-auto object-contain"
                            alt="Illustration"
                        />
                    </div>
                </div> */}
                {/* Right Panel */}
                <div style={{ backgroundColor: "#EAEAEA" }} className="h-full hidden md:flex flex-col items-center justify-between p-4">

                    <div className="flex-grow flex items-center justify-center p-4">
                        <img src="/poleKitLogin.png" className="w-full h-auto object-contain" />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ResetPassword
