import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Container } from "@mui/material";
import axios from "axios";  
import { useNavigate } from "react-router-dom";

const LeaderDashboard = () => {
   const navigate = useNavigate();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get the JWT token from sessionStorage
        const token = sessionStorage.getItem("jwtToken");

        // Set the authorization header with the token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch assigned tasks for the leader
        const tasksResponse = await axios.get("/api/leader/assigned-tasks", { headers });
        setAssignedTasks(tasksResponse.data);

        // Fetch the projects for the leader
        const projectsResponse = await axios.get("/api/leader/projects", { headers });
        setMyProjects(projectsResponse.data);

        setLoading(false);  // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);  // Stop loading in case of error
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Team Leader Dashboard
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Assigned Tasks Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Assigned Tasks</Typography>
              <ul>
                {assignedTasks.map((task) => (
                  <li key={task.id}>
                    <Typography>{task.name}</Typography>
                  </li>
                ))}
              </ul>
              <Button variant="contained" color="primary" fullWidth>
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Projects Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">My Projects</Typography>
              <ul>
                {myProjects.map((project) => (
                  <li key={project.id}>
                    <Typography>{project.name}</Typography>
                  </li>
                ))}
              </ul>
              <Button variant="contained" color="primary" fullWidth>
                View All Projects
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Container>
      </>
  );
};

export default LeaderDashboard;
