import React, { useState, useEffect } from "react";
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
import {
  Menu as MenuIcon,
  Group,
  ProductionQuantityLimitsRounded,
  Task,
  People,
  TaskAlt,
  TaskRounded,
  SquareTwoTone,
  BookOnline,
} from "@mui/icons-material";
import {jwtDecode} from "jwt-decode";
import { SITE_URI } from "../Services/Config";

const adminMenuItems = [
  { text: "Dashboard", icon: <Group />, path: `${SITE_URI}/admin-dashboard` },
  { text: "Project", icon: <ProductionQuantityLimitsRounded />, path: `${SITE_URI}/project` },
  { text: "Task List", icon: <Task />, path: `${SITE_URI}/tasklist` },
  { text: "Team Setting", icon: <People />, path: `${SITE_URI}/teamsetting` },
  { text: "Menu", icon: <MenuIcon />, path: `${SITE_URI}/menu` },
];

const leaderMenuItems = [
  { text: "Main Dashboard", icon: <SquareTwoTone />, path: `${SITE_URI}/team-leader-dashboard` },
  { text: "Team", icon: <People />, path: `${SITE_URI}/team` },
  { text: "Project", icon: <BookOnline />, path: `${SITE_URI}/project` },
  { text: "My Tasks", icon: <TaskAlt />, path: `${SITE_URI}/alltask` },
  { text: "Tasks", icon: <TaskRounded />, path: `${SITE_URI}/taskToMember` },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(null); 

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const roles = decoded?.userRole || [];
        console.log("Decoded Roles:", roles);

        if (roles.includes("ROLE_ADMIN")) {
          setRole("admin");
        } else if (
          roles.includes("TEAM_LEADER_UPDATE") ||
          roles.includes("TEAM_LEADER_READ")
        ) {
          setRole("leader");
        } else {
          setRole("unknown");
        }
      } catch (err) {
        console.error("Token decoding error:", err);
        setRole("unknown");
      }
    }
  }, []);

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  if (!role) return null;

  const menuItems = role === "admin" ? adminMenuItems : leaderMenuItems;

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
          "& .MuiDrawer-paper": {
            width: open ? 240 : 60,
            transition: "width 0.3s",
            boxSizing: "border-box",
            backgroundColor: "#3D90D7",
            color: "#fff",
            zIndex: 1200,
            mt:2
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
          {open && <Typography variant="h6">{role === "admin" ? "Admin Panel" : "Leader Panel"}</Typography>}
        </Box>
        <Divider sx={{ backgroundColor: "#fff" }} />
        <List>
          {menuItems.map((item) => (
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
