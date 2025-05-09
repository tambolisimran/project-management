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
  addBranch,
  getAllBranches,
  deleteBranch,
  getBranchById,
} from "../Services/APIServices";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

const Branch = () => {  

  const navigate = useNavigate();
   const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [branch, setBranch] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [add, setAdd] = useState({ role: "" });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
        const response = await getAllBranches();
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
            setBranch(response.data);
        } else {
            setBranch([]); 
        }
    } catch (error) {
        console.error("Error fetching branch:", error);
        Swal.fire("Error", "Failed to load branch.", "error");
    }
};

  const handleChange = (e) => {
    setAdd({ ...add, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
      const response = await addBranch(add);
      console.log("Branch added successfully", response.data);
      setBranch([...branch, response.data]); 
      setAdd({ branchName: "" });
    } catch (error) {
      console.error("Error adding branch:", error);
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
            await deleteBranch(id);
            Swal.fire("Deleted!", "Branch has been deleted.", "success");
            setBranch(branch.filter(rol => rol.id !== id)); 
        } catch (error) {
            console.error("Error deleting branch:", error);
            Swal.fire("Error", "Failed to delete branch.", "error");
        }
    }
};

    const handleGetById = async (id) => {
      if (!id) {
        Swal.fire("Error", "Invalid Role ID", "error");
        return;
      }

      try {
        const response = await getBranchById(id);
        console.log("Fetched Branch:", response.data);
        
        if (response.data) {
          setSelectedBranch(response.data);
          setDetailOpen(true);
        } else {
          Swal.fire("Error", "Branch not found!", "error");
        }
      } catch (error) {
        console.error("Error fetching branch details:", error);
        Swal.fire("Error", "Failed to fetch branch details.", "error");
      }
    };

  return (
    <>
     <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Button variant="outlined" color="primary" sx={{mr:"55rem",mt:5}} onClick={()=>navigate(-1)}>Back</Button>
            <Button variant="contained" sx={{mt:5}} color="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Close Form" : "Add Branch"}
            </Button>
            {showForm ? (
                    <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                      <Typography variant="h5" gutterBottom>
                        Create Branch
                      </Typography>
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={4}>
                          <TextField
                              fullWidth
                              margin="dense"
                              label="Branch Name"
                              name="branchName"
                              value={add.branchName}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth> Add Branch </Button>
                          </Grid>
                          </Grid>
                      </form>
                    </Paper>
                    ):(
              <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>Branch List</Typography>
                <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
                          <TableCell><b>ID</b></TableCell>
                          <TableCell><b>Branch Name</b></TableCell>
                          <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {branch.map((branc, index) => (
                          <TableRow key={index}>
                            <TableCell>{branc.id}</TableCell>
                            <TableCell>{branc.branchName}</TableCell>
                            <TableCell>
                              {/* <Visibility onClick={() => handleGetById(branc.id)} sx={{ color: "#3F51B5", cursor: "pointer", mr: 1 }} /> */}
                              <Delete onClick={() => handleDelete(branc.id)} sx={{ color: "#D32F2F", cursor: "pointer", mr: 1 }} />
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

export default Branch;  