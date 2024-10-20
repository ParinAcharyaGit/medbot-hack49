'use client';

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Button, Card, CardContent, Grid, TextField, InputAdornment, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase';
import { auth } from "../../firebase";
import { collection, getDocs, addDoc } from 'firebase/firestore';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PatientDashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [patientName, setPatientName] = useState("");
    const [reason, setReason] = useState("");
    const [appointmentDate, setAppointmentDate] = useState(null);
    const router = useRouter();

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const handleMenuItemClick = (route) => {
        router.push(route);
        setDrawerOpen(false);
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const doctorsCollection = collection(db, 'doctors');
                const doctorSnapshot = await getDocs(doctorsCollection);
                const doctorList = doctorSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDoctors(doctorList);
                setFilteredDoctors(doctorList);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = doctors.filter((doctor) =>
            doctor.name.toLowerCase().includes(term) ||
            doctor.clinicAddress.toLowerCase().includes(term) ||
            doctor.specialization.toLowerCase().includes(term)
        );

        setFilteredDoctors(filtered);
        setNoResults(filtered.length === 0 && term !== "");
    };

    const handleRequestAppointment = (doctor) => {
        setSelectedDoctor(doctor);
        setDialogOpen(true);
    };

    const handleSubmitAppointment = async () => {
        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in to request an appointment.");
            return;
        }

        try {
            await addDoc(collection(db, 'appointments'), {
                doctorId: selectedDoctor.id,
                doctorName: selectedDoctor.name,
                patientName,
                reason,
                appointmentDate: appointmentDate.toISOString(),
                patientId: user.uid,
            });

            setDialogOpen(false);
            setPatientName("");
            setReason("");
            setAppointmentDate(null);

            alert("Appointment requested successfully!");
        } catch (error) {
            console.error("Error saving appointment:", error);
        }
    };

    return (
        <div className='bg-black h-screen'>
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: "#d81b60" }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={toggleDrawer(true)}
                        aria-label="menu"
                    >
                        <MenuIcon />
                        Welcome to Medbot
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer Menu */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List>
                    <ListItem>
                        <Typography variant="h6" fontWeight="bold" sx={{ paddingLeft: 5 }}>MENU</Typography>
                    </ListItem>
                    <hr />
                    <ListItem button className="cursor-pointer" onClick={() => handleMenuItemClick('/patient')}>
                        <ListItemText primary="MedBot" />
                    </ListItem>
                    <hr />
                    <ListItem button className="cursor-pointer" onClick={() => handleMenuItemClick('/home/get-treatment-plan')}>
                        <ListItemText primary="Get Treatment Plan" />
                    </ListItem>
                    <hr />
                    <ListItem button className="cursor-pointer" onClick={() => handleMenuItemClick('/appointments')}>
                        <ListItemText primary="Appointments" />
                    </ListItem>
                    <hr />
                    <ListItem button className="cursor-pointer" onClick={() => {}}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Main Content */}
            <div style={{ padding: '20px' }}>
                {/* Search Bar */}
                <div style={{display: 'flex', justifyContent: 'center' }}>
                <TextField
                    placeholder="Search by Name, Address, or Specialization"
                    value={searchTerm}
                    onChange={handleSearch}
                    variant="outlined"
                    sx={{
                        borderRadius: '20px',
                        marginBottom: '20px',
                        backgroundColor: '#3A3A3A',
                        width: '400px',
                        '& .MuiInputBase-input': {
                            color: 'white',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: 'transparent',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'transparent',
                            },
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon sx={{ color: 'white' }} />
                            </InputAdornment>
                        ),
                    }}
                />
                </div>

                {/* Doctors Cards */}
                <Grid container spacing={3}>
                    {filteredDoctors.map((doctor) => (
                        <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">{doctor.name}</Typography>
                                    <Typography color="textSecondary">Clinic Address: {doctor.clinicAddress}</Typography>
                                    <Typography color="textSecondary">Specialization: {doctor.specialization}</Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleRequestAppointment(doctor)}
                                        sx={{ mt: 2, backgroundColor: "#d81b60" }}
                                    >
                                        Request Appointment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* No Results Message */}
                {noResults && (
                    <Snackbar
                        open={noResults}
                        autoHideDuration={6000}
                        onClose={() => setNoResults(false)}
                    >
                        <Alert onClose={() => setNoResults(false)} severity="info">
                            No records found. Please try a different search.
                        </Alert>
                    </Snackbar>
                )}

                {/* Dialog for requesting appointment */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Request Appointment</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Patient Name"
                            fullWidth
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Reason for Appointment"
                            fullWidth
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            margin="normal"
                        />
                        <DatePicker
                            label="Select Appointment Date"
                            selected={appointmentDate}
                            onChange={(newDate) => setAppointmentDate(newDate)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitAppointment} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default PatientDashboard;
