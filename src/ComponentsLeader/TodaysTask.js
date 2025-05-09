import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTodaysLeaderTasks} from '../Services/APIServices';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import Swal from 'sweetalert2';

const TodaysTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leader = location.state?.leader || JSON.parse(sessionStorage.getItem("leader"));

  const [tasks, setTasks] = useState([]);
   const [selectedImage, setSelectedImage] = useState('');
   const [open, setOpen] = useState(false);

   useEffect(() => {
    const savedLeader = location.state?.leader;
    if (savedLeader) {
      sessionStorage.setItem("leader", JSON.stringify(savedLeader));
    }
    const leaderData = savedLeader || JSON.parse(sessionStorage.getItem("leader"));
    console.log("Leader being used:", leaderData);
  
    const fetchTasks = async () => {
      if (leaderData?.email) {
        try {
          const tasks = await getTodaysLeaderTasks(leaderData.email);
          console.log("Today's tasks response:", tasks);
          setTasks(tasks || []);
        } catch (error) {
          console.error("Error fetching today's tasks:", error);
        }
      }
    };
  
    fetchTasks();
  }, [location.state]);
    
  const handleStatusChange = async (taskId) => {
    try {
      // Simulate API call to update task status (you can integrate your API call here)
      // await updateTaskStatus(taskId, "COMPLETED"); // Adjust according to your API
      Swal.fire("Success", "Task marked as completed", "success");
  
      // Update the task status in the state
      setTasks(prevTasks =>
        prevTasks.map(task => 
          task.taskId === taskId 
            ? { ...task, status: "COMPLETED" } 
            : task
        )
      );
    } catch (error) {
      Swal.fire("Error", "Failed to update task status", "error");
    }
  };
  

  if (!leader) {
    return <Typography variant="h6">No leader selected.</Typography>;
  }

  return (
    <Container>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
        Today's Tasks for {leader.name}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Subject</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Project</b></TableCell>
              <TableCell><b>Priority</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Status Bar</b></TableCell>
              <TableCell><b>Start Date</b></TableCell>
              <TableCell><b>End Date</b></TableCell>
              <TableCell><b>Days</b></TableCell>
              <TableCell><b>Image</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12}>No tasks for today.</TableCell>
              </TableRow>
            ) : (
              tasks.map((task, index) => (
                <TableRow key={task.taskId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{task.subject}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.projectName}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.statusBar}</TableCell>
                  <TableCell>{task.startDate}</TableCell>
                  <TableCell>{task.endDate}</TableCell>
                  <TableCell>{task.days}</TableCell>
                  <TableCell>
                                            {task.imageUrl ? (
                                              <img src={leader.imageUrl} alt="task" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                                              onClick={() => { setSelectedImage(leader.imageUrl);
                                                setOpen(true);
                                              }}
                                            />
                                          ) : (
                                                'No Image'
                                              )}
                                        </TableCell>
                  <TableCell>
                    {task.status !== "COMPLETED" && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleStatusChange(task.taskId)}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TodaysTask;
