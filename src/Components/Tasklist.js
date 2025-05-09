import { Box, LinearProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllTask } from '../Services/APIServices';

const Tasklist = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getAllTask();
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load task list', err);
    }
  };

  return (
    <>
      <Box sx={{ maxHeight: 600, overflowY: 'auto', marginBottom: 2, marginLeft: '40px' }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
           Task List
          </Typography>
          <Table>
            <TableHead>
              <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
              <TableCell><b>ID</b></TableCell>
                <TableCell><b>Subject</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Priority</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Progress</b></TableCell>
                <TableCell><b>Start Date</b></TableCell>
                <TableCell><b>End Date</b></TableCell>
                <TableCell><b>Assigned To</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.subject}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell><LinearProgress variant="determinate" value={task.statusBar || 0} /></TableCell>
                  <TableCell>{task.startDate}</TableCell>
                  <TableCell>{task.endDate}</TableCell>
                  <TableCell>{task.assignedToTeamMember?.id || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
};

export default Tasklist;
