import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle,TextField, Button,   TableCell, TableBody, TableRow, Paper,Table,TableHead,TableContainer, Grid, InputLabel, Select, MenuItem, Container,Typography,Tooltip , Autocomplete, FormControl} from "@mui/material";
import { addTeamMember, getAllMembers ,getMemberById,  getAllBranches, GetAllDepartments,getAllRoles , getAllProjects ,deleteTeamMember , MakeLeader , updateTeamMember,getTasksByMemberEmail} from "../Services/APIServices";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Visibility, Delete , AssignmentInd ,ArrowCircleUp, Edit} from "@mui/icons-material";
import  { createFilterOptions } from '@mui/material/Autocomplete';

const AddTeamMember = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState({});
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
   const [showmembers, setShowmembers] = useState(false);
   const [loading, setLoading] = useState(false);
   const [searchEmail, setSearchEmail] = useState("");
     const emailList = members.map((leader) => leader.email);
  const [selectedImage, setSelectedImage] = useState('');
   const [newMember, setNewMember] = useState({
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

  useEffect(() => {
    fetchMembers(); 
    fetchBranches();
    fetchDepartments();
    fetchRoles();
    fetchProjects();
  }, []);

      const fetchMembers = async () => {
        setLoading(true);
        try {
          const response = await getAllMembers();
          setMembers(response.data);
        } catch (error) {
          Swal.fire("Error", "Failed to load members.", "error");
        } finally {
          setLoading(false);
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
        const res = await getAllProjects(); 
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    console.log("Submitting Data:", newMember);
    
    try {
      const existing = members.find(mem => mem.email === newMember.email);
      if (existing) {
        Swal.fire("Duplicate", "A member with this email already exists", "warning");
        return;
      }
      
      const data = new FormData();
      const { file, ...rest } = newMember;
      data.append("data", JSON.stringify(rest));

      if (file instanceof File) {
        data.append("image", file);
      }
      for (let pair of data.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }

      const response = await addTeamMember(data);  
      console.log("API Response:", response.data);
      await fetchMembers();
      Swal.fire("Success", "Member added successfully!", "success");
  
      setNewMember({
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
        projectName: ""
      });
    } catch (error) {
      console.error("Error adding member:", error);
      Swal.fire("Error", `Failed to add member: ${error.response.data.message || "Unknown error"}`, "error");
    }
  };
  

const handlePromoteToLeader = async (member) => {
    if (!member) return;
  if (member.userRole === "TEAM_LEADER") {
    Swal.fire("Already a Leader", `${member?.name} is already a Team Leader`, "info");
    return;
  }

  const result = await Swal.fire({
    title: "Promote to Leader?",
    text: `Are you sure you want to promote ${member?.name} to Team Leader?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, promote!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      const response = await MakeLeader(member.id);
      console.log("Promotion response:", response.data);
      const updatedMembers = members.map((m) =>
        m.id === member.id
          ? { ...m, userRole: "TEAM_LEADER", isLeader: "true" }
          : m
      );
      setMembers(updatedMembers);

      Swal.fire("Promoted", `${member?.name} is now a Team Leader`, "success");
    } catch (error) {
      console.error("Error promoting member:", error);
      Swal.fire("Error", "Failed to promote member.", "error");
    }
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
          const response = await deleteTeamMember(id);
          console.log(response.data);
          setMembers(members.filter((mem) => mem.id !== id));
          Swal.fire("Deleted!", "Member has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting Member:", error);
          Swal.fire("Error", "Failed to delete Member.", "error");
        }
      }
    };

      const handleViewDetails = async (member) => {
        try {
          const response = await getMemberById(member.id);
          setSelectedMember(response.data);
          setDetailOpen(true);
        } catch (error) {
          console.error("Failed to fetch full details:", error);
        }
      };
      
      const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedMember((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      
      const handleUpdate = async (e) => {
        e.preventDefault();
        setOpen(false);
        try {
          const response = await updateTeamMember(selectedMember.id, selectedMember); 
          console.log("Updated Member Response:", response.data);
          setMembers((prevMembers) => 
            prevMembers.map((member) => 
              member.id === selectedMember.id ? { ...member, ...selectedMember } : member
            )
          );
      
          Swal.fire("Success", "Member updated successfully!", "success");
          setSelectedMember({
            name: "",
            email: "",
            password: "",
            roleName: "",
            phone: "",
            department: "",
            branchName: "",
            imageUrl:null,
            address: "",
            joinDate: "",
            projectName: "",
          }); 
      
        } catch (error) {
          console.error("Error updating member:", error);
          Swal.fire("Error", `Failed to update member: ${error.response.data.message || "Unknown error"}`, "error");
        }
      };
      
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedMember((prev) => ({
          ...prev,
          file: file,
        }));
      };
      
      
      // const handleEditClick = (member) => {
      //   setSelectedMember(member);
      //   setOpen(true);
      // };
      
      const handleUpdateClick = (member) => {
        setSelectedMember(member);
        setOpen(true);
      };

      const handleCloseDialog = () => {
        setOpen(false);
        setSelectedMember({}); 
      };

      const filter = createFilterOptions(); 
            const filterNew = createFilterOptions({
              matchFrom: 'any',
              stringify: (option) => option.toLowerCase(), 
            });

  return (
    <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <Button variant="outlined" color="primary" sx={{mr:"55rem",mt:5}} onClick={()=>navigate(-1)}>Back</Button>
    <Button variant="contained" sx={{mt:5}} color="primary" onClick={() => setShowmembers(!showmembers)}>
      {showmembers ? "Close members" : "Add Member"}
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
                  const response = await getTasksByMemberEmail(newInputValue.trim()); 
                  setMembers([response.data]); 
                } catch (error) {
                  console.error("Error fetching leader by email:", error);
                  Swal.fire("Error", "No leader found with this email", "error");
                }
              } else {
                fetchMembers(); 
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
    {showmembers ? (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
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
              <TextField fullWidth margin="dense" label="Join Date" name="joinDate" type="date" InputLabelProps={{ shrink: true }}
              value={newMember?.joinDate || ""} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={newMember?.department || ""}
                      onChange={handleChange}>
                    <MenuItem value="">Select Department</MenuItem>
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
                  <MenuItem value="" >Select Roles</MenuItem>
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
                    <MenuItem value="">Select Project</MenuItem>
                    {Array.isArray(projects) && projects.map(pro =>  (
                      <MenuItem key={pro.id} value={pro.projectName}>
                        {pro.projectName}
                      </MenuItem>
                    ))}
                  </Select>
               </FormControl>
              </Grid>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Branch</InputLabel>
                  <Select name="branchName" value={newMember?.branchName || ""} onChange={handleChange}>
                  <MenuItem value="">Select Branch</MenuItem>
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.branchName}>{branch.branchName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="contained" component="label" fullWidth>
                    Upload Image
                    <input type="file" accept="image/*" onChange={(e) => setNewMember((prev) => ({ ...prev, file: e.target.files[0],
                      }))
                    }
                  />
                </Button>
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
                  <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
                  <TableCell><b>ID</b></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Email</b></TableCell>
                    <TableCell><b>Department</b></TableCell>
                    <TableCell><b>Role</b></TableCell>
                    <TableCell><b>Branch</b></TableCell>
                    <TableCell><b>Image</b></TableCell>
                    <TableCell><b>Task</b></TableCell>
                    <TableCell><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                 {Array.isArray(members) && members.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{member?.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.roleName}</TableCell>
                      <TableCell>{member.branchName}</TableCell>
                      <TableCell>
                        {member.imageUrl ? (
                          <img src={member.imageUrl} alt="task" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => { setSelectedImage(member.imageUrl);
                          setOpen(true);
                        }}
                      />
                        ) : (
                            'No Image'
                        )}
                    </TableCell>
                      <TableCell>
                        <AssignmentInd
                          variant="contained"
                          color="info"
                          onClick={() =>navigate("/assign-task", {
                            state: {
                              member: member, 
                              isLeader: false
                            }
                          })}
                          sx={{ ml: 1, cursor: "pointer" }}
                        />
                      </TableCell>
                      <TableCell>

                      <Visibility sx={{ color: "#3F51B5", cursor: "pointer", mr: 1 }} onClick={() => handleViewDetails(member)}  />
                      <Edit 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleUpdateClick(member)} 
                        sx={{ ml: 1 }}
                      />
                      <Delete onClick={() => handleDelete(member.id)} sx={{ color: "#D32F2F", cursor: "pointer", mr: 1 }} />

                      {member.userRole !== "TEAM_LEADER" ? (
                    <Tooltip title="Promote to Leader">
                    <ArrowCircleUp
                      onClick={() => handlePromoteToLeader(member)}
                      sx={{ color: "#4CAF50", cursor: "pointer", ml: 1 }}
                    />
                  </Tooltip>
                  
                  ) : (
                    <Button variant="contained" color="primary" disabled sx={{ ml: 1 }}>
                      Team Leader
                    </Button>
                  )}
                  {member.userRole === "TEAM_LEADER" && (
                  <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                    (Leader)
                  </Typography>
                )}
                      {/* <Button variant="contained" color="info" onClick={() => handleOpenTaskModal(member)} sx={{ ml: 1 }}>
                        Assign Task
                      </Button> */}

                    {/* <AssignmentInd
                      variant="contained"
                      color="info"
                      onClick={() => navigate(`/assign-task/${member.id}`, { state: { member } })}
                      sx={{ ml: 1 }} /> */}

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
         {/* <AddTask
  open={openTaskModal}
  onClose={handleCloseTaskModal}
  member={selectedMember}
/> */}

        <Dialog open={detailOpen} onClose={handleDetailClose}>
          <DialogTitle>Member Details</DialogTitle>
          <DialogContent>
            {selectedMember && (
              <>
                <Typography><strong>Name:</strong> {selectedMember?.name || "N/A"}</Typography>
                <Typography><strong>Email:</strong> {selectedMember.email || "N/A"}</Typography>
                <Typography><strong>Phone:</strong> {selectedMember.phone || "N/A"}</Typography>
                <Typography><strong>Address:</strong> {selectedMember.address || "N/A"}</Typography>
                <Typography><strong>Join Date:</strong> {selectedMember.joinDate || "N/A"}</Typography>
                <Typography><strong>Department:</strong> {selectedMember.department || "N/A"}</Typography>
                <Typography><strong>Project:</strong> {selectedMember.projectName || "N/A"}</Typography>
                <Typography><strong>Branch:</strong> {selectedMember.branchName || "N/A"}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open && Boolean(selectedMember)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Update Team Member</DialogTitle>
          <DialogContent dividers>
            <form id="updateMembermembers" onSubmit={handleUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={selectedMember?.name || ""}
                    onChange={handleUpdateChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={selectedMember?.email || ""}
                    onChange={handleUpdateChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Password"
                    name="password"
                    type="password"
                    value={selectedMember?.password || ""}
                    onChange={handleUpdateChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Join Date"
                    name="joinDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={selectedMember?.joinDate || ""}
                    onChange={handleUpdateChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={selectedMember?.department || ""}
                      onChange={handleUpdateChange}
                    >
                      <MenuItem value="">Select Department</MenuItem>
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.department}>
                          {dept.department}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Phone"
                    name="phone"
                    value={selectedMember?.phone || ""}
                    onChange={handleUpdateChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Address"
                    name="address"
                    value={selectedMember?.address || ""}
                    onChange={handleUpdateChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Role Name</InputLabel>
                    <Select
                      name="roleName"
                      value={selectedMember?.roleName || ""}
                      onChange={handleUpdateChange}
                    >
                      <MenuItem value="">Select Roles</MenuItem>
                      {roles.map((rol) => (
                        <MenuItem key={rol.id} value={rol.roleName}>
                          {rol.roleName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Project Name</InputLabel>
                    <Select
                      name="projectName"
                      value={selectedMember?.projectName || ""}
                      onChange={handleUpdateChange}
                    >
                      <MenuItem value="">Select Project</MenuItem>
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
                    <InputLabel>Branch</InputLabel>
                    <Select
                      name="branchName"
                      value={selectedMember?.branchName || ""}
                      onChange={handleUpdateChange}
                    >
                      <MenuItem value="">Select Branch</MenuItem>
                      {branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.branchName}>
                          {branch.branchName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                <Button variant="contained" component="label">
                  Upload New Image
                  <input type="file" hidden onChange={handleImageChange} />
                </Button>
              </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
           <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
    </Container>
  );
};

export default AddTeamMember;