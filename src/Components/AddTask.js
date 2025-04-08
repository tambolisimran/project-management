import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {deleteTask,addTask,getAllTask} from "../Services/APIServices"
import Swal from "sweetalert2";

const AddTask = ({ selectedTask, tasks = [] }) => {
  const initialTaskState = {
    description: "",
    projectName: "",
    days: "",
    hour: "",
    status: "",
    statusBar: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    imageUrl: "",
    durationInMinutes: "",
    subject: "",
    priority: "LOW",
    assignedTo: "",
    assignedBy: "",
  };
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState(initialTaskState);
  const [viewMode, setViewMode] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
   fetchTasks();
  }, [selectedTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
 

  const fetchTasks = async () => {
      try {
        const response = await getAllTask();
        setTask(response.data || []);
      } catch (error) {
        console.error("Error fetching task:", error);
        Swal.fire("Error", "Failed to load task.", "error");
      }
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
       const response =  await addTask(task);
       console.log(response.data);
       console.log("task added successfully",response.data.jwtToken)
       fetchTasks();
       setTask(initialTaskState);
        Swal.fire("Success", "task added successfully!", "success");
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.jwtToken);
          console.log("Token stored:", localStorage.getItem("token"));
      } else {
          console.error("Token not found in response");
      }
      setShowForm(false);
      }catch (error) {
            console.error("Error adding task:", error);
            Swal.fire("Error", "Failed to add task.", "error");
          }
    };

  const handleDelete = async (taskId) => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This action cannot be undone!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        });
    
        if (result.isConfirmed) {
          try {
            await deleteTask(taskId);
            setSelectedTaskDetails(task.filter((tsk) => tsk.taskId !== taskId));
            Swal.fire("Deleted!", "Member has been deleted.", "success");
          } catch (error) {
            console.error("Error deleting Member:", error);
            Swal.fire("Error", "Failed to delete Member.", "error");
          }
        }
      };

  const handleView = (task) => {
    setSelectedTaskDetails(task);
    setViewMode(true);
  };

  return (
    <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Button variant="outlined" color="primary" sx={{mr:"55rem",mt:5}} onClick={()=>navigate(-1)}>Back</Button>
      <Button variant="contained" sx={{mt:5}} color="primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add Task"}
      </Button>

      {showForm ? (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Create Task
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Description" name="description" value={task.description} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Project Name" name="projectName" value={task.projectName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Days" name="days" type="number" value={task.days} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Hours" name="hour" type="number" value={task.hour} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Status" name="status" value={task.status} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Status Bar (%)" name="statusBar" type="number" inputProps={{ min: 0, max: 100 }} value={task.statusBar} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="date" label="Start Date" name="startDate" value={task.startDate} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="date" label="End Date" name="endDate" value={task.endDate} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="time" label="Start Time" name="startTime" value={task.startTime} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="time" label="End Time" name="endTime" value={task.endTime} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Image Url" name="imageUrl" value={task.imageUrl} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Duration In Minutes" name="durationInMinutes" value={task.durationInMinutes} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Subject" name="subject" value={task.subject} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="LOW">LOW</MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                    <MenuItem value="HIGH">HIGH</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Assigned To" name="assignedTo" value={task.assignedTo} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Assigned By" name="assignedBy" value={task.assignedBy} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Add Task
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Task List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                  <TableCell><b>Project Name</b></TableCell>
                  <TableCell><b>Days</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.projectName}</TableCell>
                    <TableCell>{task.days}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="info" onClick={() => handleView(task)}>
                        View
                      </Button>
                      <Button variant="contained" onClick={() => handleDelete(task?.id)} sx={{ ml: 2, backgroundColor: "#fb6f92", color: "white" }}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={viewMode} onClose={() => setViewMode(false)}>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTaskDetails && (
            <>
              <Typography><strong>Description:</strong> {selectedTaskDetails.description}</Typography>
              <Typography><strong>Project Name:</strong> {selectedTaskDetails.projectName}</Typography>
              <Typography><strong>Days:</strong> {selectedTaskDetails.days}</Typography>
              <Typography><strong>hour:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>Status:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>statusBar:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>startDate:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>endDate:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>startTime:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>endTime:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>imageUrl:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>durationInMinutes:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>subject:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>priority:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>assignedTo:</strong> {selectedTaskDetails.status}</Typography>
              <Typography><strong>assignedBy:</strong> {selectedTaskDetails.status}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewMode(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddTask;
