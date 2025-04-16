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
  addBranch,
  getAllBranches,
  deleteBranch,
  getBranchById,
} from "../Services/APIServices";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from "./Layouts/ContextApi/AuthContext";

const Branch = () => {
  // const { token } = useAuth();
  const navigate = useNavigate();
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
                  py: 1,
                }}
                onClick={handleClickOpen}
              >
                Add Branch
              </Button>
            </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Branch</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Branch Name"
            name="branchName"
            value={add.branchName}
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
                Branch Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branch.map((branc, index) => (
              <TableRow key={index}>
                <TableCell>{branc.branchName}</TableCell>
                <TableCell>
                  <Button onClick={() => handleGetById(branc.id)} variant="outlined" sx={{ color: "#9067C6", mr: 1 }}>
                    View
                  </Button>
                  <Button onClick={() => handleDelete(branc.id)} variant="contained" sx={{ color: "white" ,backgroundColor:"#fb6f92"}}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Dialog open={detailOpen} onClose={handleDetailClose}>
        <DialogTitle>Branch Details</DialogTitle>
        <DialogContent>
          {selectedBranch ? (
            <>
              <p>
                <strong>ID:</strong> {selectedBranch.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedBranch.branchName}
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

export default Branch;  