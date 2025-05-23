import {
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllTask } from '../Services/APIServices';

const Tasklist = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  return (
    <Box sx={{ maxHeight: 600, overflowY: 'auto', marginBottom: 2, marginLeft: '40px' }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Task List
        </Typography>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{background:"lightgrey"}}>
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
            {tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.subject}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={task.statusBar || 0} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {`${Math.round(task.statusBar || 0)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{task.startDate}</TableCell>
                <TableCell>{task.endDate}</TableCell>
                <TableCell>{task.assignedToTeamMember?.id || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={tasks.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
};

export default Tasklist;
