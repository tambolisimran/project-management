import React, { useState, useEffect } from 'react';
import {
  Container, Grid, TextField, Button, MenuItem, Typography,
  FormControl,
  Select,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Box
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { getAllTeamLeaders, getTeamLeaderById, getTeamLeaderByEmail, updateTeamLeader, deleteTeamLeader , addLeader , addTask, GetAllTeams , getAllBranches , getAllProjects ,GetAllDepartments} from '../Services/APIServices';
import Swal from 'sweetalert2';
import { motion } from "framer-motion";

const roles = ['TEAM_LEADER', 'TEAM_MEMBER'];
const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Not Started', 'In Progress', 'Completed'];

const AddLeaderTask = () => {
  const [leaders, setLeaders] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [leaderData, setLeaderData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    department: '',
    branchName: '',
    joinDate: '',
    roleName: '',
    teamId: '',
    subject: '',
    description: '',
    projectName: '',
    priority: '',
    status: '',
    statusBar: '',
    days: 7,
    hour: 34,
    durationInMinutes: 0,
    imageUrl: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    assignedByAdminId: '',
    assignedByLeaderId: '',
    assignedToId: ''
  });

  const [teams, setTeams] = useState([]);
  const [branches,setBranches] = useState([]);
  const [projects,setProjects] = useState([]);
  const [departments,setDepartments] = useState([]);
  const [leaderTasks, setLeaderTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchTeams();
    fetchLeaders();
    fetchBranches();
    fetchProjects();
    fetchDepartments();
    fetchLeaderTasks();
  }, []);


  const fetchLeaderTasks = async () => {
    try {
      const res = await getAllTeamLeaders();
      setLeaderTasks(res.data || []);
    } catch (error) {
      console.error("Error fetching leader tasks:", error);
    }
  };

  const fetchTeams = async () => {
      try {
        const response = await GetAllTeams();
        setTeams(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchBranches = async () => {
         try {
           const response = await getAllBranches();
           setBranches(response.data || []);
         } catch (error) {
           console.error("Error fetching branches:", error);
         }
       };

       const fetchProjects = async () => {
           try {
             const response = await getAllProjects();
             setProjects(response.data || []);
           } catch (error) {
             console.error("Error fetching roles:", error);
           }
         };

          const fetchDepartments = async () => {
               try {
                 const response = await GetAllDepartments();
                 setDepartments(response.data || []);
               } catch (error) {
                 console.error("Error fetching departments:", error);
               }
             };
         
    
    const fetchLeaders = async () => {
      try {
        const res = await getAllTeamLeaders();
        setLeaders(res.data);
      } catch (error) {
        console.error("Failed to fetch leaders", error);
      }
    };
  
    const handleGetById = async () => {
      try {
        const res = await getTeamLeaderById(selectedId);
        setLeaderData(res.data);
      } catch (error) {
        console.error("Error fetching by ID", error);
      }
    };
  
    const handleGetByEmail = async () => {
      try {
        const res = await getTeamLeaderByEmail(emailSearch);
        setLeaderData(res.data);
      } catch (error) {
        console.error("Error fetching by email", error);
      }
    };
  
    const handleDelete = async () => {
      try {
        await deleteTeamLeader(selectedId);
        alert('Deleted successfully!');
        fetchLeaders();
      } catch (error) {
        console.error("Error deleting leader", error);
      }
    };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleView = (id) => {
    const leader = leaderTasks.find((l) => l.id === id);
    if (leader) {
      Swal.fire({
        title: "Team Leader Info",
        html: `
          <b>Name:</b> ${leader.name}<br/>
          <b>Email:</b> ${leader.email}<br/>
          <b>Password:</b> ${leader.password}<br/>
          <b>Phone:</b> ${leader.phone}<br/>
          <b>Address:</b> ${leader.address}<br/>
          <b>Department:</b> ${leader.department}<br/>
          <b>Branch Name:</b> ${leader.branchName}<br/>
          <b>Join Date:</b> ${leader.joinDate}<br/>
          <b>Role:</b> ${leader.role}<br/>
          <b>User Role:</b> ${leader.userRole}<br/>
          <b>Team ID:</b> ${leader.team?.id || "-"}<br/>
          <b>Project Name:</b> ${leader.project?.projectName || "-"}<br/>
          <b>Task Subject:</b> ${leader.task?.subject || "-"}<br/>
          <b>Task Status:</b> ${leader.task?.status || "-"}
        `,
        icon: "info",
      });
    } else {
      Swal.fire("Not Found", "Team Leader not found", "error");
    }
  };
  
  
  const handleEdit = (id) => {
    const leader = leaderTasks.find((l) => l.id === id);
    if (leader) {
      setFormData({
        name: leader.name || "",
        email: leader.email || "",
        password: leader.password || "",
        phone: leader.phone || "",
        address: leader.address || "",
        department: leader.department || "",
        branchName: leader.branchName || "",
        joinDate: leader.joinDate || "",
        role: "TEAM_LEADER",
        userRole: leader.userRole || "",
        teamId: leader.team?.id || "",
        projectName: leader.project?.projectName || "",
        subject: leader.task?.subject || "",
        status: leader.task?.status || "",
        assignedTasks: leader.task?.id || ""
      });
      setEditMode(true);
      setEditId(id);
    } else {
      Swal.fire("Error", "Team Leader not found", "error");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let leaderResponse;
      if (editMode) {
        // Update team leader
        await updateTeamLeader(editId, formData);
        Swal.fire("Success", "Team Leader updated successfully", "success");
      } else {
        // Add team leader
        leaderResponse = await addLeader(formData);
        Swal.fire("Success", "Team Leader added successfully", "success");
      }
  
      // 🔽 Get the leader ID (for assigning the task)
      const leaderId = editMode ? editId : leaderResponse?.data?.id;
  
      // Prepare task data
      const taskData = {
        subject: formData.subject,
        description: formData.description,
        projectName: formData.projectName,
        priority: formData.priority,
        status: formData.status,
        statusBar: formData.statusBar,
        days: formData.days,
        hour: formData.hour,
        durationInMinutes: formData.durationInMinutes,
        imageUrl: formData.imageUrl,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        assignedByAdminId: formData.assignedByAdminId,
        assignedByLeaderId: formData.assignedByLeaderId,
        assignedToId: leaderId // task assigned to the leader
      };
  
      // 🔥 Call the addTask API
      await addTask(taskData);
  
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        department: '',
        branchName: '',
        joinDate: '',
        roleName: '',
        teamId: '',
        subject: '',
        description: '',
        projectName: '',
        priority: '',
        status: '',
        statusBar: '',
        days: 7,
        hour: 34,
        durationInMinutes: 0,
        imageUrl: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        assignedByAdminId: '',
        assignedByLeaderId: '',
        assignedToId: ''
      });
  
      setEditMode(false);
      setEditId(null);
      fetchLeaderTasks();
  
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };
  
  
  return (
    <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
       <Typography variant="h5" gutterBottom>
        {editMode ? "Edit Team Leader" : "Add Team Leader"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="dense">
            <InputLabel>Department</InputLabel>
            <Select name="department" value={formData?.department || ""}
              onChange={handleChange}>               
                {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.department}>
                {dept.department}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Branch</InputLabel>
                  <Select name="branchName" value={formData?.branchName || ""} onChange={handleChange}>
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.branchName}>{branch.branchName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
          <Grid item xs={12} md={4}><TextField fullWidth type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth select name="teamId" label="Team" value={formData.teamId} onChange={handleChange}>
              {teams.map(team => (
                <MenuItem key={team.id} value={team.id}>{team.id}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <TextField
        select
        label="Select Leader ID"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        fullWidth
        margin="normal"
      >
        {leaders.map((leader) => (
          <MenuItem key={leader.id} value={leader.id}>
            {leader.name} (ID: {leader.id})
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" onClick={handleGetById}>Get By ID</Button>
      <Button variant="outlined" onClick={handleDelete} color="error" sx={{ ml: 2 }}>
        Delete
      </Button>

      <TextField
        label="Search by Email"
        value={emailSearch}
        onChange={(e) => setEmailSearch(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleGetByEmail}>Get By Email</Button>

      {leaderData && (
        <div style={{ marginTop: 20 }}>
          <Typography>Name: {leaderData.name}</Typography>
          <Typography>Email: {leaderData.email}</Typography>
          <Typography>Password: {leaderData.password}</Typography>
          <Typography>Phone: {leaderData.phone}</Typography>
          <Typography>Address: {leaderData.address}</Typography>
          <Typography>Department: {leaderData.department}</Typography>
          <Typography>Branch Name: {leaderData.branchName}</Typography>
          <Typography>Join Date: {leaderData.joinDate}</Typography>
          <Typography>Role: {leaderData.role}</Typography>
        </div>
      )}

          <Grid item xs={12}>
            <Typography variant="h6">Task Info</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
              <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} />
          </Grid>
           <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Project Name</InputLabel>
                  <Select name="projectName" value={formData?.projectName || ""} onChange={handleChange}>
                    {projects.map((pro) => (
                      <MenuItem key={pro.id} value={pro.projectName}>{pro.projectName}</MenuItem>
                        ))}
                  </Select>
                  </FormControl>
                </Grid>
          <Grid item xs={12} md={4}>
              <TextField select fullWidth name="priority" label="Priority" value={formData.priority} onChange={handleChange}>
                {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField select fullWidth name="status" label="Status" value={formData.status} onChange={handleChange}>
              {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth margin="dense" label="Status Bar (%)" name="statusBar" type="number" inputProps={{ min: 0, max: 100 }} value={formData.statusBar} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth label="Days" type="number" name="days" value={formData.days} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth label="Hours" type="number" name="hour" value={formData.hour} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth label="Duration (min)" type="number" name="durationInMinutes" value={formData.durationInMinutes} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
              <TextField fullWidth type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField fullWidth select label="Assigned By Admin" name="assignedByAdminId" value={formData.assignedByAdminId} onChange={handleChange}>
              {admins.map(admin => (
                <MenuItem key={admin.id} value={admin.id}>{admin.name} (ID: {admin.id})</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth select label="Assigned To" name="assignedToId" value={formData.assignedToId} onChange={handleChange}>
              {members.map(member => (
                <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
                {editMode ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        Team Leaders and Task Details
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderTasks.map((leader) => (
              <TableRow key={leader.id}>
                <TableCell>{leader.name}</TableCell>
                <TableCell>{leader.email}</TableCell>
                <TableCell>{leader.phone}</TableCell>
                <TableCell>{leader.task?.subject || "-"}</TableCell>
                <TableCell>{leader.project?.projectName || "-"}</TableCell>
                <TableCell>{leader.task?.priority || "-"}</TableCell>
                <TableCell>{leader.task?.status || "-"}</TableCell>
                <TableCell>{leader.task?.startTime || "-"}</TableCell>
                <TableCell>{leader.task?.endTime || "-"}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleView(leader.id)}><Visibility /></IconButton>
                  <IconButton color="secondary" onClick={() => handleEdit(leader.id)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(leader.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {leaderTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">No team leaders found.</TableCell>
              </TableRow>
            )}
            </TableBody>
        </Table>
      </TableContainer>
      </Box>
      </Paper>
    </Container>
  );
};

export default AddLeaderTask;