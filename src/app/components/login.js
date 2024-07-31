'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TextField, Button, Container, Typography, Box } from '@mui/material'
import {CircularProgress} from "@mui/material";
import firebase from '@/app/firebase'
import { getAuth, setPersistence, browserSessionPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function login(email, password) {
        try {
            if (!email || !password) {
                return { error: 'Email and password are required.' };
            }
    
            const auth = getAuth();
            await setPersistence(auth, browserSessionPersistence);
    
            const result = await signInWithEmailAndPassword(auth, email, password);
    
            console.log('User signed in successfully:', result.user);
            return { success: true, user: result.user };
        } catch (error) {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                return { error: 'Invalid credentials.', msg: error.message };
            } else if (error.code === 'auth/missing-email') {
                return { error: 'Email is required.' };
            } else {
                console.error('Error during login:', error);
                return { error: 'Something went wrong.' };
            }
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')

        const response = await login(email, password);

        if (response.success) {
            setLoading(false)
            console.log('Login successful!')
            router.push('/dashboard')
        } else {
            setLoading(false)
            const errorData = response.error;
            setError(errorData.error || 'An error occurred. Please try again.')
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    px: 4,
                    pt: 4,
                    pb: 2,
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign into the pantry manager
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {
                            loading ? <CircularProgress size={24} sx={{
                                color: 'white'
                            }} /> : 'Sign In'
                        }
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}