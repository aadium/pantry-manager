'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TextField, Button, Container, Typography, Box, IconButton, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { AddRounded, RemoveRounded, SearchRounded } from '@mui/icons-material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebase from '@/app/firebase'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import Header from './components/header';
import AddItemModal from './components/addItemModal';

export default function Inventory() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pantry, setPantry] = useState([])
  const [openAddItemModal, setOpenAddItemModal] = useState(false)

  const handleClose = () => {
    setOpenAddItemModal(false)
  }

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

  const incrementQty = async (item) => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error('User not authenticated.');
        return { error: 'User not authenticated.' };
      }
  
      const collectionRef = firebase.firestore().collection("pantry");
  
      console.log(`Attempting to increment quantity for document with name: ${item.name}`);
  
      const querySnapshot = await collectionRef.where('name', '==', item.name).get();
      if (querySnapshot.empty) {
        console.error('Document does not exist.');
        return { error: 'Document does not exist.' };
      }
  
      const docRef = querySnapshot.docs[0].ref;
  
      const qty = item.qty + 1;
  
      await docRef.update({
        qty: qty
      });
      console.log(`Document with name ${item.name} updated successfully.`);
  
      const snapshot = await collectionRef.get();
      const documents = snapshot.docs.map(doc => doc.data());
      console.log(documents);
      setPantry(documents);
    } catch (error) {
      console.error('Error updating document:', error);
      return { error: 'Something went wrong.' };
    }
  }

  const decrementQty = async (item) => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error('User not authenticated.');
        return { error: 'User not authenticated.' };
      }
  
      const collectionRef = firebase.firestore().collection("pantry");
  
      console.log(`Attempting to decrement quantity for document with name: ${item.name}`);
  
      const querySnapshot = await collectionRef.where('name', '==', item.name).get();
      if (querySnapshot.empty) {
        console.error('Document does not exist.');
        return { error: 'Document does not exist.' };
      }
  
      const docRef = querySnapshot.docs[0].ref;
  
      const qty = item.qty - 1;
      if (qty < 1) {
        console.error('Quantity cannot be less than 1.');
        return { error: 'Quantity cannot be less than 1.' };
      }
      await docRef.update({
        qty: qty
      });
      console.log(`Document with name ${item.name} updated successfully.`);
  
      const snapshot = await collectionRef.get();
      const documents = snapshot.docs.map(doc => doc.data());
      console.log(documents);
      setPantry(documents);
    } catch (error) {
      console.error('Error updating document:', error);
      return { error: 'Something went wrong.' };
    }
  }

  const deleteItem = async (item) => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error('User not authenticated.');
        return { error: 'User not authenticated.' };
      }
  
      const collectionRef = firebase.firestore().collection("pantry");
  
      console.log(`Attempting to delete document with name: ${item.name}`);
  
      const querySnapshot = await collectionRef.where('name', '==', item.name).get();
      if (querySnapshot.empty) {
        console.error('Document does not exist.');
        return { error: 'Document does not exist.' };
      }
  
      const docRef = querySnapshot.docs[0].ref;
  
      await docRef.delete();
      console.log(`Document with name ${item.name} deleted successfully.`);
  
      const snapshot = await collectionRef.get();
      const documents = snapshot.docs.map(doc => doc.data());
      console.log(documents);
      setPantry(documents);
    } catch (error) {
      console.error('Error deleting document:', error);
      return { error: 'Something went wrong.' };
    }
  }

  const handleDeleteItem = async (item) => {
    let confirmDelete = confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) {
      return;
    }
    try {
      const result = await deleteItem(item);
    } catch (error) {
      console.error(error);
    }
  }

  async function check() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve({ success: true, user: user, message: 'User is logged in.' });
        } else {
          resolve({ success: false, message: 'No user is logged in.' });
        }
      }, (error) => {
        console.error(error);
        reject({ error: 'Something went wrong.' });
      });
    });
  }

  const search = async (query) => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error('User not authenticated.');
        return { error: 'User not authenticated.' };
      }
  
      const collectionRef = firebase.firestore().collection("pantry");
  
      console.log(`Searching for documents with query: ${query}`);
  
      // Fetch all documents and filter client-side
      const querySnapshot = await collectionRef.get();
      if (querySnapshot.empty) {
        console.error('No documents found.');
        return { error: 'No documents found.' };
      }
  
      // Filter documents where the name contains the query string
      const documents = querySnapshot.docs
        .map(doc => doc.data())
        .filter(doc => doc.name && doc.name.toLowerCase().includes(query.toLowerCase()));
  
      if (documents.length === 0) {
        console.error('No documents found.');
        return { error: 'No documents found.' };
      }
  
      console.log(documents);
      setPantry(documents);
    } catch (error) {
      console.error('Error searching documents:', error);
      return { error: 'Something went wrong.' };
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await check()
      const data = res;
      if (!data.success) {
        router.push('/login')
      }
      fetchData();
    };
    checkAuth();
  }, [])
  return (
    <div>
      <Header />
      <Container>
        <Box sx={{
          marginY: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Button variant='outlined' color='primary' sx={{marginX: 2}} onClick={
            () => setOpenAddItemModal(true)
          }>
            <AddRounded />
          </Button>
          <TextField
            id="search"
            label="Search"
            variant='outlined'
            sx={{ width: '80%' }}
          />
          <Button variant='contained' onClick={
            () => search(document.getElementById('search').value)
          }>
            <SearchRounded />
          </Button>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Grid container spacing={2}>
            {pantry.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 2,
                  marginY: 1,
                  border: '1px solid #ccc',
                  borderRadius: 4,
                }}>
                  <img src={item.img} alt="placeholder" style={{ height: '200px', borderRadius: '4px 4px 0 0' }} />
                  <TableContainer component={Paper} sx={{
                    boxShadow: 0,
                  }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>{item.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Quantity</TableCell>
                          <TableCell>
                            <IconButton variant="contained" color="secondary" onClick={() => decrementQty(item)}>
                              <RemoveRounded />
                            </IconButton>
                            {item.qty}
                            <IconButton variant="contained" color="primary" onClick={() => incrementQty(item)}>
                              <AddRounded />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button variant="contained" color="error" sx={{ marginTop: 2 }} fullWidth onClick={() => handleDeleteItem(item)}>
                    Delete
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <AddItemModal open={openAddItemModal} handleClose={handleClose} />
    </div>
  )
}