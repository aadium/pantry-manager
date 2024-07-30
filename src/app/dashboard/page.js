'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TextField, Button, Container, Typography, Box, IconButton } from '@mui/material'
import { CircularProgress } from "@mui/material";
import { AddRounded, SearchRounded } from '@mui/icons-material';

export default function Dashboard() {
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
      </Container>
    </div>
  )
}