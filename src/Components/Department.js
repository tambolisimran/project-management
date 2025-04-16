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
  Box
} from "@mui/material";
import {
  addDepartment,
  GetAllDepartments,
  deleteDepartment,
  getDepartmentById,
} from "../Services/APIServices";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from "./Layouts/ContextApi/AuthContext";

const Department = () => {
  // const { token } = useAuth();
  const navigate = useNavigate();
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
  

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDetailClose = () => setDetailOpen(false);

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

    const handleBack = () =>{
      navigate('/sidebar');
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
            ml:15,
          }}
          onClick={handleClickOpen}
        >
          Add Department
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Department Name"
            name="department"
            value={add.department}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: "#A5158C",
              fontSize: "1rem",
              fontWeight: "bold",
              mt: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#A5158C",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              mt: 3,
            }}
          >
            Add
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
                Department Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept, index) => (
              <TableRow key={index}>
                <TableCell>{dept.department}</TableCell>
                <TableCell>
                  <Button onClick={() => handleGetById(dept.id)} variant="outlined" sx={{ color: "#9067C6", mr: 1 }}>
                    View
                  </Button>
                  <Button onClick={() => handleDelete(dept.id)} variant="contained" sx={{ color: "white" ,backgroundColor:"#fb6f92"}}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Dialog open={detailOpen} onClose={handleDetailClose}>
        <DialogTitle>Department Details</DialogTitle>
        <DialogContent>
          {selectedDepartment ? (
            <>
              <p>
                <strong>ID:</strong> {selectedDepartment.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedDepartment.department}
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

export default Department;  