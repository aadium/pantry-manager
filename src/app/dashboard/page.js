'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TextField, Button, Container, Typography, Box, IconButton } from '@mui/material'
import { CircularProgress } from "@mui/material";
import { AddRounded, SearchRounded } from '@mui/icons-material';

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pantry, setPantry] = useState([])

  const fetchData = async () => {
    const res = await fetch('/api/pantry')
    const data = await res.json()
    setPantry(data)
  }

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/check')
      const data = await res.json()
      if (!data.success) {
        router.push('/')
        return
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
              <Typography>{item.quantity}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </div>
  )
}