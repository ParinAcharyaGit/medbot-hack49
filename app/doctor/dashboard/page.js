'use client'

// medbot-hack49/app/doctor-dashboard/page.js

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

const DoctorDashboard = () => {
    const router = useRouter(); // Initialize useRouter

    // Sample appointment data (you can replace this with dynamic data later)
    const [appointments, setAppointments] = useState({
        pending: [
            { id: 1, patient: 'John Doe', date: '2024-10-20', time: '10:00 AM' },
            { id: 2, patient: 'Jane Smith', date: '2024-10-22', time: '02:00 PM' },
        ],
        scheduled: [
            { id: 3, patient: 'Mike Ross', date: '2024-10-21', time: '01:00 PM' },
        ],
        cancelled: [
            { id: 4, patient: 'Rachel Zane', date: '2024-10-19', time: '11:00 AM' },
        ],
    });

    // Function to handle appointment status update
    const updateAppointmentStatus = (id, newStatus) => {
        // Move appointment from its current status to the new status
        const updatedAppointments = { ...appointments };
        let movedAppointment;

        // Find and remove the appointment from its current category
        for (const status in updatedAppointments) {
            const index = updatedAppointments[status].findIndex(app => app.id === id);
            if (index !== -1) {
                movedAppointment = updatedAppointments[status].splice(index, 1)[0];
                break;
            }
        }

        // Add the appointment to the new status category
        if (movedAppointment) {
            updatedAppointments[newStatus].push(movedAppointment);
            setAppointments(updatedAppointments);
        }
    };

    // Update the button click handler to include redirection
    const handleConfirmAppointment = (id) => {
        updateAppointmentStatus(id, 'scheduled'); // Update status
        router.push('/doctor-dashboard/confirm'); // Redirect to /doctor-dashboard/confirm
    };

    return (
        <div className="h-screen p-6">
            <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

            <div className="grid grid-cols-3 gap-4">
                {/* Pending Appointments */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Pending Appointments</h2>
                    <div className="space-y-4">
                        {appointments.pending.length ? (
                            appointments.pending.map(app => (
                                <div key={app.id} className="p-4 bg-yellow-100 rounded shadow">
                                    <p>Patient: {app.patient}</p>
                                    <p>Date: {app.date}</p>
                                    <p>Time: {app.time}</p>
                                    <button
                                        onClick={() => handleConfirmAppointment(app.id)} // Update to use new handler
                                        className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                    >
                                        Confirm Appointment
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No pending appointments</p>
                        )}
                    </div>
                </div>

                {/* Scheduled Appointments */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Scheduled Appointments</h2>
                    <div className="space-y-4">
                        {appointments.scheduled.length ? (
                            appointments.scheduled.map(app => (
                                <div key={app.id} className="p-4 bg-blue-100 rounded shadow">
                                    <p>Patient: {app.patient}</p>
                                    <p>Date: {app.date}</p>
                                    <p>Time: {app.time}</p>
                                    <button
                                        onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                                        className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                    >
                                        Cancel Appointment
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No scheduled appointments</p>
                        )}
                    </div>
                </div>

                {/* Cancelled Appointments */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Cancelled Appointments</h2>
                    <div className="space-y-4">
                        {appointments.cancelled.length ? (
                            appointments.cancelled.map(app => (
                                <div key={app.id} className="p-4 bg-red-100 rounded shadow">
                                    <p>Patient: {app.patient}</p>
                                    <p>Date: {app.date}</p>
                                    <p>Time: {app.time}</p>
                                    <button
                                        onClick={() => updateAppointmentStatus(app.id, 'pending')}
                                        className="mt-2 bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                                    >
                                        Move to Pending
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No cancelled appointments</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
