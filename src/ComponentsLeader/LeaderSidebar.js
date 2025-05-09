// components/LeaderSidebar.js
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
  Box,
  Typography,
} from "@mui/material";
import { Group, ProductionQuantityLimitsRounded } from "@mui/icons-material";

const leaderMenuItems = [
  { text: "Dashboard", icon: <Group />, path: "/team-leader-dashboard" },
  { text: "Project", icon: <ProductionQuantityLimitsRounded />, path: "/project" },
  { text: "My Tasks", icon: <Group />, path: "/leader-tasks" },
  { text: "Team", icon: <Group />, path: "/team" },
];

const LeaderSidebar = ({ open, setOpen }) => (
  <Drawer
    variant="permanent"
    open={open}
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
    sx={{
      width: open ? 240 : 60,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: open ? 240 : 60,
        transition: "width 0.3s",
        boxSizing: "border-box",
        backgroundColor: "#3D90D7",
        color: "#fff",
        zIndex: 1300,
      },
    }}
  >
    <Box sx={{ padding: 2 }}>{open && <Typography variant="h6">Leader Panel</Typography>}</Box>
    <Divider sx={{ backgroundColor: "#fff" }} />
    <List>
      {leaderMenuItems.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
          <NavLink to={item.path} style={{ textDecoration: "none", color: "inherit" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                "&:hover": { backgroundColor: "#3478B2" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ ml: 2, display: open ? "block" : "none" }} />
            </ListItemButton>
          </NavLink>
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default LeaderSidebar;
