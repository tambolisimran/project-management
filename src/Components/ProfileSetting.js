import React, { useState } from 'react';
import { Box, TextField, Button, Avatar, IconButton, Paper } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';

const ProfileSetting = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Profile Saved', { name, email, password, image });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
      <Paper sx={{ padding: 3, width: '400px', boxShadow: 3 }}>
        <Box sx={{ position: 'relative', marginBottom: 2, textAlign: 'center' }}>
          <Avatar
            src={image || 'https://via.placeholder.com/150'}  
            sx={{ width: 120, height: 120, borderRadius: '50%', margin: 'auto' }}
          />
          <IconButton
            color="primary"
            component="label"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#fff',
              borderRadius: '50%',
              boxShadow: 3,
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <CameraAlt />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </IconButton>
        </Box>

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSave}
          sx={{ marginTop: 2 }}
        >
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfileSetting;
