'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TextField, Button, Container, Typography, Box, IconButton } from '@mui/material'
import { CircularProgress } from "@mui/material";
import { AddRounded, SearchRounded } from '@mui/icons-material';
import firebase from '@/app/firebase'
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; // Import Firebase Auth

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pantry, setPantry] = useState([])

  async function fetchData(req) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) {
          return { error: 'User not authenticated.' };
        }
        const collectionRef = firebase.firestore().collection("pantry");
        const snapshot = await collectionRef.get();
        const documents = snapshot.docs.map(doc => doc.data());
        console.log(documents);
        setPantry(documents);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
  }

  async function check() {
    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        return { success: true, user: currentUser, message: 'User is logged in.' };
      } else {
        return { success: false, message: 'No user is logged in.' };
      }
    } catch (error) {
      console.error(error);
      return { error: 'Something went wrong.' };
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const res = await check()
      const data = res;
      if (!data.success) {
        router.push('/')
      }
      fetchData();
    };
    checkAuth();
  }, [])
  return (
    <div>
      <Container>
        <Box sx={{
          marginY: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <AddRounded color="primary" sx={{ marginY: 2, marginX: 2 }} />
          <TextField
            label="Search"
            variant='outlined'
            sx={{ width: '80%' }}
          />
          <SearchRounded color="primary" sx={{ marginY: 2, marginX: 2 }} />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {pantry.map((item, index) => (
            <Box key={index} sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
              marginY: 1,
              border: '1px solid #ccc',
              borderRadius: 4,
            }}>
              <Typography>{item.name}</Typography>
              <Typography>{item.price}</Typography>
              <Typography>{item.qty}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </div>
  )
}