import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Services/APIServices";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Submitting formData:", data);
    try {
        const response = await registerUser(data);
        console.log("Form submitted successfully", response); 
            alert("Registration successful as leader!");
            navigate("/login");
        }
     catch (error) {
        console.error("Error submitting form:", error);
        alert("Registration failed! Please try again.");
    }
};

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Box sx={{ p: 2, boxShadow: 3, borderRadius: 2, backgroundColor: "#f5f5f5" }}>
        <Lock sx={{ fontSize: 50, color: "#A5158C" }} />
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Register
        </Typography>    
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Name" margin="normal" {...register("name", { required: "Name is required" })} error={!!errors.name} helperText={errors.name?.message} />
          
          <TextField fullWidth label="Email" margin="normal" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } })} error={!!errors.email} helperText={errors.email?.message} />

          <TextField fullWidth label="Phone" margin="normal" {...register("phone", { required: "Phone number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" } })} error={!!errors.phone} helperText={errors.phone?.message} />

          <TextField fullWidth label="Password" margin="normal" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: "Include uppercase, lowercase, number, and special character" } })} error={!!errors.password} helperText={errors.password?.message} type={showPassword ? "text" : "password"} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />

          <TextField fullWidth label="Confirm Password" margin="normal" {...register("confirmpassword", { required: "Confirm password is required", validate: (value) => value === password || "Passwords do not match" })} error={!!errors.confirmpassword} helperText={errors.confirmpassword?.message} type={showConfirmPassword ? "text" : "password"} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowConfirmPassword} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />

          <Button type="submit" variant="contained" sx={{ backgroundColor: "#A5158C", color: "white", fontSize: "1rem", fontWeight: "bold", mt: 3, py: 1, "&:hover": { backgroundColor: "#E53888" } }}>Register</Button>
        <Button onClick={()=>navigate("/login")} type="submit" variant="contained" sx={{ backgroundColor: "#A5158C", ml:3, color: "white", fontSize: "1rem", fontWeight: "bold", mt: 3, py: 1, "&:hover": { backgroundColor: "#E53888" } }}>Already Registered</Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
