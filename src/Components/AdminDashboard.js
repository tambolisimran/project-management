import React from "react";
import { Box, Typography, Grid, Paper, List, ListItem, ListItemText, Chip } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Sample Data for Task Status Chart
const taskData = [
  { name: "Completed", value: 40, color: "#4caf50" },
  { name: "In Progress", value: 30, color: "#ff9800" },
  { name: "Pending", value: 20, color: "#f44336" },
  { name: "On Hold", value: 10, color: "#2196f3" },
];

// Sample Task List
const tasks = [
  { id: 1, title: "Fix UI Bugs", status: "In Progress" },
  { id: 2, title: "API Integration", status: "Completed" },
  { id: 3, title: "Database Optimization", status: "Pending" },
  { id: 4, title: "Deploy to Production", status: "On Hold" },
];

const AdminDashboard = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Admin Dashboard - Task Management
      </Typography>

      <Grid container spacing={3}>
        {/* Task Status Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6">Task Status Overview</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Task List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6">Task List</Typography>
            <List>
              {tasks.map((task) => (
                <ListItem key={task.id}>
                  <ListItemText primary={task.title} />
                  <Chip
                    label={task.status}
                    color={
                      task.status === "Completed"
                        ? "success"
                        : task.status === "In Progress"
                        ? "warning"
                        : task.status === "Pending"
                        ? "error"
                        : "primary"
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
