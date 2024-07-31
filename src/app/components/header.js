import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import firebase from '@/app/firebase'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const Header = () => {
    async function logout() {
        try {
            await firebase.auth().signOut();
            console.log('User signed out successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error during logout:', error);
            return { error: 'Something went wrong.' };
        }
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Pantry
                </Typography>
                <Button color="inherit" onClick={
                    async () => {
                        const response = await logout();
                        if (response.success) {
                            window.location.href = '/login';
                        }
                    }
                }>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;