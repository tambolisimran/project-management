import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOpenRounded } from "@mui/icons-material";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Member_Login } from '../Services/APIServices';

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const MemberLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Submitting form data", data);
    try {
      const response = await Member_Login(data);
      console.log("Form submitted successfully", response.data);
      localStorage.setItem("token", response.data.token )
      console.log(localStorage.getItem("token"));
      navigate('/sidebar');
    } catch (error) {
      console.log("Error in form submission:", error.response?.data || error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Box
        sx={{
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <LockOpenRounded sx={{ fontSize: 50, color: "#A5158C" }} />
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Admin Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#A5158C",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              mt: 3,
              py: 1,
              "&:hover": { backgroundColor: "#E53888" },
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default MemberLogin;
