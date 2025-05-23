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
  Tooltip,
} from "@mui/material";
import { getAssignedTasksOfLeader } from "../Services/APIServices";
import { AssignmentInd, CalendarToday } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { SITE_URI } from "../Services/Config";

const GetAllTask = () => {
  const navigate = useNavigate();
  const [leaderEmail, setLeaderEmail] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const stored = sessionStorage.getItem("TEAM_LEADER");
  const parsed = JSON.parse(stored);
  const leaderId = parsed?.id;
  console.log(leaderId);


useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const stored = sessionStorage.getItem("TEAM_LEADER");
      console.log("Stored TEAM_LEADER:", stored);
      if (!stored) {
        setError("No team leader found in session.");
        return;
      }

      const parsed = JSON.parse(stored);
      const leaderId = parsed?.id;
      const leaderEmail = parsed?.username;

      if (!leaderEmail) {
        setError("Leader ID is missing.");
        return;
      }

      setLeaderEmail(leaderEmail);
      console.log(leaderId);

      const response = await getAssignedTasksOfLeader(leaderId);
      console.log("Tasks fetched:", response.data);
      setTasks(response.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  return (
    <Container component={Paper} sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Hello, {leaderEmail || "Team Leader"}!
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tasks Assigned to You 
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead sx={{background:"lightgrey",fontSize:"bold"}}>
              <TableRow>
                <TableCell><b>Task ID</b></TableCell>
                <TableCell><b>Subject</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Status Bar</b></TableCell>
                <TableCell><b>Start Date</b></TableCell>
                <TableCell><b>End Date</b></TableCell>
                <TableCell><b>Days</b></TableCell>
                <TableCell><b>Image</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
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
                    <TableCell>
                    <Tooltip title="show today's task">
                      <AssignmentInd color="success" sx={{ cursor: 'pointer', ml: 1 }} onClick={() => navigate(`${SITE_URI}/leader-tasks`)}  />
                    </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No tasks assigned.
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

export default GetAllTask;
