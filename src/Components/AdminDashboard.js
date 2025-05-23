import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  Chip,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  // Removed BarChart imports since we no longer need it
} from "recharts";

import { getAllTask } from "../Services/APIServices";

const STATUS_COLORS = {
  Completed: "#4caf50",
  "In Progress": "#ff9800",
  Pending: "#f44336",
  "On Hold": "#2196f3",
};

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllTask();
        const fetchedTasks = response.data;
        setTasks(fetchedTasks);
        generateChartData(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterMonthlyTasks();
  }, [tasks, month, year]);

  const generateChartData = (tasks) => {
    const statusCount = {};
    tasks.forEach((task) => {
      const status = task.status;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const data = Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_COLORS[status] || "#8884d8",
    }));

    setTaskData(data);
  };

  const filterMonthlyTasks = () => {
    const monthTasks = tasks.filter((task) => {
      const taskDate = new Date(task.startDate);
      return taskDate.getFullYear() === year && taskDate.getMonth() === month;
    });

    const dayCount = {};
    monthTasks.forEach((task) => {
      const day = new Date(task.startDate).getDate();
      dayCount[day] = (dayCount[day] || 0) + 1;
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      count: dayCount[i + 1] || 0,
    }));

    setFilteredTasks(chartData);
  };

  const countByDateRange = (days) => {
    const now = new Date();
    const fromDate = new Date(now);
    fromDate.setDate(now.getDate() - days);

    return tasks.filter((task) => {
      const taskDate = new Date(task.startDate);
      return taskDate > fromDate;
    }).length;
  };

  return (
    <Box
      sx={{
        display: "flex",
        // Removed marginLeft to shift everything left
        padding: 3,
        width: "100%",  // Take full width now
        paddingTop: 5,
        gap: 3,
      }}
    >

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 140,
        }}
      >
        {[{ label: "Today", days: 1 }, { label: "Last 7 Days", days: 7 }, { label: "Last 30 Days", days: 30 }, { label: "Last 365 Days", days: 365 }, { label: "Total", days: Infinity }].map(({ label, days }, index) => (
          <Card
            key={index}
            sx={{
              background: "#f5f5f5",
              height: 80,
              width: 140,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: 1,
              ml:6
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {days === Infinity ? tasks.length : countByDateRange(days)}
            </Typography>
          </Card>
        ))}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 3 }}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Admin Dashboard - Task Management
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Task Status Overview
              </Typography>

              <Box sx={{ height: 300, marginBottom: 5 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {taskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 3, maxHeight: 500, overflowY: "auto" }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Recent Tasks
              </Typography>
              {tasks.length === 0 ? (
                <Typography>No tasks available.</Typography>
              ) : (
                <List disablePadding>
                  {tasks.slice(0, 5).map((task) => (
                    <ListItem
                      key={task.id}
                      divider
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {task.subject || "Untitled Task"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mb: 0.5 }}
                      >
                        {task.description?.length > 100
                          ? `${task.description.substring(0, 100)}...`
                          : task.description || "No description"}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Chip
                          label={`Priority: ${task.priority || "N/A"}`}
                          size="small"
                          color="primary"
                        />
                        <Chip
                          label={task.status || "Unknown"}
                          size="small"
                          sx={{
                            backgroundColor:
                              STATUS_COLORS[task.status] || "grey",
                            color: "#fff",
                          }}
                        />
                        <Chip
                          label={`Start: ${task.startDate || "-"}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`End: ${task.endDate || "-"}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Monthly All Days Tasks
              </Typography>

              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <FormControl size="small">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={year}
                    label="Year"
                    onChange={(e) => setYear(Number(e.target.value))}
                  >
                    {[...Array(5)].map((_, i) => {
                      const y = new Date().getFullYear() - i;
                      return (
                        <MenuItem key={y} value={y}>
                          {y}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={month}
                    label="Month"
                    onChange={(e) => setMonth(Number(e.target.value))}
                  >
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m, i) => (
                      <MenuItem key={i} value={i}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredTasks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    label={{ value: "Day", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                   dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
