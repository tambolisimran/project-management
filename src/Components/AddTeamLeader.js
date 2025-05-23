import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle,TextField, Button,   TableCell, TableBody, TableRow, Paper,Table,TableHead,TableContainer, Grid, FormControl,InputLabel, Select, MenuItem, 
  Container,Typography,
  Autocomplete,
  Box,
  Tooltip
} from "@mui/material";
import { createFilterOptions } from '@mui/material/Autocomplete';
import { addLeader, getAllTeamLeaders ,getTeamLeaderById,  getAllBranches, GetAllDepartments, deleteTeamLeader ,GetAllTeams, updateTeamLeader , getTeamLeaderByEmail,getTodaysLeaderTasks} from "../Services/APIServices";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Visibility, Delete, Edit, AssignmentInd, CalendarToday} from "@mui/icons-material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {SITE_URI}  from '../Services/Config';


const AddTeamLeader = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showTodaysTasks, setShowTodaysTasks] = useState(false);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editLeader, setEditLeader] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const emailList = leaders.map((leader) => leader.email);
  const [selectedImage, setSelectedImage] = useState('');


  const [newLeader, setNewLeader] = useState({
    name: "",
    email: "",
    password:"",
    phone: "",
    address: "",
    department: "",
    branchName: "",
    joinDate: "",
    teamId:"",
    imageUrl:null
  });

  useEffect(() => {
    fetchLeaders(); 
    fetchBranches();
    fetchDepartments();
    fetchTeams();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await getAllTeamLeaders();
      setLeaders(response.data || []);
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
    const { name, value } = e.target;
    let updatedLeader = { ...newLeader, [name]: value };
    setNewLeader(updatedLeader);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    const token = localStorage.getItem("token");
    console.log("Submitting Data:", newLeader);
    try {
      const data = new FormData();
      const { file, ...rest } = newLeader;
      data.append("data", JSON.stringify(rest));

      if (file instanceof File) {
        data.append("image", file);
      }
      for (let pair of data.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }

        const response = await addLeader(data,token);
        console.log("API Response:", response.data);
        console.log(response.data.jwtToken);   
        fetchLeaders();
        Swal.fire("Success", "Leader added successfully!", "success");
        setNewLeader({
          name: "",
          email: "",
          password:"",
          phone: "",
          address: "",
          department: "",
          branchName: "",
          joinDate: "",
          imageUrl:null,
          teamId:"",
        });        
    } catch (error) {
        console.error("Error adding leader:", error);
        Swal.fire("Error", "Failed to add leader.", "error");
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
          const response = await deleteTeamLeader(id);
          console.log(response.data);
          setLeaders(leaders.filter((led) => led.id !== id));
          Swal.fire("Deleted!", "Leader has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting leader:", error);
          Swal.fire("Error", "Failed to delete leader.", "error");
        }
      }
    };
  
      const handleViewDetails = async (leader) => {
        try {
          const response = await getTeamLeaderById(leader.id); 
          setSelectedLeader(response.data);
          setDetailOpen(true);
        } catch (error) {
          console.error("Failed to fetch full details:", error);
        }
      };

      const handleEditClick = (leader) => {
        setEditLeader({ ...leader });
        setEditOpen(true);
      };
      
      const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditLeader((prev) => ({ ...prev, [name]: value }));
      };
      
    
      const handleClose = () => {
        setOpen(false);
        setSelectedLeader(null);
      };
    
      const handleUpdate = async (updatedData) => {
        try {
          const { id, ...data } = updatedData;
          await updateTeamLeader(id, data); 
          fetchLeaders();
          handleClose();
          Swal.fire("Success", "Leader updated successfully!", "success");
          setEditOpen(false);
        } catch (error) {
          console.error("Error updating leader", error);
          Swal.fire("Error", "Failed to update leader.", "error");
        }
      };

      const filter = createFilterOptions(); 
      const filterNew = createFilterOptions({
        matchFrom: 'any',
        stringify: (option) => option.toLowerCase(), 
      });

      const handleTodaysTasks = async (email) => {
        try {
          const response = await getTodaysLeaderTasks(email);
          const tasks = response?.data || [];
      
          console.log("Today's tasks for", email, tasks);
      
          if (tasks.length > 0) {
            Swal.fire({
              title: "Today's Tasks",
              html: tasks.map((task, index) => 
                `${index + 1}. <b>${task.subject}</b> - ${task.description}`
              ).join('<br>'),
              icon: "info",
              confirmButtonText: "Close",
            });
          } else {
            Swal.fire("No tasks", "No tasks assigned for today.", "info");
          }
        } catch (error) {
          console.error("Error fetching today's tasks:", error);
          Swal.fire("Error", "Failed to load today's tasks.", "error");
        }
      };
      
      
  return (
    <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <Button variant="outlined" color="primary" sx={{mr:"55rem",mt:5}} onClick={()=>navigate(-1)}>Back</Button>
    <Button variant="contained" sx={{mt:5}} color="primary" onClick={() => setShowForm(!showForm)}>
      {showForm ? "Close Form" : "Add Leader"}
    </Button>
    <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 1}}>
        <Grid item>
          <Autocomplete
          sx={{ml:'10'}}
            freeSolo
            options={emailList}
            value={searchEmail}
            onInputChange={async (event, newInputValue) => {
            setSearchEmail(newInputValue);
            if (newInputValue.trim()) {
            try {
              const response = await getTeamLeaderByEmail(newInputValue.trim()); 
              setLeaders([response.data]); 
            } catch (error) {
              console.error("Error fetching leader by email:", error);
              Swal.fire("Error", "No leader found with this email", "error");
            }
          } else {
            fetchLeaders(); 
          }
        }}
        filterOptions={filterNew} 
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search by Email"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
              },
              input: {
                textAlign: 'center',
                fontWeight: 500,
                fontSize: '16px',
              },
              width: '300px',
              mb: 2,
            }}
          />
            )}
          />
      </Grid>
    </Grid>
    {showForm ? (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Create Leader
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Name" name="name" value={newLeader?.name || ""} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Email" name="email" value={newLeader?.email || ""} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Password" name="password" type="password" value={newLeader?.password ||
                  ""} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Phone" name="phone" type="number" value={newLeader?.phone || ""} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                  <TextField fullWidth margin="dense" label="Address" name="address" value={newLeader?.address || ""} onChange={handleChange} />
                </Grid>
              <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={newLeader?.department || ""}
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
                  <Select name="branchName" value={newLeader?.branchName || ""} onChange={handleChange}>
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.branchName}>{branch.branchName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth margin="dense" label="Join Date" name="joinDate" type="date" value={newLeader?.joinDate || ""} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select name="teamId" label="Team" value={newLeader.teamId} onChange={handleChange}>
                  {teams.map(team => (
                  <MenuItem key={team.id} value={team.id}>{team.id}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
                          <Button variant="contained" component="label" fullWidth>
                            Upload Image
                            <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    setNewLeader((prev) => ({
                                      ...prev,
                                      file: e.target.files[0],
                                    }))
                                  }
                                />
                          </Button>
                        </Grid>
                          
              
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Add Leader
                </Button>
              </Grid>
              </Grid>
            </form>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Leader List
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
                    <TableCell><b>ID</b></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Email</b></TableCell>
                    <TableCell><b>Department</b></TableCell>
                    <TableCell><b>Branch</b></TableCell>
                    <TableCell><b>task</b></TableCell>
                    <TableCell><b>Image</b></TableCell>
                    <TableCell><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaders.map((leader) => (
                    <TableRow key={leader.id}>
                      <TableCell>{leader.id}</TableCell>
                      <TableCell>{leader.name}</TableCell>
                      <TableCell>{leader.email}</TableCell>
                      <TableCell>{leader.department}</TableCell>
                      <TableCell>{leader.branchName}</TableCell>
                      <TableCell>
                        <AssignmentInd variant="contained" color="info" onClick={() => navigate("/assign-task", {
                          state: {
                            member: leader, 
                            isLeader: true
                          }
                        })
                        } sx={{ ml: 1, cursor: "pointer" }} />
                      </TableCell>
                      <TableCell>
                          {leader.imageUrl ? (
                            <img src={leader.imageUrl} alt="task" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => { setSelectedImage(leader.imageUrl);
                              setOpen(true);
                            }}
                          />
                        ) : (
                              'No Image'
                            )}
                      </TableCell>
                      <TableCell>
                        <Visibility sx={{ color: "#3F51B5", cursor: "pointer", mr: 1 }} onClick={() => handleViewDetails(leader)} />
                        <Edit onClick={() => handleEditClick(leader)}
                        sx={{ color: "green", cursor: "pointer" }} />
                        <Delete variant="contained" onClick={() => handleDelete(leader.id)} sx={{ color: "#D32F2F", cursor: "pointer", mr: 1 }} />
                      <Tooltip title="show today's task">
                        <CalendarToday
                        color="success"
                        sx={{ cursor: 'pointer', ml: 1 }}
                        onClick={() => navigate(`${SITE_URI}/todays-tasks`, { state: { leader } })}
                      />
                      </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      <Dialog open={detailOpen} onClose={handleDetailClose}>
        <DialogTitle>Leader Details</DialogTitle>
        <DialogContent>
          {selectedLeader  && (
            <>
              <Typography><strong>Name:</strong> {selectedLeader?.name}</Typography>
              <Typography><strong>Email:</strong> {selectedLeader?.email}</Typography>
              <Typography><strong>Password:</strong> {selectedLeader?.password}</Typography>
              <Typography><strong>Join Date:</strong> {selectedLeader?.joinDate}</Typography>
              <Typography><strong>Team:</strong> {selectedLeader?.team?.id || "N/A"}</Typography>
              <Typography><strong>Department:</strong> {selectedLeader?.department}</Typography>
              <Typography><strong>Phone:</strong> {selectedLeader?.phone}</Typography>
              <Typography><strong>Address:</strong> {selectedLeader?.address}</Typography>
              <Typography><strong>Branch:</strong> {selectedLeader?.branchName || "N/A"}</Typography>
              </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog> 
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Edit Leader</DialogTitle>
  <DialogContent>
    {editLeader && (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Name" name="name" value={editLeader.name || ""} onChange={handleEditChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Email" name="email" value={editLeader.email || ""} onChange={handleEditChange} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth margin="dense" label="Password" name="password" type="password" value={editLeader?.password || ""} onChange={handleEditChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Phone" name="phone" value={editLeader.phone || ""} onChange={handleEditChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Address" name="address" value={editLeader.address || ""} onChange={handleEditChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select name="department" value={editLeader.department || ""} onChange={handleEditChange}>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.department}>{dept.department}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Branch</InputLabel>
            <Select name="branchName" value={editLeader.branchName || ""} onChange={handleEditChange}>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.branchName}>{branch.branchName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Team</InputLabel>
            <Select name="teamId" value={editLeader.teamId || ""} onChange={handleEditChange}>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>{team.id}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Join Date"
            name="joinDate"
            type="date"
            value={editLeader.joinDate || ""}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditOpen(false)} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => handleUpdate(editLeader)} color="primary" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
    {showTodaysTasks && (
  <Box mt={2} className="glass-effect" p={2} borderRadius={2} boxShadow={3}>
    <Typography variant="h6" gutterBottom>Today's Tasks</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task ID</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todaysTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.subject}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.projectName}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.startDate}</TableCell>
              <TableCell>{task.EndDate}</TableCell>
              <TableCell>{task.days}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}

    <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>

    </Container>
  );
};

export default AddTeamLeader;