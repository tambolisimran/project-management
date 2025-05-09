import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Zoom,
  DialogContent,
  Dialog,
} from "@mui/material";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { AddTaskToLeader,AddTaskToMember, getAssignedTasksOfMember, getAssignedTasksOfLeader} from "../Services/APIServices";
import { useParams } from 'react-router-dom';

const AddTask = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member;
  const isLeader = location.state?.isLeader;
  

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    projectName: "",
    priority: "Medium",
    status: "Pending",
    statusBar: "",
    days: "",
    file: null,
    startDate: "",
    endDate: "",
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
const [selectedImage, setSelectedImage] = useState('');

useEffect(() => {
  const fetchTasks = async () => {
    try {
      setLoading(true);
      let response;
      if (isLeader) {
        response = await getAssignedTasksOfLeader(member.id); 
      } else {
        response = await getAssignedTasksOfMember(member.id); 
      }
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (member?.id) fetchTasks();
}, [member, isLeader]);


  const validateForm = () => {
    const { subject, startDate, endDate } = formData;
    if (!subject.trim()) {
      Swal.fire("Validation Error", "Subject is required", "warning");
      return false;
    }
    if (!startDate || !endDate) {
      Swal.fire("Validation Error", "Start and Due Date are required", "warning");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    let updatedFormData;
  
    if (name === "file") {
      updatedFormData = { ...formData, [name]: files[0] };
    } else {
      updatedFormData = { ...formData, [name]: value };
      if (name === "startDate" || name === "endDate") {
        const start = new Date(name === "startDate" ? value : updatedFormData.startDate);
        const end = new Date(name === "endDate" ? value : updatedFormData.endDate);
        if (!isNaN(start) && !isNaN(end)) {
          const timeDiff = end.getTime() - start.getTime();
          const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          updatedFormData.days = dayDiff >= 0 ? dayDiff.toString() : "";
        }
      }
    }
    setFormData(updatedFormData);
  };
  
  const fetchAssignedTasks = async () => {
    try {
      setLoading(true);
      console.log(id);
      const response = await getAssignedTasksOfMember(member.id);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const taskPayload = {
      ...formData,
      assignedToTeamMember: isLeader ? null : member.id,
      assignedToTeamLeader: isLeader ? member.id : null,
      assignedByAdminId: id,
      assignedByLeaderId: null,
    };
  
    delete taskPayload.file;
    const data = new FormData();
    data.append("task", JSON.stringify(taskPayload));
    if (formData.file instanceof File) {
      data.append("file", formData.file);
    }
  
    try {
      let response;
      if (isLeader) {
        response = await AddTaskToLeader(data, member.id); 
      } else {
        response = await AddTaskToMember(data, member.id); 
      }
  
      Swal.fire("Success!", "Task assigned successfully", "success");
      await fetchAssignedTasks();
      setFormData({
        subject: "",
        description: "",
        projectName: "",
        priority: "Medium",
        status: "Pending",
        statusBar: "",
        file: null,
        days: "",
        startDate: "",
        endDate: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to assign task", "error");
    }
  };
  
   
  return (
    <Container
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{ mt: 5 }}
    >
      <Button variant="outlined" color="primary" sx={{ mr: "55rem", mt: 5 }} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Button variant="contained" sx={{ mt: 5 }} color="primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add Task"}
      </Button>

      {showForm ? (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Assign Task to {member?.name}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  name="subject"
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  name="description"
                  label="Description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  name="projectName"
                  label="Project Name"
                  value={formData.projectName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  name="priority"
                  label="Priority"
                  select
                  value={formData.priority}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  name="status"
                  label="Status"
                  select
                  value={formData.status}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Status Bar"
                  name="statusBar"
                  value={formData.statusBar}
                  onChange={handleChange}
                >
                  {[...Array(11)].map((_, i) => (
                    <MenuItem key={i * 10} value={i * 10}>
                      {`${i * 10}%`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Start Date"
                  name="startDate"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="End Date"
                  name="endDate"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
              <TextField
                  name="days"
                  label="Days"
                  value={formData.days}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />

              </Grid>
              <Grid item xs={12} md={4}>
              <Button variant="contained" component="label" fullWidth>
                Upload Image
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setFormData({ ...formData, file: e.target.files[0] })
                  }
                />
              </Button>
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
          <Typography variant="h6" sx={{ mt: 4 }}>
            Assigned Tasks to {member?.name}
          </Typography>

          {loading ? (
            <Typography>Loading tasks...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
                    <TableCell><b>ID</b></TableCell>
                    <TableCell><b>Subject</b></TableCell>
                    <TableCell><b>Description</b></TableCell>
                    <TableCell><b>Project Name</b></TableCell>
                    <TableCell><b>Priority</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Status Bar</b></TableCell>
                    <TableCell><b>Start Date</b></TableCell>
                    <TableCell><b>End Date</b></TableCell>
                    <TableCell><b>Days</b></TableCell>
                    <TableCell><b>Image</b></TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.id}</TableCell>
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
                        <img
                          src={task.imageUrl}
                          alt="task"
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedImage(task.imageUrl);
                            setOpen(true);
                          }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="md"
            TransitionComponent={Zoom}
          >
            <DialogContent style={{ padding: 0, backgroundColor: '#000' }}>
              <img
                src={selectedImage}
                alt="preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </DialogContent>
          </Dialog>

    </Container>
  );
};

export default AddTask;
