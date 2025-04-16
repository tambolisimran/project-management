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
  addRole,
  getAllRoles,
  deleteRole,
  getRoleById,
} from "../Services/APIServices";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from "./Layouts/ContextApi/AuthContext";

const Role = () => {
//  const { token } = useAuth();
  const navigate = useNavigate();
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
        const response = await addRole(add);
        console.log("Role added successfully", response.data);
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
            py: 1,
          }}
          onClick={handleClickOpen}
        >
          Add Role
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Role</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Role Name"
            name="roleName"
            value={add.roleName}
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
                Role Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((rol, index) => (
              <TableRow key={index}>
                <TableCell>{rol.roleName}</TableCell>
                <TableCell>
                  <Button onClick={() => handleGetById(rol.id)} variant="outlined" sx={{ color: "#9067C6", mr: 1 }}>
                    View
                  </Button>
                  <Button onClick={() => handleDelete(rol.id)} variant="contained" sx={{ color: "white" ,backgroundColor:"#fb6f92"}}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Dialog open={detailOpen} onClose={handleDetailClose}>
        <DialogTitle>Role Details</DialogTitle>
        <DialogContent>
          {selectedRole ? (
            <>
              <p>
                <strong>ID:</strong> {selectedRole.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedRole.roleName}
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

export default Role;  