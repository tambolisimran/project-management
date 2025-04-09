import { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, Grid, Box } from "@mui/material";
import Sidebar from "./Sidebar"; 
import AddTeamMember from "./AddTeamMember";
import Project from "./Project";

const Dashboard = () => {
    const [userRole, setUserRole] = useState("");
    const [showAddTeamMember, setShowAddTeamMember] = useState(false); 
    const [showAddProject, setShowAddProject] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        setUserRole(role);
    }, []);

    const getRoleBasedContent = () => {
        switch (userRole) {
            case "ADMIN":
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card 
                                sx={{ cursor: "pointer" }} 
                                onClick={() => setShowAddTeamMember(!showAddTeamMember)}
                            >
                                <CardContent>
                                    <Typography variant="h6">Manage Users</Typography>
                                    <Typography variant="body2">Add, edit, and remove users.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{ cursor: "pointer" }} 
                                onClick={() => setShowAddProject(!showAddProject)}
                             >
                                <CardContent>
                                    <Typography variant="h6">View Projects</Typography>
                                    <Typography variant="body2">Monitor all ongoing projects.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Assign Team Leaders</Typography>
                                    <Typography variant="body2">Manage team structures and leadership.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {showAddTeamMember && (
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <AddTeamMember />
                            </Grid>
                        )}

{showAddProject && (
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Project />  
                            </Grid>
                        )}
                    </Grid>
                );

            case "TEAM_LEADER":
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Assign Tasks</Typography>
                                    <Typography variant="body2">Distribute tasks among team members.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Monitor Team Progress</Typography>
                                    <Typography variant="body2">Track task completion and performance.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );

            case "TEAM_MEMBER":
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">View Assigned Tasks</Typography>
                                    <Typography variant="body2">Check your pending and completed tasks.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Update Task Status</Typography>
                                    <Typography variant="body2">Mark tasks as in-progress or completed.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );

            default:
                return <Typography color="error">Error: User role not found.</Typography>;
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            {userRole === "ADMIN" && <Sidebar />}

            <Container sx={{ mt: 4, flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Dashboard
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Your Role: <strong>{userRole || "Not Found"}</strong>
                </Typography>
                {getRoleBasedContent()}
            </Container>
        </Box>
    );
};

export default Dashboard;
