// medbot-hack49/app/patient-dashboard/page.js
'use client'
import React from 'react';

const PatientDashboard = () => {
    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
                <h1 className="text-lg font-bold">Patient Dashboard</h1>
                <ul>
                    <li>
                        <a href="/" className="text-white hover:underline">
                            Logout
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Content area */}
            <div className="flex flex-grow">
                {/* Side panel */}
                <aside className="w-1/4 bg-gray-100 p-6 border-r border-gray-300">
                    <ul className="space-y-4">
                        <li>
                            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                Upload Document
                            </button>
                        </li>
                        <li>
                            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                View User Profile
                            </button>
                        </li>
                    </ul>
                </aside>

                {/* Main content */}
                <main className="w-3/4 p-6">
                    <form className="space-y-6 bg-white p-6 rounded shadow-lg">
                        <div>
                            <label htmlFor="doctor" className="block text-gray-700 mb-2">
                                Select Doctor:
                            </label>
                            <select
                                id="doctor"
                                name="doctor"
                                className="w-full border border-gray-300 rounded p-2"
                            >
                                {/* Options for doctors */}
                                <option value="">-- Choose a Doctor --</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="reason" className="block text-gray-700 mb-2">
                                Reason for Appointment:
                            </label>
                            <input
                                type="text"
                                id="reason"
                                name="reason"
                                required
                                className="w-full border border-gray-300 rounded p-2"
                                placeholder="Enter reason"
                            />
                        </div>

                        <div>
                            <label htmlFor="additional-info" className="block text-gray-700 mb-2">
                                Additional Info:
                            </label>
                            <textarea
                                id="additional-info"
                                name="additional-info"
                                className="w-full border border-gray-300 rounded p-2"
                                placeholder="Optional"
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-gray-700 mb-2">
                                Select Date:
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                required
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Request Appointment
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default PatientDashboard;
