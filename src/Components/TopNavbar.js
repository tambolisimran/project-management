import React, { useState } from "react";
import { AppBar, Box, IconButton, Toolbar, Menu, MenuItem, Divider } from "@mui/material";
import { AccountCircle, Home } from "@mui/icons-material"; 
import { NavLink, useNavigate } from "react-router-dom"; // Add useNavigate
import { SITE_URI } from "../Services/Config";

const TopNavbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate(); 
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSettings = () => {
    navigate("/profile"); 
    handleMenuClose(); 
  };

  const handleLogout = () => {

    localStorage.removeItem("authToken"); 
    navigate(`${SITE_URI}`); 
    handleMenuClose(); 
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#3D90D7",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
        zIndex: 1201, 
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <NavLink to="/" style={{ color: "inherit" }}>
          <IconButton color="inherit" edge="start">
            <Home /> 
          </IconButton>
        </NavLink>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleMenuOpen}
            size="large"
            edge="end"
            color="inherit"
            aria-label="account settings"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 200,
              },
            }}
          >
            <MenuItem onClick={handleProfileSettings}>Profile Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
