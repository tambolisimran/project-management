import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Role from './Role';
import Branch from './Branch';
import Department from './Department';

const Menu = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', marginTop: '80px' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        <Tab
          label="Role"
          sx={{
            mr: 25,
            backgroundColor: '#3D90D7',
            borderRadius: '30px',
            fontWeight: 'bold',
            color: 'white',
            '&.Mui-selected': {
              color: 'white',
              backgroundColor: '#3D90D7',
              border: '2px solid #3D90D7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            },
            textTransform: 'none',
          }}
        />
        <Tab
          label="Branch"
          sx={{
            mr: 25,
            backgroundColor: '#3D90D7',
            borderRadius: '30px',
            fontWeight: 'bold',
            color: 'white',
            '&.Mui-selected': {
              color: 'white',
              backgroundColor: '#3D90D7',
              border: '2px solid #3D90D7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            },
            textTransform: 'none',
          }}
        />
        <Tab
          label="Department"
          sx={{
            backgroundColor: '#3D90D7',
            borderRadius: '30px',
            fontWeight: 'bold',
            color: 'white',
            '&.Mui-selected': {
              color: 'white',
              backgroundColor: '#3D90D7',
              border: '2px solid #3D90D7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            },
            textTransform: 'none',
          }}
        />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {value === 0 && <Role />}
        {value === 1 && <Branch />}
        {value === 2 && <Department />}
      </Box>
    </Box>
  );
};

export default Menu;
