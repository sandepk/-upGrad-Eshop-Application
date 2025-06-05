import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';
import Snackbar from '@mui/material/Snackbar';
import { token } from '../../utils/token';

const API_BASE = 'https://dev-project-ecommerce.upgrad.dev/api';

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'priceHigh', label: 'Price: High to Low' },
  { value: 'priceLow', label: 'Price: Low to High' },
  { value: 'newest', label: 'Newest' },
];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    price: '',
    imageUrl: '',
    description: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Redirect if not logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      navigate('/login');
    } else {
      setIsAdmin(user.role === 'ADMIN');
    }
  }, [navigate]);

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/products/categories`, {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(setCategories);
  }, []);

  // Fetch products
  useEffect(() => {
    let url = `${API_BASE}/products`;
    if (category) url += `?category=${category}`;
    if (search) url += `${category ? '&' : '?'}search=${encodeURIComponent(search)}`;
    fetch(url, {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [category, search]);

  // Sorting
  const sortedProducts = React.useMemo(() => {
    let sorted = [...products];
    if (sort === 'priceHigh') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'priceLow') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'newest') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted;
  }, [products, sort]);

  const handleEdit = (product) => {
    setProductToEdit(product);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl || '',
      description: product.description || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setProductToEdit(null);
  };

  const handleEditSave = async () => {
    if (!productToEdit) return;
    const response = await fetch(`${API_BASE}/products/${productToEdit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(editForm)
    });
    if (response.ok) {
      setSnackbar({ open: true, message: `Product ${editForm.name} modified successfully` });
      setProducts(products.map(p => p.id === productToEdit.id ? { ...p, ...editForm } : p));
    }
    handleCloseEditDialog();
  };

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    const response = await fetch(`${API_BASE}/products/${productToDelete.id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token }
    });
    if (response.ok) {
      setSnackbar({ open: true, message: `Product ${productToDelete.name} deleted successfully` });
      setProducts(products.filter(p => p.id !== productToDelete.id));
    }
    handleCloseDeleteDialog();
  };

  return (
    <Box sx={{ p: 2 }} display="flex" alignItems="center" flexDirection="column" gap={2}>
      {/* Category Tabs */}
      <ToggleButtonGroup
        value={category}
        exclusive
        onChange={(e, val) => setCategory(val)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="">All</ToggleButton>
        {categories.map(cat => (
          <ToggleButton key={cat} value={cat}>{cat}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Sorting */}
      <Select
        label="Sort by"
        value={sort}
        onChange={e => setSort(e.target.value)}
        sx={{ ml: 2, mb: 2 }}
      >
        {sortOptions.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </Select>

      {/* Product Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {sortedProducts.map(product => (
          <Card key={product.id} sx={{ width: 300 }}>
            <CardMedia
              component="img"
              height="140"
              image={product.imageUrl || 'https://via.placeholder.com/300x140'}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2">{product.description}</Typography>
              <Typography variant="subtitle1">₹{product.price}</Typography>
              {isAdmin && (
                <Box>
                  <IconButton onClick={() => handleEdit(product)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(product)}><DeleteIcon /></IconButton>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editForm.name}
            onChange={handleEditFormChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Category"
            name="category"
            value={editForm.category}
            onChange={handleEditFormChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={editForm.price}
            onChange={handleEditFormChange}
            fullWidth
            required
            margin="normal"
            type="number"
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={editForm.imageUrl}
            onChange={handleEditFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product Description"
            name="description"
            value={editForm.description}
            onChange={handleEditFormChange}
            fullWidth
            margin="normal"
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {productToDelete?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        ContentProps={{
          sx: { background: 'green', color: 'white', fontWeight: 'bold' }
        }}
      />
    </Box>
  );
}