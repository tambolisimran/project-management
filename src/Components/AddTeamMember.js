import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle,TextField, Button,   TableCell, TableBody, TableRow, Paper,Table,TableHead,TableContainer, Grid, FormControl,InputLabel, Select, MenuItem, FormControlLabel,RadioGroup, Radio,
  Container,Typography
} from "@mui/material";
import { addTeamMember, getAllMembers ,  getAllBranches, GetAllDepartments,getAllRoles , getAllProjects , GetAllTeams , deleteTeamMember , MakeLeader} from "../Services/APIServices";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const AddTeamMember = () => {
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
   const [showForm, setShowForm] = useState(false);
  
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    roleName: "",
    phone: "",
    department: "",
    branchName: "",
    address: "",
    joinDate: "",
    teamId: "",  
    isLeader: "false",
    projectName:"",
    userRole: "TEAM_MEMBER",
  });

  const userRoles = ["TEAM_MEMBER", "TEAM_LEADER"];

  useEffect(() => {
    fetchMembers(); 
    fetchBranches();
    fetchDepartments();
    fetchRoles();
    fetchProjects();
    fetchTeams();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();
      setMembers(response.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      Swal.fire("Error", "Failed to load members.", "error");
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


 const fetchBranches = async () => {
     try {
       const response = await getAllBranches();
       setBranches(response.data || []);
     } catch (error) {
       console.error("Error fetching branches:", error);
     }
   };

   const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
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

  const fetchTeams = async () => {
    try {
      const response = await GetAllTeams();
      setTeams(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
 

  // const handleClickOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const handleDetailClose = () => setDetailOpen(false);

  const handleChange = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    console.log("Submitting Data:", newMember);
    try {
        const response = await addTeamMember(newMember);
        console.log("API Response:", response.newMember);
        fetchMembers();
        Swal.fire("Success", "Member added successfully!", "success");
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.jwtToken);
          console.log("Token stored:", localStorage.setItem("token"));
      } else {
          console.error("Token not found in response");
      }

        if (newMember.isLeader === "true") {
            if (response.data.id) {
                await MakeLeader(response.data.id);
                console.log("Leader assigned successfully");
            } else {
                console.error("ID not found in response"); // Debugging Line
            }
        }
    } catch (error) {
        console.error("Error adding member:", error);
        Swal.fire("Error", "Failed to add member.", "error");
    }
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
          await deleteTeamMember(id);
          setMembers(members.filter((mem) => mem.id !== id));
          Swal.fire("Deleted!", "Member has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting Member:", error);
          Swal.fire("Error", "Failed to delete Member.", "error");
        }
      }
    };
  

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setDetailOpen(true);
  };

  return (
    <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <Button variant="outlined" color="primary" sx={{mr:"55rem",mt:5}} onClick={()=>navigate(-1)}>Back</Button>
    <Button variant="contained" sx={{mt:5}} color="primary" onClick={() => setShowForm(!showForm)}>
      {showForm ? "Close Form" : "Add Member"}
    </Button>
    {showForm ? (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Create Member
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Name" name="name" value={newMember?.name || ""} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Email" name="email" value={newMember?.email || ""} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Password" name="password" type="password" value={newMember?.password ||
                  ""} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Confirm Password" name="confirmPassword" type="password" value={newMember?.confirmPassword || ""} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Join Date" name="joinDate" type="date" value={newMember?.joinDate || ""} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={newMember?.department || ""}
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
                  <TextField fullWidth margin="dense" label="Phone" name="phone" value={newMember?.phone || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth margin="dense" label="Address" name="address" value={newMember?.address || ""} onChange={handleChange} />
                </Grid>
              <Grid item xs={12} md={4}>
               <FormControl fullWidth margin="dense">
                <InputLabel>Role Name</InputLabel>
                  <Select name="roleName" value={newMember?.roleName || ""} onChange={handleChange}>
                    {roles.map((rol) => (
                      <MenuItem key={rol.id} value={rol.roleName}>{rol.roleName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
               <FormControl fullWidth margin="dense">
                <InputLabel>Project Name</InputLabel>
                  <Select name="projectName" value={newMember?.projectName || ""} onChange={handleChange}>
                    {projects.map((pro) => (
                      <MenuItem key={pro.id} value={pro.projectName}>{pro.projectName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Branch</InputLabel>
                  <Select name="branchName" value={newMember?.branchName || ""} onChange={handleChange}>
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.branchName}>{branch.branchName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Team ID</InputLabel>
                  <Select name="teamId" value={newMember?.teamId || ""} onChange={handleChange}>
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl component="fieldset" margin="dense">
                  <p><strong>Is Leader ?</strong></p>
                  <RadioGroup row name="isLeader" value={newMember?.isLeader || ""} onChange={handleChange}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
              <TextField
                  select
                  label="User Role"
                  name="userRole"
                  value={newMember.userRole}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {userRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Add Member
                </Button>
              </Grid>
              </Grid>
            </form>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Member List
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Email</b></TableCell>
                    <TableCell><b>Department</b></TableCell>
                    <TableCell><b>Project Name</b></TableCell>
                    <TableCell><b>Branch</b></TableCell>
                    <TableCell><b>User Role</b></TableCell>
                    <TableCell><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.projectName}</TableCell>
                      <TableCell>{member.branchName}</TableCell>
                      <TableCell>{member.userRole}</TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => handleViewDetails(member)}>View</Button>
                        <Button variant="contained" onClick={() => handleDelete(member.id)} sx={{ ml: 2, backgroundColor: "#fb6f92", color: "white" }}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      <Dialog open={detailOpen} onClose={handleDetailClose}>
        <DialogTitle>Member Details</DialogTitle>
        <DialogContent>
          {selectedMember  && (
            <>
              <Typography><strong>Name:</strong> {selectedMember.name}</Typography>
              <Typography><strong>Email:</strong> {selectedMember.email}</Typography>
              <Typography><strong>Password:</strong> {selectedMember.password}</Typography>
              <Typography><strong>Confirm Password:</strong> {selectedMember.confirmPassword}</Typography>
              <Typography><strong>Join Date:</strong> {selectedMember.joinDate}</Typography>
              <Typography><strong>Department:</strong> {selectedMember.department}</Typography>
              <Typography><strong>Phone:</strong> {selectedMember.phone}</Typography>
              <Typography><strong>Address:</strong> {selectedMember.address}</Typography>
              <Typography><strong>Role:</strong> {selectedMember.roleName}</Typography>
              <Typography><strong>Project Name:</strong> {selectedMember.projectName}</Typography>
              <Typography><strong>Branch:</strong> {selectedMember.branchName}</Typography>
              <Typography><strong>Is Leader:</strong> {selectedMember.isLeader}</Typography>
              <Typography><strong>User Role:</strong> {selectedMember.userRole}</Typography>
              </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} variant="contained">Close</Button>
          <Button variant="contained" onClick={() => handleDelete(newMember?.id)} sx={{ ml: 2, backgroundColor: "#fb6f92", color: "white" }}>Delete</Button>
        </DialogActions>
      </Dialog> 
    </Container>
  );
};

export default AddTeamMember;