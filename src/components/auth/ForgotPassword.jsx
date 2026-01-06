import React from 'react'

const ForgotPassword = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-0">
            <div className="grid md:grid-cols-2 rounded-4xl items-stretch max-w-7xl w-full bg-white shadow-lg overflow-hidden">

                {/* Left (Form) Section */}
                <div className="p-8 w-full">
                    <form className="space-y-6 lg:p-24 p-0">
                        <div className="mb-8 text-center md:text-left">
                            <img
                                src="/logo.png"
                                alt="IoTify Logo"
                                className="h-10 mx-auto md:mx-0 mb-4"
                            />
                            <h3 className="text-slate-900 text-2xl font-semibold">
                                Forgot Password
                            </h3>
                            <p className="text-slate-500 text-sm mt-2">
                                Enter your account email — we’ll send a reset link that expires in
                                15 minutes.
                            </p>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="sr-only">Email</label>
                            <div className="relative flex items-center">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full text-sm text-slate-800 border border-slate-300 pl-10 pr-4 py-3 rounded-lg outline-blue-600"
                                />

                                {/* Mail icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#bbb"
                                    stroke="#bbb"
                                    className="w-[18px] h-[18px] absolute left-4"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </div>
                        </div>

                        <div className="!mt-6">
                            <button
                                type="button"
                                className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                                Send Reset Link
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right (Images) Section */}
                <div className="h-full hidden md:flex flex-col items-center justify-between p-4 bg-[#EAEAEA]">
                    {/* Top Image */}
                    <div className="w-full flex justify-end p-4">
                        <img
                            src="/login-right-top-image.png"
                            className="h-16 w-auto object-contain"
                            alt="Top Right Illustration"
                        />
                    </div>

                    {/* Main Image */}
                    <div className="flex-grow flex items-center justify-center p-4">
                        <img
                            src="/login-image.png"
                            className="w-full h-auto object-contain"
                            alt="Illustration"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ForgotPassword
