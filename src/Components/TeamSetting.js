import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Team from './Team';
import AddTeamMember from './AddTeamMember';
import AddTeamLeader from './AddTeamLeader';

const TeamSetting = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' , marginTop: '80px' }}>
      
      <Tabs value={value} onChange={handleChange} centered TabIndicatorProps={{ style: { display: 'none' } }} >
        <Tab label="Team"
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
        }} />
        <Tab label="Team Member" 
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
        }} />
        <Tab label="Team Leader" 
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
        }} />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {value === 0 && <Team />}
        {value === 1 && <AddTeamMember />}
        {value === 2 && <AddTeamLeader />}
      </Box>
    </Box>
  );
};

export default TeamSetting;
