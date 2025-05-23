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
  Box,
  LinearProgress,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { LeaderAssignTaskToMember, getAllMembers,getAllProjects,getTasksAssignedByLeader} from "../Services/APIServices";
import { useParams } from 'react-router-dom';

const TaskForMember = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member;
  

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    projectName: "",
    priority: "Medium",
    teamMember:"",
    status: "Pending",
    statusBar: "",
    days: "",
    file: null,
    startDate: "",
    endDate: "",
  });

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
const [selectedImage, setSelectedImage] = useState('');

useEffect(() => {
  fetchMembers();
  fetchProjects();
  fetchTasksByLeader();
}, []);

    const fetchMembers = async () => {
      try {
        const response = await getAllMembers();
        setMembers(response.data || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    const fetchTasksByLeader = async () => {
  try {
    const leaderId = parseInt(sessionStorage.getItem("leaderId"));
    const response = await getTasksAssignedByLeader(leaderId);
    setTasks(response.data || []);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching tasks by leader:", error);
    setLoading(false);
  }
};

  const validateForm = () => {
  const {startDate, endDate } = formData;
  if (!startDate || !endDate) {
    Swal.fire("Validation Error", "Start and End Date are required", "warning");
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
  
const handleSubmit = async (e) => {
  e.preventDefault();
  const leaderId = parseInt(sessionStorage.getItem("leaderId"));
  console.log("Retrieved leaderId:", leaderId);


  if (!validateForm()) return;

  const taskPayload = {
    ...formData,
    assignedToTeamMember: formData.teamMember,
    assignedToTeamLeader: null,
    assignedByAdminId: null,
    assignedByLeaderId: leaderId,
  };
   console.log("Task Payload:", taskPayload);
   console.log("Assigning task to member:", formData.teamMember);

  delete taskPayload.file;

  const data = new FormData();
  data.append("task", JSON.stringify(taskPayload));

  if (formData.file instanceof File) {
    data.append("file", formData.file);
  }

  try {
    const response = await LeaderAssignTaskToMember(data, leaderId, formData.teamMember);
    console.log(response.data);
    Swal.fire("Success!", "Task assigned successfully", "success");
    setFormData({
      subject: "",
      description: "",
      projectName: "",
      priority: "Medium",
      teamMember: "",
      status: "Pending",
      statusBar: "",
      file: null,
      days: "",
      startDate: "",
      endDate: "",
    });
    await fetchTasksByLeader(); 
    setSelectedImage('');
    setOpen(false);
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
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Assign Task to Member
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <TextField
                  name="subject"
                  label="Task"
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
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Project</InputLabel>
                    <Select
                      name="projectName"
                      value={formData?.projectName || ""}
                      onChange={handleChange}>
                    
                      {projects.map((pro) => (
                        <MenuItem key={pro.id} value={pro.projectName}>
                          {pro.projectName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                <InputLabel>Team Member</InputLabel>
                <Select
                    name="teamMember"
                    value={formData?.teamMember || ""}
                    onChange={handleChange}
                    label="Team Member"
                >
                    {members.map((mem) => (
                    <MenuItem key={mem.id} value={mem.id}>
                        {mem.name} 
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
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
            Assigned Tasks to Member
          </Typography>

          {loading ? (
            <Typography>Loading tasks...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ mt: 2 }}>
                <TableHead sx={{background:"lightgrey",fontSize:"bold"}}>
                  <TableRow>
                    <TableCell><b>Subject</b></TableCell>
                    <TableCell><b>Description</b></TableCell>
                    <TableCell><b>Project Name</b></TableCell>
                    <TableCell><b>Team Member</b></TableCell>
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
                      <TableCell>{task.subject}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{task.projectName}</TableCell>
                      <TableCell>
                        {members.find((m) => m.id === task.assignedToTeamMember)?.name || "Unknown"}
                      </TableCell>

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

export default TaskForMember;
