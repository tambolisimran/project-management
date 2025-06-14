import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { getTodaysLeaderTasks } from "../Services/APIServices";

const GetAssignedTask = () => {
  const [leaderEmail, setLeaderEmail] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; 

    const checkSession = setInterval(() => {
      const stored = sessionStorage.getItem("TEAM_LEADER"); 
      console.log("Stored Leader Email:", stored);
      if (stored) {
      const parsed = JSON.parse(stored);
      const email = parsed.username; 
      console.log("Parsed leader email:", email);
      if (email) {
        setLeaderEmail(email);
        clearInterval(checkSession);
      }
    }
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(checkSession);
        setLoading(false);
      }
    }, 100);

    return () => clearInterval(checkSession);
  }, []);

  useEffect(() => {
    if (!leaderEmail) return;

    const fetchTasks = async () => {
      setLoading(true);
      setError(""); 
      try {
        const tasks = await getTodaysLeaderTasks(leaderEmail);

        console.log("Fetched today's tasks:", tasks);
        setTasks(tasks || []);
      } catch (error) {
        console.error("Error fetching today's tasks:", error);
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [leaderEmail]);

  return (
    <Container component={Paper} sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Hello, {leaderEmail || "Team Leader"}!
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tasks Assigned to You for Today
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{background:"lightgrey",fontSize:"bold"}}>
                <TableCell><b>Task ID</b></TableCell>
                <TableCell><b>Task Name</b></TableCell>
                <TableCell><b>Subject</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Status Bar</b></TableCell>
                <TableCell><b>Start Date</b></TableCell>
                <TableCell><b>End Date</b></TableCell>
                <TableCell><b>Days</b></TableCell>
                <TableCell><b>Image</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.subject}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.statusBar}</TableCell>
                    <TableCell>{task.startDate}</TableCell>
                    <TableCell>{task.endDate}</TableCell>
                    <TableCell>{task.days}</TableCell>
                    <TableCell>
                      {task.imageUrl ? (
                        <img src={task.imageUrl} alt="task" width="50" />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No tasks assigned for today.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default GetAssignedTask;
