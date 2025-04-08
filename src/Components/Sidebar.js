import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  Menu as MenuIcon,
  Logout,
  Close,
  VerifiedUser,
  Group,
  SupervisedUserCircle,
  ProductionQuantityLimitsRounded,
} from "@mui/icons-material";

const menuItems = [
  { text: "Department", icon: <Dashboard />, path: "/department" },
  { text: "Role", icon: <SupervisedUserCircle />, path: "/roles" },
  { text: "Branch", icon: <VerifiedUser />, path: "/branch" },
  { text: "Teams", icon: <Group />, path: "/team" },
  {text: "Add task", icon: <Group />, path: "/create" },
  { text: "Dashboard", icon: <Group />, path: "/admin-dashboard" },
  { text: "Project", icon: <ProductionQuantityLimitsRounded />, path: "/project" },
  { text: "Team Member", icon: <Group />, path: "/team-member" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 240 : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : 60,
            transition: "width 0.3s",
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          {open && <Typography variant="h6">Admin Panel</Typography>}
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <Close /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider />

        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
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
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} sx={{ ml: 2 }} />}
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List sx={{ marginTop: "auto" }}>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                <Logout />
              </ListItemIcon>
              {open && <ListItemText primary="Logout" sx={{ ml: 2 }} />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
