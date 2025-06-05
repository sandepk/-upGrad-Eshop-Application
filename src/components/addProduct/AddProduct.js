import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, Typography, Snackbar } from '@mui/material';
import { token } from '../../utils/token';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    imageUrl: '',
    description: '',
  });
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch('https://dev-project-ecommerce.upgrad.dev/api/products/categories', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(form)
    });
    if (response.ok) {
      setSuccess(`Product ${form.name} added successfully`);
      setForm({ name: '', category: '', price: '', imageUrl: '', description: '' });
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`https://dev-project-ecommerce.upgrad.dev/api/products/${product.id}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    });
    if (response.ok) {
      setSuccess(`Product ${product.name} deleted successfully`);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>Add Product</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required margin="normal" />
        <Autocomplete
          freeSolo
          options={categories}
          value={form.category}
          onChange={(event, newValue) => {
            setForm({ ...form, category: newValue });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Category" required margin="normal" />
          )}
        />
        <TextField label="Price" name="price" value={form.price} onChange={handleChange} fullWidth required margin="normal" type="number" />
        <TextField label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Product Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" multiline />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>SAVE PRODUCT</Button>
      </form>
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        message={success}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {product.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}