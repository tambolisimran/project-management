import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  TableCell,
  TableBody,
  TableRow,
  Paper,
  Table,
  TableHead,
  TableContainer,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import {
  addTeam,
  GetAllTeams,
  deleteTeam,
  getTeamById,
  getAllBranches,
  GetAllDepartments,
  updateTeam,
} from "../Services/APIServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

const Team = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    branchName: "",
    department: "",
  });

  useEffect(() => {
    fetchTeams();
    fetchBranches();
    fetchDepartments();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await GetAllTeams();
      setTeams(response.data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      Swal.fire("Error", "Failed to load teams.", "error");
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await getAllBranches();
      setBranches(response?.data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await GetAllDepartments();
      setDepartments(response?.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleChange = (e) => {
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addTeam(newTeam);
      setTeams([...teams, response.data]);
      setNewTeam({ teamName: "", branchName: "", department: "" });
    } catch (error) {
      console.error("Error adding team:", error);
      Swal.fire("Error", "Failed to add team.", "error");
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
        await deleteTeam(id);
        setTeams(teams.filter((team) => team.id !== id));
        Swal.fire("Deleted!", "Team has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting team:", error);
        Swal.fire("Error", "Failed to delete team.", "error");
      }
    }
  };

  // const handleView = async (id) => {
  //   try {
  //     const response = await getTeamById(id);
  //     if (response.data) {
  //       setSelectedTeam(response.data);
  //       setViewOpen(true);
  //     } else {
  //       Swal.fire("Error", "Team not found!", "error");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching team details", error);
  //     Swal.fire("Error", "Failed to fetch team details.", "error");
  //   }
  // };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setUpdateOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await updateTeam(selectedTeam.id, selectedTeam);
      if (response.status === 200 || response.status === 204) {
        await fetchTeams();
        setUpdateOpen(false);
        setSelectedTeam(null);
        Swal.fire("Success", "Team updated successfully.", "success");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating team:", error);
      Swal.fire("Error", "Failed to update team.", "error");
    }
  };

  return (
    <Container
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="outlined"
        color="primary"
        sx={{ mr: "55rem", mt: 5 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Button
        variant="contained"
        sx={{ mt: 5 }}
        color="primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "Add Team"}
      </Button>

      {showForm && (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Create Team
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Team Name"
                  name="teamName"
                  value={newTeam.teamName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Branch</InputLabel>
                  <Select
                    name="branchName"
                    value={newTeam.branchName}
                    onChange={handleChange}
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.branchName}>
                        {branch.branchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={newTeam.department}
                    onChange={handleChange}
                  >
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.department}>
                        {department.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Add Team
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {updateOpen && selectedTeam && (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Update Team
          </Typography>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Team Name"
                  name="teamName"
                  value={selectedTeam.teamName}
                  onChange={(e) =>
                    setSelectedTeam({ ...selectedTeam, teamName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Branch</InputLabel>
                  <Select
                    name="branchName"
                    value={selectedTeam.branchName}
                    onChange={(e) =>
                      setSelectedTeam({ ...selectedTeam, branchName: e.target.value })
                    }
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.branchName}>
                        {branch.branchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={selectedTeam.department}
                    onChange={(e) =>
                      setSelectedTeam({ ...selectedTeam, department: e.target.value })
                    }
                  >
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.department}>
                        {department.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Update Team
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => { setUpdateOpen(false); setSelectedTeam(null); }}
                  color="secondary"
                  fullWidth
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {!showForm && (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Team List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "lightgrey" }}>
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>Team Name</b></TableCell>
                  <TableCell><b>Branch</b></TableCell>
                  <TableCell><b>Department</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={index}>
                    <TableCell>{team.id}</TableCell>
                    <TableCell>{team.teamName}</TableCell>
                    <TableCell>{team.branchName}</TableCell>
                    <TableCell>{team.department}</TableCell>
                    <TableCell>
                      {/* <Visibility
                        onClick={() => handleView(team.id)}
                        sx={{ color: "#3F51B5", cursor: "pointer", mr: 1 }}
                      /> */}
                      <Delete
                        onClick={() => handleDelete(team.id)}
                        sx={{ color: "#D32F2F", cursor: "pointer", mr: 1 }}
                      />
                      <Edit
                        onClick={() => handleEdit(team)}
                        sx={{ color: "green", cursor: "pointer" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default Team;
