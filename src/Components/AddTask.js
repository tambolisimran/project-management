import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
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
  Box,
  LinearProgress,
  DialogTitle,
  DialogActions,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { AddTaskToLeader,AddTaskToMember, getAssignedTasksOfMember, getAssignedTasksOfLeader, updateTask,deleteTask} from "../Services/APIServices";
import { useParams } from 'react-router-dom';
import { Delete, Edit } from "@mui/icons-material";

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
  const [selectedTask, setSelectedTask] = useState({});
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

   const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedTask((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleUpdate = async (e) => {
        e.preventDefault();
        setOpen(false);
        try {
          const response = await updateTask(selectedTask.id, selectedTask);

          if (response && response.data) {
            console.log("Updated Task Response:", response.data);
            setTasks((prevTask) =>
              prevTask.map((tsk) =>
                tsk.id === selectedTask.id ? { ...tsk, ...selectedTask } : tsk
              )
            );

            Swal.fire("Success", "Task updated successfully!", "success");
          } else {
            throw new Error("Empty response from updateTask");
          }

          setSelectedTask({
            name: "",
            email: "",
            password: "",
            roleName: "",
            phone: "",
            department: "",
            branchName: "",
            imageUrl: null,
            address: "",
            joinDate: "",
            projectName: "",
          });

        } catch (error) {
          console.error("Error updating task:", error);
          Swal.fire(
            "Error",
            `Failed to update task: ${error?.response?.data?.message || error.message || "Unknown error"}`,
            "error"
          );
        }
      };

            const handleImageChange = (e) => {
              const file = e.target.files[0];
              setSelectedTask((prev) => ({
                ...prev,
                file: file,
              }));
            };

             const handleUpdateClick = (tasks) => {
        setSelectedTask(tasks);
        setOpen(true);
      };

      const handleCloseDialog = () => {
        setOpen(false);
        setSelectedTask({}); 
      };
        
      const handleDelete = async (id) => {
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
                const response = await deleteTask(id);
                console.log(response.data);
                setTasks(tasks.filter((tsk) => tsk.id !== id));
                Swal.fire("Deleted!", "Task has been deleted.", "success");
              } catch (error) {
                console.error("Error deleting Task:", error);
                Swal.fire("Error", "Failed to delete Task.", "error");
              }
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
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Upcoming">Upcoming</MenuItem>
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
                    <TableCell><b>Action</b></TableCell>
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
                      <TableCell>{task.days}</TableCell>
                      <TableCell>
                      {task.imageUrl ? (
                        <img src={task.imageUrl} alt="profile" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No Image
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small" onClick={() => handleUpdateClick(task)}>
                        <Edit />
                      </IconButton>
                      <Delete onClick={() => handleDelete(task.id)} sx={{ color: "#D32F2F", cursor: "pointer", mr: 1 }} />
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
          <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
  <DialogTitle>Update Task</DialogTitle>
  <DialogContent>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          name="subject"
          label="Subject"
          fullWidth
          value={selectedTask.subject || ""}
          onChange={handleUpdateChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="description"
          label="Description"
          fullWidth
          value={selectedTask.description || ""}
          onChange={handleUpdateChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="projectName"
          label="Project Name"
          fullWidth
          value={selectedTask.projectName || ""}
          onChange={handleUpdateChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          name="priority"
          label="Priority"
          fullWidth
          value={selectedTask.priority || ""}
          onChange={handleUpdateChange}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          name="status"
          label="Status"
          fullWidth
          value={selectedTask.status || ""}
          onChange={handleUpdateChange}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="On Hold">On Hold</MenuItem>
          <MenuItem value="Upcoming">Upcoming</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          name="statusBar"
          label="Status Bar"
          fullWidth
          value={selectedTask.statusBar || ""}
          onChange={handleUpdateChange}
        >
          {[...Array(11)].map((_, i) => (
            <MenuItem key={i * 10} value={i * 10}>
              {`${i * 10}%`}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={selectedTask.startDate || ""}
          onChange={handleUpdateChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="endDate"
          label="End Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={selectedTask.endDate || ""}
          onChange={handleUpdateChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField name="days" label="Days" value={formData.days} fullWidth InputProps={{  readOnly: true, }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          component="label"
          fullWidth
        >
          Upload Image
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog}>Cancel</Button>
    <Button variant="contained" color="primary" onClick={handleUpdate}>
      Update Task
    </Button>
  </DialogActions>
</Dialog>
                <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage("")} maxWidth="sm" fullWidth>
                  <DialogTitle>Task Image</DialogTitle>
                  <DialogContent>
                    <img src={selectedImage} alt="Task Preview" style={{ width: "100%" }} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setSelectedImage("")} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>


    </Container>
  );
};

export default AddTask;
