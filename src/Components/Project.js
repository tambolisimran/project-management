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
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  LinearProgress,
  Container,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import {
  addProject,
  getAllProjects,
  getAllBranches,
  GetAllDepartments,
  deleteProjects,
  updateProject,
  GetAllTeams,
  assignProjectToTeam,
  getProjectByName
} from "../Services/APIServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Delete, Edit, Visibility } from "@mui/icons-material";

const Project = () => {
  const userRole = sessionStorage.getItem("role"); 
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [branches, setBranches] = useState([]);

  const [add, setAdd] = useState({
    projectName: "",
    projectCategory: "",
    statusBar: 0,
    status: "",
    startDate: "",
    endDate: "",
    estimatedDate: "",
    statusDescription: "",
    branchName: "",
    department: "",
    team1byID:''
  });

  useEffect(() => {
    fetchProjects();
    fetchBranches();
    fetchDepartments();
    fetchTeams();
  }, []);

  const handleSearchProject = async () => {
  try {
    const response = await getProjectByName(searchName);
    setSearchResult(response.data);
  } catch (error) {
    console.error("Search failed", error);
    Swal.fire("Not Found", "No project found with that name.", "error");
    setSearchResult(null);
  }
};

const handleInputChange = (event, value) => {
  setSearchName(value || "");
  if (!value) {
    setProjectSuggestions([]);
    return;
  }

  const filtered = projects.filter((p) =>
    p.projectName.toLowerCase().includes(value.toLowerCase())
  );
  setProjectSuggestions(filtered);
};

  const fetchProjects = async () => {
    console.log("Fetching projects..."); 
  
    try {
      const response = await getAllProjects();
      console.log(response)
      setProjects(response?.data)
    } catch (error) {
      console.error("Error fetching projects:", error);
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

  const fetchDepartments = async () => {
    try {
      const response = await GetAllDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
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

  const handleDetailClose = () => setDetailOpen(false);

  const handleChange = (e) => {
    setAdd({ ...add, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
      const response = await addProject(add); 
      const createdProject = response.data;
      console.log(response.data);
       if (add.team1byID) {
      await assignProjectToTeam(createdProject.id, add.team1byID);
    }
      fetchProjects();
      Swal.fire("Success", "Project added successfully!", "success");
    } catch (error) {
      console.error("Error adding project:", error);
      Swal.fire("Error", "Failed to add project.", "error");
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
        await deleteProjects(id);
        setProjects(projects.filter((pro) => pro.id !== id));
        Swal.fire("Deleted!", "Project has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting project:", error);
        Swal.fire("Error", "Failed to delete project.", "error");
      }
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setDetailOpen(true);
  };

  const editProject = (project) => {
    setAdd({
      projectName: project.projectName || "",
      projectCategory: project.projectCategory || "",
      statusBar: project.statusBar || 0,
      status: project.status || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      estimatedDate: project.estimatedDate || "",
      statusDescription: project.statusDescription || "",
      branchName: project.branchName || "",
      department: project.department || "",
      team1byID: project.team1byID || "",
    });
    setEditId(project.id);
    setEditDialogOpen(true);
  };
  
  const handleUpdateProject = async (e) => {
  e.preventDefault();

  try {
    const existingProject = projects.find((p) => p.id === editId);

    const updatedProject = {
      ...add,
      team1byID: add.team1byID || existingProject.team1byID, 
    };

    const response = await updateProject(editId, updatedProject);
    if (response && response.data) {
      console.log(response.data);
      if (add.team1byID) {
        await assignProjectToTeam(editId, add.team1byID);
      }
      fetchProjects(); 
      Swal.fire("Updated", "Project updated successfully!", "success");
    } else {
      throw new Error("Invalid response from server");
    }
    setAdd({
      projectName: "",
      projectCategory: "",
      statusBar: 0,
      status: "",
      startDate: "",
      endDate: "",
      estimatedDate: "",
      statusDescription: "",
      branchName: "",
      department: "",
      team1byID: "", 
    });

    setEditDialogOpen(false);
    setEditId(null);
  } catch (error) {
    console.error("Error updating project:", error);
    Swal.fire("Error", "Failed to update project.", "error");
  }
};

  
  return (
      <Container
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mt: 3 }}  >
        <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}  >
          Back
        </Button>
        <FormControl sx={{ minWidth: 250, maxWidth: 400 }}>
  <InputLabel>Select Project</InputLabel>
  <Select
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    label="Select Project"
  >
    <MenuItem value="">All Projects</MenuItem>
    {projects.map((project) => (
      <MenuItem key={project.id} value={project.projectName}>
        {project.projectName}
      </MenuItem>
    ))}
  </Select>
</FormControl>


        {userRole === "ADMIN" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "Add Project"}
          </Button>
        )}
      </Box>
      {showForm ? (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Create Project
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth margin="dense" label="Project Name" name="projectName" value={add.projectName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth margin="dense" label="Project Category" name="projectCategory" value={add.projectCategory} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth label="Status bar" name="statusBar" value={add.statusBar} onChange={handleChange}>
                  {[...Array(11)].map((_, i) => (
                    <MenuItem key={i * 10} value={i * 10}>{`${i * 10}%`}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Status</InputLabel>
                  <Select name="status" value={add.status} onChange={handleChange} required>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Status Description" name="statusDescription" value={add.statusDescription} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Start Date" name="startDate" type="date" value={add.startDate} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="End Date" name="endDate" type="date" value={add.endDate} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Estimated Date" name="estimatedDate" type="date" value={add.estimatedDate} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Branch</InputLabel>
                  <Select name="branchName" value={add.branchName || ""} onChange={handleChange}>
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
                  <Select name="department" value={add.department || ""} onChange={handleChange}>
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
                  <InputLabel>Team</InputLabel>
                  <Select name="team1byID" value={add.team1byID || ""} onChange={handleChange}>
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                      {team.teamName}
                    </MenuItem>

                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Add Project
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Project List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>Project Name</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Progress</b></TableCell>
                  <TableCell><b>Start Date</b></TableCell>
                  <TableCell><b>End Date</b></TableCell>
                  <TableCell><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(searchName
                    ? projects.filter((p) => p.projectName === searchName)
                    : projects
                  ).map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress variant="determinate" value={project.statusBar || 0} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {`${Math.round(project.statusBar || 0)}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{project.startDate}</TableCell>
                    <TableCell>{project.endDate}</TableCell>
                    <TableCell>
                      <Visibility variant="outlined" onClick={() => handleViewDetails(project)} sx={{ color: "#3F51B5", cursor: "pointer", mr: 1 }} />
                    {userRole === "ADMIN" && (
                      <>
                      <Edit
                      sx={{ color: "#1976D2", cursor: "pointer", mr: 1 }}
                      onClick={() => editProject(project)}
                      />

                      <Delete variant="contained" onClick={() => handleDelete(project?.id)} sx={{ color: "#D32F2F", cursor: "pointer", mr: 1 }} />
                      </>
                    )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={detailOpen} onClose={handleDetailClose}>
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <>
              <Typography><strong>Project Name:</strong> {selectedProject.projectName}</Typography>
              <Typography><strong>Project Category:</strong> {selectedProject?.projectCategory}</Typography>
              <Typography><strong>Status Bar:</strong> {selectedProject?.statusBar}</Typography>
              <Typography><strong>Status:</strong> {selectedProject?.status}</Typography>
              <Typography><strong>Start Date:</strong> {selectedProject?.startDate}</Typography>
              <Typography><strong>End Date:</strong> {selectedProject?.endDate}</Typography>
              <Typography><strong>Estimated Date:</strong> {selectedProject?.estimatedDate}</Typography>
              <Typography><strong>Status Description:</strong> {selectedProject?.statusDescription}</Typography>
              <Typography><strong>Branch Name:</strong> {selectedProject?.branchName}</Typography>
              <Typography><strong>Department:</strong> {selectedProject?.department}</Typography>
              <Typography><strong>Team:</strong> {
                teams.find(t => t.id === selectedProject?.team1byID)?.id || "N/A"
              }</Typography>

            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>  

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <form onSubmit={handleUpdateProject}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Project Name" name="projectName" value={add.projectName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Project Category" name="projectCategory" value={add.projectCategory} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                name="status"
                value={add.status}
                onChange={handleChange}
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
              </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status Description"
                  name="statusDescription"
                  value={add.statusDescription}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth label="Status bar" name="statusBar" value={add.statusBar} onChange={handleChange}>
                  {[...Array(11)].map((_, i) => (
                    <MenuItem key={i * 10} value={i * 10}>{`${i * 10}%`}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={add.startDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={add.endDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estimated Date"
                  name="estimatedDate"
                  type="date"
                  value={add.estimatedDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Branch</InputLabel>
                  <Select
                    name="branchName"
                    value={add.branchName}
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={add.department}
                    onChange={handleChange}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.department}>
                        {dept.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Team</InputLabel>
                  <Select
                    name="team1byID"
                    value={add.team1byID}
                    onChange={handleChange}
                  >
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.teamName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </DialogActions>
              </form>
              </Dialog>
            </Container>
  );
};

export default Project;
