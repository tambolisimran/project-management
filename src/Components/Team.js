import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Box
} from "@mui/material";
import {
  addTeam,
  GetAllTeams,
  deleteTeam,
  getTeamById,
  getAllBranches,
  GetAllDepartments,
  updateTeam
} from "../Services/APIServices";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
// import { useAuth } from "./Layouts/ContextApi/AuthContext";

const Team = () => {
  // const { token } = useAuth();
  const navigate = useNavigate();
  const [updateOpen, setUpdateOpen] = useState(false); 
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    branch: "",
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
      
      if (response && response.data) {  
        setBranches(response.data);
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]); 
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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDetailClose = () => setDetailOpen(false);

  const handleChange = (e) => {
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
      const response = await addTeam(newTeam);
      setTeams([...teams, response.data]);
      console.log("team added sucessfully",response.data);
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

  const handleGetById = async (id) => {
    try {
      console.log("Fetching team with ID:", id);
      const response = await getTeamById(id);
      console.log("Response received:", response.data);
      if(response.data){
        setSelectedTeam(response.data);
        setDetailOpen(true);
      }else{
        Swal.fire("Error", "Department not found!", "error");
      }
      
    } catch (error) {
      console.error("Error fetching team details", error);
      Swal.fire("Error", "Failed to fetch team details.", "error");
    }
};


const handleUpdate = async () => {
  try {
    await updateTeam(selectedTeam.id, selectedTeam);
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === selectedTeam.id ? selectedTeam : team
      )
    );    
   fetchTeams();
    setUpdateOpen(false);
    Swal.fire("Updated!", "Team details updated successfully.", "success");
  } catch (error) {
    console.error("Error updating team:", error);
    Swal.fire("Error", "Failed to update team.", "error");
  }
};
  const handleBack = () =>{
    navigate("/sidebar")
  }

  return (
    <>
     <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 7,
          mx: 32,
        }}
      >
        <Button
          variant="contained"
          color="white"
          onClick={handleBack}
          sx={{
            color: "white",
            backgroundColor: "#3F51B5",
          }}
        >
          Back
        </Button>
        <Button
        variant="contained"
        sx={{
          backgroundColor: "#3F51B5",
          color: "white",
          fontSize: "1rem",
          fontWeight: "bold",
          ml:15
        }}
        onClick={handleClickOpen}
      >
        Add Team
      </Button>
      </Box>
      

      <Dialog open={open} onClose={handleDetailClose}>
        <DialogTitle>Add Team</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Team Name"
            name="teamName"
            value={newTeam.teamName}
            onChange={handleChange}
          />

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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
  <DialogTitle>Update Team</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      margin="dense"
      label="Team Name"
      name="teamName"
      value={selectedTeam?.teamName || ""}
      onChange={(e) => setSelectedTeam({ ...selectedTeam, teamName: e.target.value })}
    />
    <FormControl fullWidth margin="dense">
      <InputLabel>Branch</InputLabel>
      <Select
        name="branch"
        value={selectedTeam?.branch || ""}
        onChange={(e) => setSelectedTeam({ ...selectedTeam, branch: e.target.value })}
      >
        {branches.map((branch) => (
          <MenuItem key={branch.id} value={branch.branchName}>
            {branch.branchName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth margin="dense">
      <InputLabel>Department</InputLabel>
      <Select
        name="department"
        value={selectedTeam?.department || ""}
        onChange={(e) => setSelectedTeam({ ...selectedTeam, department: e.target.value })}
      >
        {departments.map((department) => (
          <MenuItem key={department.id} value={department.department}>
            {department.department}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setUpdateOpen(false)} variant="outlined">
      Cancel
    </Button>
    <Button onClick={handleUpdate} variant="contained">
      Update
    </Button>
  </DialogActions>
</Dialog>


     <TableContainer
        component={Paper}
        sx={{
        marginTop: 4,
        maxWidth: "60%",
        marginLeft: "auto",
        marginRight: "auto",
        }}
        >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3F51B5" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Team Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Branch
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Department
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team, index) => (
              <TableRow key={index}>
                <TableCell>{team.teamName}</TableCell>
                <TableCell>{team.branch}</TableCell>
                <TableCell>{team.department}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleGetById(team.id)}
                    variant="outlined"
                    sx={{ color: "#3F51B5", mr: 1 }}>
                    View
                  </Button>
                  <Button
                    onClick={() => handleDelete(team.id)}
                    variant="contained"
                    sx={{ backgroundColor: "#D32F2F", color: "white" }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedTeam(team);
                      setUpdateOpen(true);
                    }}
                    variant="contained"
                    sx={{ backgroundColor: "green", color: "white", ml: 1 }}
                  >
                    Update
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={detailOpen} onClose={handleDetailClose}>
              <DialogTitle>Team Details</DialogTitle>
              <DialogContent>
                {selectedTeam ? (
                  <>
                    <p>
                      <strong>ID:</strong> {selectedTeam.id}
                    </p>
                    <p>
                      <strong>Name:</strong> {selectedTeam.teamName}
                    </p>
                    <p>
                      <strong>Branch:</strong> {selectedTeam.branch}
                    </p>
                    <p>
                      <strong>Department:</strong> {selectedTeam.department}
                    </p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDetailClose} variant="outlined">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
    </>
  );
};

export default Team;
