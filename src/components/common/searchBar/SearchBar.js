import React from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search..." }) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#5c6bc0',
        borderRadius: 1,
        px: 2,
        py: 0.5,
        width: 350,
      }}
    >
      <SearchIcon sx={{ color: 'white', mr: 1 }} />
      <InputBase
        sx={{
          color: 'white',
          flex: 1,
          '::placeholder': { color: 'white', opacity: 0.7 },
        }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Box>
  );
}
