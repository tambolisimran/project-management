import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Paper, Grid, Typography, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { getTeamMemberById, updateTeamMember, getAllBranches, GetAllDepartments, getAllRoles, getAllProjects, GetAllTeams } from "../Services/APIServices";
import Swal from "sweetalert2";

const UpdateTeamMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    name: "",
    email: "",
    roleName: "",
    phone: "",
    department: "",
    branchName: "",
    address: "",
    joiningDate: "",
    teamId: "",
    isLeader: "false",
    projectName: "",
  });

  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchMember();
    fetchBranches();
    fetchDepartments();
    fetchRoles();
    fetchProjects();
    fetchTeams();
  }, []);

  const fetchMember = async () => {
    try {
      const response = await getTeamMemberById(id);
      setMember(response.data || {});
    } catch (error) {
      console.error("Error fetching member details:", error);
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
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await GetAllTeams();
      setTeams(response.data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTeamMember(id, member);
      Swal.fire("Success", "Member updated successfully!", "success");
      navigate(-1);
    } catch (error) {
      console.error("Error updating member:", error);
      Swal.fire("Error", "Failed to update member.", "error");
    }
  };

  return (
    <Container>
      <Button variant="outlined" color="primary" sx={{ mt: 5, mb: 2 }} onClick={() => navigate(-1)}>Back</Button>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h5" gutterBottom>
          Update Team Member
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" name="name" value={member.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" name="email" value={member.email} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select name="department" value={member.department} onChange={handleChange}>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.department}>{dept.department}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone" name="phone" value={member.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select name="roleName" value={member.roleName} onChange={handleChange}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.roleName}>{role.roleName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <p><strong>Is Leader?</strong></p>
                <RadioGroup row name="isLeader" value={member.isLeader} onChange={handleChange}>
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>Update Member</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default UpdateTeamMember;




// <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTitle>{isEditing ? "Update Member" : "Add Member"}</DialogTitle>
//         <DialogContent>
//           <form onSubmit={handleSubmit}>
//             <TextField fullWidth label="Name" name="name" value={memberData.name} onChange={handleChange} required sx={{ marginBottom: 2 }} />
//             <TextField fullWidth label="Email" name="email" value={memberData.email} onChange={handleChange} required sx={{ marginBottom: 2 }} />
//             <TextField fullWidth label="Phone" name="phone" value={memberData.phone} onChange={handleChange} required sx={{ marginBottom: 2 }} />
//             <Button type="submit" variant="contained">{isEditing ? "Update" : "Add"}</Button>
//           </form>
//         </DialogContent>
//       </Dialog> 

// if (newMember.isLeader) {  
//         if (response?.data?.id) { 
//             await MakeLeader(response.data.id);
//             console.log("Leader assigned successfully");
//         } else {
//             console.error("ID not found in response");
//         }
//     }




// import React, { useState, useEffect } from "react";
// import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, TableCell, TableBody, TableRow, Paper, Table, TableHead, TableContainer, Grid, FormControl, InputLabel, Select, MenuItem, FormControlLabel, RadioGroup, Radio, Container, Typography } from "@mui/material";
// import { addTeamMember, getAllMembers, getAllBranches, GetAllDepartments, getAllRoles, getAllProjects, GetAllTeams, updateTeamMember } from "../Services/APIServices";
// import Swal from "sweetalert2";
// import { useNavigate } from 'react-router-dom';
// import { motion } from "framer-motion";

// const AddTeamMember = () => {
//     const navigate = useNavigate();
//     const [members, setMembers] = useState([]);
//     const [departments, setDepartments] = useState([]);
//     const [branches, setBranches] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [teams, setTeams] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
    
//     const [memberData, setMemberData] = useState({
//         id: "",
//         name: "",
//         email: "",
//         roleName: "",
//         phone: "",
//         department: "",
//         branchName: "",
//         address: "",
//         joinDate: "",
//         teamId: "",
//         isLeader: "false",
//         projectName: "",
//     });

//     useEffect(() => {
//         fetchMembers();
//         fetchBranches();
//         fetchDepartments();
//         fetchRoles();
//         fetchProjects();
//         fetchTeams();
//     }, []);

//     const fetchMembers = async () => {
//         try {
//             const response = await getAllMembers();
//             setMembers(response.data || []);
//         } catch (error) {
//             Swal.fire("Error", "Failed to load members.", "error");
//         }
//     };

//     const handleChange = (e) => {
//         setMemberData({ ...memberData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (isEditing) {
//                 await updateTeamMember(memberData.id, memberData);
//                 Swal.fire("Success", "Member updated successfully!", "success");
//             } else {
//                 await addTeamMember(memberData);
//                 Swal.fire("Success", "Member added successfully!", "success");
//             }
//             fetchMembers();
//             setShowForm(false);
//             setIsEditing(false);
//             resetForm();
//         } catch (error) {
//             Swal.fire("Error", "Operation failed.", "error");
//         }
//     };

//     const handleEdit = (member) => {
//         setMemberData(member);
//         setShowForm(true);
//         setIsEditing(true);
//     };

//     const resetForm = () => {
//         setMemberData({
//             id: "",
//             name: "",
//             email: "",
//             roleName: "",
//             phone: "",
//             department: "",
//             branchName: "",
//             address: "",
//             joinDate: "",
//             teamId: "",
//             isLeader: "false",
//             projectName: "",
//         });
//     };

//     return (
//         <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//             <Button variant="outlined" color="primary" sx={{ mt: 5 }} onClick={() => navigate(-1)}>Back</Button>
//             <Button variant="contained" sx={{ mt: 5, ml: 2 }} color="primary" onClick={() => { setShowForm(!showForm); setIsEditing(false); resetForm(); }}>
//                 {showForm ? "Close Form" : "Add Member"}
//             </Button>

//             {showForm && (
//                 <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
//                     <Typography variant="h5" gutterBottom>{isEditing ? "Update Member" : "Create Member"}</Typography>
//                     <form onSubmit={handleSubmit}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} md={4}>
//                                 <TextField fullWidth label="Name" name="name" value={memberData.name} onChange={handleChange} required />
//                             </Grid>
//                             <Grid item xs={12} md={4}>
//                                 <TextField fullWidth label="Email" name="email" value={memberData.email} onChange={handleChange} required />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Button type="submit" variant="contained" color="primary" fullWidth>
//                                     {isEditing ? "Update Member" : "Add Member"}
//                                 </Button>
//                             </Grid>
//                         </Grid>
//                     </form>
//                 </Paper>
//             )}

//             <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
//                 <Typography variant="h6" gutterBottom>Member List</Typography>
//                 <TableContainer>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Name</TableCell>
//                                 <TableCell>Email</TableCell>
//                                 <TableCell>Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {members.map((member) => (
//                                 <TableRow key={member.id}>
//                                     <TableCell>{member.name}</TableCell>
//                                     <TableCell>{member.email}</TableCell>
//                                     <TableCell>
//                                         <Button variant="outlined" onClick={() => handleEdit(member)}>Edit</Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Container>
//     );
// };

// export default AddTeamMember;
