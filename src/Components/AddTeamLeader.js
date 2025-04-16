import React, { useState, useEffect } from 'react';
import {
  Container, Grid, TextField, Button, MenuItem, Typography
} from '@mui/material';
import axios from 'axios';
import {GetAllTeams} from '../Services/APIServices'

const roles = ['TEAM_LEADER', 'TEAM_MEMBER'];
const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Not Started', 'In Progress', 'Completed'];

const AddTeamLeader = () => {
  const [formData, setFormData] = useState({
    // TeamLeader
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    department: '',
    branch: '',
    joinDate: '',
    role: 'TEAM_LEADER',
    teamId: '',

    // Task
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
  const [admins, setAdmins] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);


  const fetchTeams = async () => {
      try {
        const response = await GetAllTeams();
        setTeams(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save Team Leader
      const leaderRes = await axios.post('http://localhost:8080/team-leader/create', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        department: formData.department,
        branch: formData.branch,
        joinDate: formData.joinDate,
        team: { id: formData.teamId }
      });

      const createdLeaderId = leaderRes.data.id;

      // Save Task with assignedByLeader
      await axios.post('http://localhost:8080/task/create', {
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
        assignedByAdmin: { id: formData.assignedByAdminId },
        assignedByLeader: { id: createdLeaderId },
        assignedTo: { id: formData.assignedToId }
      });

      alert('Team Leader and Task Created Successfully!');
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Create Team Leader & Assign Task</Typography>
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
          <Grid item xs={12} md={4}><TextField fullWidth label="Department" name="department" value={formData.department} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Branch" name="branch" value={formData.branch} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth select name="teamId" label="Team" value={formData.teamId} onChange={handleChange}>
              {teams.map(team => (
                <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* --- Task Fields --- */}
          <Grid item xs={12}><Typography variant="h6">Task Info</Typography></Grid>

          <Grid item xs={12} md={4}><TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Project Name" name="projectName" value={formData.projectName} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField select fullWidth name="priority" label="Priority" value={formData.priority} onChange={handleChange}>
            {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField></Grid>
          <Grid item xs={12} md={4}><TextField select fullWidth name="status" label="Status" value={formData.status} onChange={handleChange}>
            {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Status Bar" name="statusBar" value={formData.statusBar} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Days" type="number" name="days" value={formData.days} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Hours" type="number" name="hour" value={formData.hour} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Duration (min)" type="number" name="durationInMinutes" value={formData.durationInMinutes} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth type="date" name="startDate" value={formData.startDate} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth type="date" name="endDate" value={formData.endDate} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth type="time" name="startTime" value={formData.startTime} onChange={handleChange} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth type="time" name="endTime" value={formData.endTime} onChange={handleChange} /></Grid>

          <Grid item xs={12} md={4}>
            <TextField fullWidth select label="Assigned By Admin" name="assignedByAdminId" value={formData.assignedByAdminId} onChange={handleChange}>
              {admins.map(admin => (
                <MenuItem key={admin.id} value={admin.id}>{admin.name}</MenuItem>
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

          <Grid item xs={12}><Button type="submit" variant="contained">Submit</Button></Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddTeamLeader;
