import  axios  from "axios"

export const AdminRegistration = (data) => {
    const token = localStorage.getItem("token");
    console.log(data);
    return axios.post("http://localhost:8080/auth/register",data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
}
export const Admin_Login = (data) => {
    return axios.post("http://localhost:8080/auth/login",data)
}

export const addDepartment = (data) => {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:8080/departments/create", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };

  export const GetAllDepartments = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get("http://localhost:8080/departments/getAll",  {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteDepartment = (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`http://localhost:8080/departments/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };

export const getDepartmentById = (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`http://localhost:8080/departments/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}


  export const addRole = (data) => {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:8080/roles/create", data,  {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };

  export const getAllRoles = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get("http://localhost:8080/roles/getAll", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

  export const deleteRole = (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`http://localhost:8080/roles/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };
  
export const getRoleById = (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`http://localhost:8080/roles/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}

export const addBranch = (data) => {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:8080/branches/create", data,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };

export const getAllBranches = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get("http://localhost:8080/branches/getAll",{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteBranch = (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`http://localhost:8080/branches/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };

export const getBranchById = (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`http://localhost:8080/branches/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}


export const addTeam = (data) => {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:8080/teams/create", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };

  export const GetAllTeams = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get("http://localhost:8080/teams/getAllTeams", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteTeam = (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`http://localhost:8080/teams/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };

export const getTeamById = (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`http://localhost:8080/teams/${id}`,  {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}

export const updateTeam = async (id, teamData) => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.put(
        `http://localhost:8080/teams/${id}`,
        teamData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating team:", error.response?.data || error);
      throw error;
    }
  };



  export const addTeamMember = (data) => {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:8080/team-members/createTeamMember", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };


export const getAllMembers = async () => {
    const token = localStorage.getItem("token");
    console.log("Retrieved Token:", token);
    try {
        const response = await axios.get("http://localhost:8080/team-members/getAllTeamMember", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

 export const deleteTeamMember = (id) =>{
    const token = localStorage.getItem("token");
    return axios.delete(`http://localhost:8080/team-members/deleteTeamMember/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
 }

export const getMemberById = (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`http://localhost:8080/team-members/getByIdTeamMember/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });  
}

export const updateMember = (id,member) => {
    const token = localStorage.getItem("token");
    return axios.get(`http://localhost:8080/team-members/updateTeamMember/${id}`,member, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });  
}

export const MakeLeader = (id) => {
    const token = localStorage.getItem("token");
    return axios.put(`http://localhost:8080/team-members/make-leader/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });  
}


export const addProject = (data) => {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:8080/Project/addProject", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
  };

  
  export const getAllProjects = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get("http://localhost:8080/Project/getAllProjects", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteProjects = (id) =>{
    const token = localStorage.getItem("token");
    return axios.delete(`http://localhost:8080/Project/deleteProject/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
 }

 export const addTask = async (data) => {
    const token = localStorage.getItem("token");
    console.log(token)
    try {
        return await axios.post("http://localhost:8080/tasks/create", data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error(error)
    }
    
  };

  export const deleteTask = (taskId) =>{
    const token = localStorage.getItem("token");
    return axios.delete(`http://localhost:8080/tasks/${taskId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
 }


 
 export const getAllTask = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get("http://localhost:8080/tasks/getAllTasks", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

//   ****************** common login for all ***********************
export const registerUser = async ({ name, email, password, phone, role }) => {
    try {
        const response = await axios.post("http://localhost:8080/auth/register", {
            name,
            email,
            password,
            phone,
            role: role.toUpperCase().replace(" ", "_"), 
        });
    }
       catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post("http://localhost:8080/auth/login", {
            email,
            password,
        });

        if (response.data) {
            localStorage.setItem("token", response.data.jwtToken); // Store token
            localStorage.setItem("userRole", response.data.role); // Store role
            return response.data; // Return full response data (token & role)
        }
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
}
