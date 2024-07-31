import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import firebase from '@/app/firebase'

const AddItemModal = ({ open, handleClose }) => {
    const [imgUrl, setImgUrl] = useState('');

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        setImgUrl(await fileRef.getDownloadURL());
    };

    const addItem = async (item) => {
        try {
            const user = firebase.auth().currentUser;
            if (!user) {
                return { error: 'User not authenticated.' };
            }
            const collectionRef = firebase.firestore().collection("pantry");
            await collectionRef.add(item);
            const snapshot = await collectionRef.get();
            const documents = snapshot.docs.map(doc => doc.data());
            console.log(documents);

            return { success: true, message: 'Item added successfully.' };
        } catch (error) {
            console.error(error);
            return { error: 'Something went wrong.' };
        }
    }
    const handleAddItem = async () => {
        const itemName = document.getElementById('item-name').value;
        const itemQty = parseInt(document.getElementById('item-qty').value);
        const img = imgUrl;
        if (!itemName) {
            console.error('Item name is required.');
            alert('Item name is required.');
            return;
        } else if (!itemQty) {
            console.error('Item quantity is required.');
            alert('Item quantity is required.');
            return;
        } else if (!img) {
            console.error('Item image is required.');
            alert('An image is required.');
            return;
        }
        const item = {
            name: itemName,
            qty: itemQty,
            img: img
        };
        const result = await addItem(item);
        if (result.success) {
            handleClose();
        } else {
            console.error(result.error);
        }
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'white',
                boxShadow: 24,
                borderRadius: 2,
                p: 4,
            }}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Add New Item
                </Typography>
                <TextField
                    id="item-name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <TextField
                    id="item-qty"
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                />
                {imgUrl ? <Typography variant="body1" sx={{ mt: 2 }}>Image uploaded successfully.</Typography> : null}
                <label htmlFor="upload-image" style={{ display: 'inline-block' }}>
                    <input
                        id="upload-image"
                        type="file"
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        component="span"
                        sx={{ mt: 2 }}
                    >
                        Upload Image
                    </Button>
                </label>
                <Button variant="contained" color="primary" sx={{ mt: 2, mx: 2 }} onClick={handleAddItem}>
                    Add Item
                </Button>
            </Box>
        </Modal>
    );
};

export default AddItemModal;