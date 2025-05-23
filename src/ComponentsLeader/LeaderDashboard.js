import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  getAssignedTasksOfLeader,
  getTasksAssignedByLeader,
} from "../Services/APIServices";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const LeaderDashboard = () => {
  const [mode, setMode] = useState("admin");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const [dateMonthFilter, setDateMonthFilter] = useState("All");
  const [dateYearFilter, setDateYearFilter] = useState("All");

  const fetchTasks = async (viewMode) => {
    try {
      const leaderId = sessionStorage.getItem("leaderId");
      if (!leaderId) throw new Error("Leader ID not found in session.");

      let res;
      if (viewMode === "admin") {
        res = await getAssignedTasksOfLeader(leaderId);
      } else {
        res = await getTasksAssignedByLeader(leaderId);
      }

      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTasks(mode);
  }, [mode]);

  const statuses = [...new Set(["Upcoming", "On Hold", ...tasks.map((t) => t.status)])];

  const filteredTasks = tasks.filter((t) => {
    return statusFilter === "All" || t.status === statusFilter;
  });

  const chartData =
    statusFilter === "All"
      ? statuses.map((s) => ({
          status: s,
          count: filteredTasks.filter((t) => t.status === s).length,
        }))
      : [
          {
            status: statusFilter,
            count: filteredTasks.length,
          },
        ];

  const today = new Date();
  const isWithinDays = (dateStr, days) => {
    const date = new Date(dateStr);
    const diff = (today - date) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= days;
  };

  const totalTasks = tasks.length;
  const todayTasks = tasks.filter((t) => isWithinDays(t.startDate, 0)).length;
  const last7Days = tasks.filter((t) => isWithinDays(t.startDate, 7)).length;
  const last30Days = tasks.filter((t) => isWithinDays(t.startDate, 30)).length;
  const last365Days = tasks.filter((t) => isWithinDays(t.startDate, 365)).length;

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setMode(newMode);
      setStatusFilter("All");
      setDateMonthFilter("All");
      setDateYearFilter("All");
    }
  };

  const filteredTasksForDateChart = tasks.filter((task) => {
    const date = new Date(task.startDate);
    const monthMatch =
      dateMonthFilter === "All" || date.getMonth() + 1 === parseInt(dateMonthFilter);
    const yearMatch =
      dateYearFilter === "All" || date.getFullYear() === parseInt(dateYearFilter);
    return monthMatch && yearMatch;
  });

  const groupedByDate = Object.entries(
    filteredTasksForDateChart.reduce((acc, task) => {
      const date = task.startDate;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, count }));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      p={2}
      ml="60px"
    >
      <Box mb={2} display="flex" justifyContent="center">
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="View mode"
          sx={{
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
            p: 0.5,
          }}
        >
          <ToggleButton
            value="admin"
            aria-label="Admin Assigned"
            sx={{
              width: 150,
              fontWeight: 600,
              borderRadius: 2,
              color: "primary.main",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            Admin
          </ToggleButton>
          <ToggleButton
            value="member"
            aria-label="Leader Assigned"
            sx={{
              width: 150,
              fontWeight: 600,
              borderRadius: 2,
              color: "primary.main",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            Leader
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={1} mb={2}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1} mb={2}>
            {[{ label: "Today", count: todayTasks, color: "#1976d2" },
              { label: "Last 7 Days", count: last7Days, color: "#388e3c" },
              { label: "Last 30 Days", count: last30Days, color: "#f9a825" },
              { label: "Last 365 Days", count: last365Days, color: "#6d4c41" },
              { label: "Total Tasks", count: totalTasks, color: "#5e35b1" },
            ].map(({ label, count, color }) => (
              <Paper
                key={label}
                elevation={2}
                sx={{
                  p: 1,
                  width: 100,
                  height: 60,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: color,
                  color: "#fff",
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption">{label}</Typography>
                <Typography variant="subtitle1" fontWeight={600}>
                  {count}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Paper elevation={3} sx={{ p: 2, mb: 2,ml:2 }}>
            <Typography variant="h6" gutterBottom>
              {mode === "admin"
                ? "Tasks Assigned by Admin"
                : "Tasks Assigned to Team Members"}
            </Typography>

            <FormControl sx={{ minWidth: 150, mr: 2 ,mb:2}}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{background:"lightgrey",fontSize:"bold"}}>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned {mode === "admin" ? "By" : "To"}</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.subject}</TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>{task.projectName}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                          {mode === "admin"
                            ? task.assignedBy?.name || "N/A"
                            : task.assignedTo?.name || "N/A"}
                        </TableCell>
                        <TableCell>{task.startDate}</TableCell>
                        <TableCell>{task.endDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Grid>

      <Box mb={2} display="flex" gap={2}>
        <FormControl sx={{ minWidth: 150,ml:90 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={dateMonthFilter}
            label="Month"
            onChange={(e) => setDateMonthFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={dateYearFilter}
            label="Year"
            onChange={(e) => setDateYearFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {[2021, 2022, 2023, 2024, 2025].map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Count by Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Tasks" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Count by Date
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupedByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Tasks" fill="#f57c00" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeaderDashboard;
