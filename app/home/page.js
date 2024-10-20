'use client';

import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Button,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const PatientDashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const router = useRouter();

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const handleMenuItemClick = (route) => {
        router.push(route);
        setDrawerOpen(false);
    };

    // Fetch doctors from Firestore
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
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div>
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: "black" }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={toggleDrawer(true)}
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        MedBot
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer Menu */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List>
                    <ListItem button onClick={() => handleMenuItemClick('/patient')}>
                        <ListItemText primary="MedBot" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuItemClick('/get-treatment-plan')}>
                        <ListItemText primary="Get Treatment Plan" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuItemClick('/appointments')}>
                        <ListItemText primary="Appointments" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Main Content */}
            <div style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Available Doctors
                </Typography>
                <Grid container spacing={3}>
                    {doctors.map((doctor) => (
                        <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">{doctor.name}</Typography>
                                    <Typography color="textSecondary">{doctor.clinicAddress}</Typography>
                                    <Typography color="textSecondary">{doctor.specialization}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => alert(`Requesting appointment with ${doctor.name}`)}
                                        sx={{ mt: 2 }}
                                    >
                                        Request Appointment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

export default PatientDashboard;
