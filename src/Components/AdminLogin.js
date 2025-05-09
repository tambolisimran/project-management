import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  MenuItem,
  Modal
} from "@mui/material";
import { Visibility, VisibilityOff, LockOpenRounded } from "@mui/icons-material";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, forgotPassword, verifyOtp, resetPassword } from '../Services/APIServices';

// import { useAuth } from "./Layouts/ContextApi/AuthContext"

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().required("Role is required"),
});

const UserRole = ["ADMIN", "TEAM_LEADER"];


const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      console.log(response.data)
      // const { jwtToken, role } = response.data;
      sessionStorage.setItem("token", response.data.jwtToken);
      console.log('Full response:', response);
        if (response.data.role === "ADMIN") navigate('/admin-dashboard');
        else if (response.data.role === "TEAM_LEADER") navigate('/team-leader-dashboard');
        else if (response.data.role === "TEAM_MEMBER") navigate('/member-dashboard');
    } catch (error) {
      console.error("Error in form submission:", error.response?.data || error.message);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [role, setRole] = useState("");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  
  const resetModal = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };
  
  const handleModalClose = () => {
    setOpenModal(false);
    resetModal();
  };
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleForgetPassword = async () => {
    if (!role) {
      setError("Please select a role");
      return;
    }
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
  
    try {
      const response = await forgotPassword({
        email: email.trim(),
        role: role 
      });
      console.log(response.data);
      setStep(2);
      setError("");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError(error.response?.data?.message || "Error sending OTP");
    }
  };
  
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
  
    try {
      const response = await verifyOtp({
        email,
        role,
        otp: Number(otp)
      });
      console.log(response.data);
      setStep(3);
      setError("");
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError(error.response?.data?.message || "Invalid OTP");
    }
  };
  
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
  
    try {
      const response = await resetPassword({
        email,
        newPassword,
        confirmPassword,
        role
      });
      console.log(response.data);
      alert("Password reset successful. You can log in now.");
      handleModalClose();
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Box sx={{ p: 2, boxShadow: 3, borderRadius: 2, backgroundColor: "#f5f5f5" }}>
        <LockOpenRounded sx={{ fontSize: 50, color: "#A5158C" }} />
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            select
            label="Role"
            margin="normal"
            {...register("role")}
            error={!!errors.role}
            helperText={errors.role?.message}
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
          >
            {UserRole.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#A5158C", color: "white", fontSize: "1rem", fontWeight: "bold", mt: 3, py: 1, "&:hover": { backgroundColor: "#E53888" } }}>
            Login
          </Button>

          <Typography>
            <Link component="button" onClick={() => setOpenModal(true)}>
              Forgot Password?
            </Link>
          </Typography>
        </form>
      </Box>

      <Modal open={openModal} onClose={handleModalClose}>
        <Box sx={{ p: 4, width: 400, bgcolor: "white", mx: "auto", mt: "20%", borderRadius: 2, textAlign: "center" }}>
          {step === 1 && (
            <>
              <Typography variant="h6">Enter your role and email</Typography>
              
              <TextField
                fullWidth
                select
                label="Role"
                margin="normal"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                error={!role && error.includes("role")}
              >
                {UserRole.map((roleOption) => (
                  <MenuItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error.includes("email")}
                helperText={error.includes("email") ? error : ""}
              />
              
              {error && !error.includes("email") && (
                <Typography color="error">{error}</Typography>
              )}
              
              <Button 
                onClick={handleForgetPassword} 
                variant="contained" 
                sx={{ mt: 2 }}
                disabled={!role || !email}
              >
                Send OTP
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="h6">Enter OTP sent to {email}</Typography>
              <TextField 
                fullWidth 
                label="OTP" 
                margin="normal" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                error={!!error}
                helperText={error}
              />
              <Button 
                onClick={handleVerifyOtp} 
                variant="contained" 
                sx={{ mt: 2 }}
                disabled={!otp || otp.length !== 6}
              >
                Verify OTP
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Typography variant="h6">Reset Password</Typography>
              <TextField 
                fullWidth 
                label="New Password" 
                margin="normal" 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <TextField 
                fullWidth 
                label="Confirm Password" 
                margin="normal" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!error}
                helperText={error}
              />
              
              <Button 
                onClick={handleResetPassword} 
                variant="contained" 
                sx={{ mt: 2 }}
                disabled={!newPassword || !confirmPassword}
              >
                Reset Password
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminLogin;
