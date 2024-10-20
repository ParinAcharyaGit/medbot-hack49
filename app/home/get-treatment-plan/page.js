'use client'

// This is where the patient can upload the document and 
// use Gemini curated treatment plan

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Button, Card, CardContent, Grid, TextField, InputAdornment, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { db } from '@/firebase';
import { auth } from '@/firebase';
import CreateRecordModal from '@/app/components/create-record-modal'; // Adjust the import path
import RecordCard from '@/app/components/record-card'; // Adjust the import path

 const TreatmentPlan = () => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to request an appointment.");
    }
    return (
        <div className='flex flex-wrap'>
            <button
            type='button'
            className='mt-6 inline-flex my-auto items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800'
            >
                Upload Document Record
            </button>

        </div>
    )
}

export default TreatmentPlan