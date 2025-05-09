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
  Box,
  Container,
  Typography,
  Grid
} from "@mui/material";
import {
  addDepartment,
  GetAllDepartments,
  deleteDepartment,
  getDepartmentById,
} from "../Services/APIServices";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

const Department = () => {

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [add, setAdd] = useState({ department: "" });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
      try {
        const response = await GetAllDepartments();
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        Swal.fire("Error", "Failed to load departments.", "error");
      }
    };


  const handleChange = (e) => {
    setAdd({ ...add, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
      const response = await addDepartment(add);
      console.log("Department added successfully", response.data);
      setDepartments([...departments, response.data]);
      setAdd({ department: "" });
    } catch (error) {
      console.error("Error adding department:", error);
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
            await deleteDepartment(id);
            Swal.fire("Deleted!", "Department has been deleted.", "success");
            setDepartments(departments.filter(dept => dept.id !== id)); 
        } catch (error) {
            console.error("Error deleting department:", error);
            Swal.fire("Error", "Failed to delete department.", "error");
        }
    }
};

    const handleGetById = async (id) => {
      if (!id) {
        Swal.fire("Error", "Invalid Department ID", "error");
        return;
      }

      try {
        const response = await getDepartmentById(id);
        console.log("Fetched Department:", response.data);
        
        if (response.data) {
          setSelectedDepartment(response.data);
          setDetailOpen(true);
        } else {
          Swal.fire("Error", "Department not found!", "error");
        }
      } catch (error) {
        console.error("Error fetching department details:", error);
        Swal.fire("Error", "Failed to fetch department details.", "error");
      }
    };

  return (
    <>
    
    <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Button variant="outlined" color="primary" sx={{mr:"55rem",mt:5}} onClick={()=>navigate(-1)}>Back</Button>
            <Button variant="contained" sx={{mt:5}} color="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Close Form" : "Add Department"}
            </Button>
            {showForm ? (
                    <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                      <Typography variant="h5" gutterBottom>
                        Create Department
                      </Typography>
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={4}>
                          <TextField
                              fullWidth
                              margin="dense"
                              label="Department Name"
                              name="department"
                              value={add.department}
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
                <Typography variant="h6" gutterBottom>Department List</Typography>
            <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
                      <TableCell><b>ID</b></TableCell>
                      <TableCell><b>Department Name</b></TableCell>
                      <TableCell><b>Actions</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments.map((dept, index) => (
                      <TableRow key={index}>
                        <TableCell>{dept.id}</TableCell>
                        <TableCell>{dept.department}</TableCell>
                        <TableCell>
                          {/* <Visibility onClick={() => handleGetById(dept.id)} sx={{ color: "#3F51B5", cursor: "pointer", mr: 1 }} /> */}
                          <Delete onClick={() => handleDelete(dept.id)} sx={{ color: "#D32F2F", cursor: "pointer", mr: 1 }} />
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

export default Department;  