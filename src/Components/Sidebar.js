import React, { useState } from "react";
import { NavLink} from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Group,
  ProductionQuantityLimitsRounded,
} from "@mui/icons-material";

const adminMenuItems = [
  { text: "Dashboard", icon: <Group />, path: "/admin-dashboard" },
  { text: "Project", icon: <ProductionQuantityLimitsRounded />, path: "/project" },
  { text: "Task List", icon: <Group />, path: "/tasklist" },
  { text: "Team Setting", icon: <Group />, path: "/teamsetting" },
  { text: "Menu", icon: <MenuIcon />, path: "/menu" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false); 
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          width: open ? 240 : 60,
          flexShrink: 0,
          backgroundColor: "#3D90D7", 
          "& .MuiDrawer-paper": {
            width: open ? 240 : 60,
            transition: "width 0.3s",
            boxSizing: "border-box",
            backgroundColor: "#3D90D7", 
            color: "#fff", 
            zIndex: 1200, // Lower z-index than the TopNavbar
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            color: "#fff", 
          }}
        >
          {open && <Typography variant="h6">Admin Panel</Typography>}
        </Box>
        <Divider sx={{ backgroundColor: "#fff" }} />

        <List>
          {adminMenuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <NavLink
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    "&:hover": {
                      backgroundColor: "#3478B2", 
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      color: "#fff", 
                      fontWeight: 500, 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      ml: 2,
                      display: open ? "block" : "none", 
                    }}
                  />
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>

        
      </Drawer>
    </Box>
  );
};

export default Sidebar;
