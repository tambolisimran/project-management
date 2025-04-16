import { Grid, Paper, TextField, Button, Typography, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ForgetPassword = () => {
    const [role, setRole] = useState(""); 
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpTimestamp, setOtpTimestamp] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [timeRemaining, setTimeRemaining] = useState(300);
    const navigate = useNavigate();

    const paperStyle = { padding: 20, height: 'auto', width: 350, margin: '20px auto' };

    const handleSendOtp = async () => {
        if (!email || !role) {
            alert("Please select a role and enter your email.");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/forgetPassword/passwordRecovery", null, {
                params: { role, email }
            });
            console.log(response.data);
            setOtpTimestamp(Date.now());
            setTimeRemaining(300);
            alert("OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Failed to send OTP. Please try again.");
        }
    };

    useEffect(() => {
        if (otpTimestamp) {
            const interval = setInterval(() => {
                setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpTimestamp]);

    const handleVerifyOtp = async () => {
        if (!otp || !email || !role) {
            alert("Please enter OTP, email, and select role.");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/forgetPassword/passwordRecovery", null, {
                params: { role, email, otp: parseInt(otp, 10) }
            });
            alert(response.data);
        } catch (error) {
            console.error("OTP verification failed:", error);
            alert("Invalid OTP. Please enter the correct OTP.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/forgetPassword/passwordRecovery", null, {
                params: { role, email, newPassword, confirmPassword }
            });
            alert(response.data);
            navigate("/");
        } catch (error) {
            console.error("Password reset failed:", error);
            alert("Failed to reset password. Please try again.");
        }
    };

    return (
        <Grid textAlign="center">
            <Paper elevation={10} style={paperStyle}>
                <Typography variant="h5" sx={{ mb: 2 }}>Forgot Password</Typography>

                <TextField
                    select
                    label="Select Role"
                    fullWidth
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="PROJECT_ADMIN">Project Admin</MenuItem>
                    <MenuItem value="TEAM_MEMBER">Team Member</MenuItem>
                </TextField>

                <TextField
                    label="Email Address"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    sx={{ margin: "8px 0px" }}
                    onClick={handleSendOtp}
                >
                    Send OTP
                </Button>

                <TextField
                    label="Enter OTP"
                    fullWidth
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputProps={{ maxLength: 6, pattern: "[0-9]*", inputMode: "numeric" }}
                    sx={{ mt: "1rem" }}
                />
                
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    sx={{ margin: "8px 0px" }}
                    onClick={handleVerifyOtp}
                >
                    Verify OTP
                </Button>

                <Typography variant="h5" sx={{ mb: 2 }}>Reset Password</Typography>
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mt: "1rem" }}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mt: "1rem" }}
                />
                <Button
                    onClick={handleResetPassword}
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                    sx={{ margin: "8px 0px" }}
                >
                    Reset Password
                </Button>
            </Paper>
        </Grid>
    );
};

export default ForgetPassword;
