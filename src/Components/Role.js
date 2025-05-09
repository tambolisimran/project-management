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
  Container,
  Typography,
  Grid,
} from "@mui/material";
import {
  addRole,
  getAllRoles,
  deleteRole,
  getRoleById,
} from "../Services/APIServices";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

const Role = () => {

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [add, setAdd] = useState({ roleName: "" });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
        const response = await getAllRoles();
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
            setRoles(response.data);
        } else {
            setRoles([]); 
        }
    } catch (error) {
        console.error("Error fetching role:", error);
        Swal.fire("Error", "Failed to load role.", "error");
    }
};

  const handleChange = (e) => {
    setAdd({ ...add, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
        const response = await addRole(add);
        Swal.fire("Role added successfully", response.data);
        setRoles([...roles, response.data]);
        setAdd({ roleName: "" });
    } catch (error) {
        console.error("Error adding role:", error);
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
            await deleteRole(id);
            Swal.fire("Deleted!", "Role has been deleted.", "success");
            setRoles(roles.filter(rol => rol.id !== id)); 
        } catch (error) {
            console.error("Error deleting role:", error);
            Swal.fire("Error", "Failed to delete role.", "error");
        }
    }
};

const handleGetById = async (id) => {
  if (!id) {
    Swal.fire("Error", "Invalid Role ID", "error");
    return;
  }
  try {
    const response = await getRoleById(id);
    if (response.data) {
      setSelectedRole(response.data);
      setDetailOpen(true);
    } else {
      Swal.fire("Error", "Role not found!", "error");
    }
  } catch (error) {
    console.error("Error fetching role details:", error);
    Swal.fire("Error", "Failed to fetch role details.", "error");
  }
};

  return (
    <>
    <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Button variant="outlined" color="primary" sx={{mr:"55rem",mt:5}} onClick={()=>navigate(-1)}>Back</Button>
            <Button variant="contained" sx={{mt:5}} color="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Close Form" : "Add Role"}
            </Button>
            {showForm ? (
                    <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                      <Typography variant="h5" gutterBottom>
                        Create Role
                      </Typography>
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            margin="dense"
                            label="Role Name"
                            name="roleName"
                            value={add.roleName}
                            onChange={handleChange}
                          />
                          </Grid>
                          <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth> Add Role </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>
                    ):(
          <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>Role List</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
                    <TableCell><b>ID</b></TableCell>
                    <TableCell><b>Role Name</b></TableCell>
                    <TableCell><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map((rol, index) => (
                    <TableRow key={index}>
                      <TableCell>{rol.id}</TableCell>
                      <TableCell>{rol.roleName}</TableCell>
                      <TableCell>
                        {/* <Visibility onClick={() => handleGetById(rol.id)} sx={{ color: "#3F51B5", cursor: "pointer", mr: 1 }} /> */}
                        <Delete onClick={() => handleDelete(rol.id)} sx={{ color: "#D32F2F", cursor: "pointer", mr: 1 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Paper>
            )}
            </Container>
          </>
        );
      };

export default Role;  