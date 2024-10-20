'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, AppBar, Toolbar } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [time, setTime] = useState("");
    const [timezone, setTimezone] = useState("");
    const [doctorId, setDoctorId] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setDoctorId(user.uid);
            } else {
                console.log("No user is signed in");
            }
        });

        const fetchAppointments = async () => {
            if (!doctorId) return;
            
            const appointmentsRef = collection(db, 'appointments');
            const q = query(appointmentsRef, where('doctorId', '==', doctorId));
            const snapshot = await getDocs(q);
            const appointmentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAppointments(appointmentList);
        };

        fetchAppointments();
        return unsubscribe;
    }, [doctorId]);

    const handleConfirmAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setDialogOpen(true);
    };

    const handleSaveTime = async () => {
        if (selectedAppointment) {
            const appointmentRef = doc(db, 'appointments', selectedAppointment.id);
            await updateDoc(appointmentRef, {
                confirmed: true,
                time, 
                timezone
            });
            setAppointments(prev => 
                prev.map(appointment => 
                    appointment.id === selectedAppointment.id ? { ...appointment, confirmed: true, time, timezone } : appointment
                )
            );
            setDialogOpen(false);
            setSelectedAppointment(null);
            setTime("");
            setTimezone("");
        }
    };

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <div style={{ backgroundColor: 'black', height: '100vh', color: 'white' }}>
            <AppBar position="static" sx={{ backgroundColor: 'black' }}>
                <Toolbar>
                    <Typography>MedBot</Typography>
                    <div style={{ flexGrow: 1 }} />
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            {appointments.map((appointment) => (
                <Card key={appointment.id} style={{ margin: '10px 0', backgroundColor: '#333' }}>
                    <CardContent>
                        <Typography variant="h5">Patient: {appointment.patientName}</Typography>
                        <Typography variant="body1">Reason: {appointment.reason}</Typography>
                        {appointment.confirmed ? (
                            <Typography variant="body1">Time: {appointment.time} ({appointment.timezone})</Typography>
                        ) : (
                            <Button variant="contained" onClick={() => handleConfirmAppointment(appointment)}>Confirm Appointment</Button>
                        )}
                    </CardContent>
                </Card>
            ))}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Set Appointment Time</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        fullWidth
                    />
                    <TextField 
                        label="Time Zone" 
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveTime} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DoctorDashboard;
