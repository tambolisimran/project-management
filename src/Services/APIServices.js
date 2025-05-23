import  axios  from "axios"

// export const AdminRegistration = (data) => {
//     console.log(data);
//     return axios.post("http://localhost:8080/auth/register",data, {
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })
// }

// export const Admin_Login = (data) => {
//     return axios.post("http://localhost:8080/auth/login",data)
// }

// const token = sessionStorage.getItem("token");
// const API = axios.create({
//     baseURL: "http://localhost:8080/",
//     headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//     },
// });


//   ****************** common login for all ***********************
export const registerUser = async ({ name, email, password, phone}) => {
    try {
        const response = await axios.post("http://localhost:8080/auth/register", {
            name,
            email,
            password,
            phone,
        });
        return response.data;
    }
       catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (email, password,role) => {
  try {
      const res = await axios.post("http://localhost:8080/auth/login", {
          email,
          password,
          role,
      });
      sessionStorage.setItem("token", res.data.jwtToken);
      return res; 
  } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
  }
}

const API = axios.create({
  // baseURL: "https://pjsofttech.in:44443", 
   baseURL: "http://localhost:8080"
});


API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  console.log("Token from sessionStorage:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("Token is missing. Please authenticate again.");
  }
  return config;
});


export const addDepartment = (data) => {
    return API.post("/departments/create", data)
  };

  export const GetAllDepartments = async () => {
    try {
        const response = await API.get("/departments/getAll");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteDepartment = (id) => {
    return API.delete(`/departments/${id}`);
  };

export const getDepartmentById = (id) => {
    return API.get(`/departments/getDepartmentById/${id}`);
}


  export const addRole = (data) => {
    return API.post("/roles/create", data);
  };

  export const getAllRoles = async () => {
    try {
        const response = await API.get("/roles/getAll");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

  export const deleteRole = (id) => {
    return API.delete(`/roles/${id}`);
  };
  
export const getRoleById = (id) => {
    return API.get(`/roles/${id}`);
}

export const addBranch = (data) => {
    return API.post("/branches/create", data);
  };

export const getAllBranches = async () => {
    try {
        const response = await API.get("/branches/getAll");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteBranch = (id) => {
    return API.delete(`/branches/${id}`);
  };

export const getBranchById = (id) => {
    return API.get(`/branches/${id}`);
}


export const addTeam = (data) => {
    return API.post("/teams/create", data);
  };

  export const GetAllTeams = async () => {
    try {
        const response = await API.get("/teams/getAllTeams");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteTeam = (id) => {
    return API.delete(`/teams/${id}`);
  };

export const getTeamById = (id) => {
    return API.get(`/teams/${id}`);
}

export const updateTeam = async (id, teamData) => {
    try {
      const response = await API.put(`/teams/${id}`,teamData);
      console.log("API response:", response);
      return response;
    } catch (error) {
      console.error("Error updating team:", error.response?.data || error);
      throw error;
    }
  };

  export const addTeamMember = async (data) => {
    try {
      const response = await API.post("/team-members/create", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }); 
      console.log("API Response:", response.data);
      return response;
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error);
      throw error;
    }
  };

export const getAllMembers = async () => {
    console.log("Retrieved Token:");
    try {
        const response = await API.get("/team-members/members");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

 export const deleteTeamMember = (id) =>{
    return API.delete(`/team-members/delete/${id}`);
 }

export const getMemberById = (id) => {
    return API.get(`/team-members/${id}`);  
}

export const updateTeamMember = (id,member) => {
    return API.put(`/team-members/update/${id}`,member);  
}

export const MakeLeader = (id) => {
    return API.put(`/team-members/promote/${id}`);  
}

export const addProject = (data) => {
    const response =  API.post("/Project/addProject", data);
    console.log("API Response:", response.data);
    return response;
  };

  
  export const getAllProjects = async () => {
    try {
        const response = await API.get("/Project/getAllProjects");
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

  export const deleteProjects = (id) =>{
    return API.delete(`/Project/deleteProject/${id}`);
 }

 export const updateProject = async (id,project) =>{
  try{
      return await API.put(`Project/updateProject/${id}`, project );
  } catch (error) {
      console.error(error)
  }
}

export const assignProjectToTeam = (projectId, teamId) => {
  return API.put(`/Project/assignProjectToTeam/${projectId}/assign/${teamId}`);
};
export const getProjectByName = (name) => {
  return API.get(`/Project/getProjectByName/${name}`);
};

 export const AddTaskToMember = async (taskData, id) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await API.post(`tasks/create/${id}`, taskData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
    console.error("Error creating task:", error);
    throw error;
  }
};

export const AddTaskToLeader = async (taskData, id) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await API.post(`tasks/create/Leader/${id}`, taskData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
    console.error("Error creating task:", error);
    throw error;
  }
};


export const LeaderAssignTaskToMember = async (formData, leaderId,memberId) => {
  const token = sessionStorage.getItem("token");

  // console.log(formData);
  // const formData = new FormData()
  // formData.append("task", taskData)
  
  try {
    const response = await API.post(`tasks/leader/${leaderId}/assign-to-member/${memberId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
    console.error("Error creating task:", error);
    throw error;
  }
};

export const getTasksAssignedByLeader = (id) => {
  return API.get(`/tasks/assigned-by/leader/${id}`);
};

  export const deleteTask = (id) =>{
    return API.delete(`/tasks/${id}`);
 }
 
 export const updateTask = async (id,task) =>{
    try{
        return await API.put(`/tasks/${id}`, task);
    } catch (error) {
        console.error(error)
    }
  }
 
 export const getAllTask = async () => {
    try {
        const response = await API.get("/tasks/all");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const getAssignedTasksOfMember = async (id) => {
  try {
    const response = await API.get(`/tasks/assigned-to/member/${id}`);
    return response; 
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    throw error; 
  }
};

export const getAssignedTasksOfLeader = async (id) => {
  try {
    const response = await API.get(`/tasks/assigned-to/leader/${id}`);
    return response; 
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    throw error; 
  }
};

export const getTasksByMemberEmail = async (email) => {
  const response = await API.get(`task/tasks/member/email/${(email)}`);
  console.log(response.data);
  return response.data; 
}

export const getTodaysLeaderTasks = async (email) => {
  try {
    const response = await API.get(`/tasks/leader/today/${email}`);
    console.log("Today's tasks response:", response.data);
    console.log("Leader Email:", email);
    return response.data;
  } catch (error) {
    console.error("Error fetching today's leader tasks:", error);
    throw error;
  }
};


export const addLeader = async (leaderData) => {
  return await API.post('/team-leader/create',leaderData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
export const getAllTeamLeaders = async () => {
  return await API.get(`/team-leader/all`);
};

export const getTeamLeaderById = async (id) => {
  return await API.get(`/team-leader/${id}`);
};

export const getTeamLeaderByEmail = (email) => {
  return API.get(`/team-leader/email?email=${email}`);
};

export const updateTeamLeader = async (id, data) => {
  return await API.put(`/team-leader/update/${id}`, data);
};

export const deleteTeamLeader = async (id) => {
  return await API.delete(`/team-leader/delete/${id}`);
};

export const getAllAdmins = async () => {
  try {
    const response = await API.get(`/admin/getAll`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};


export const forgotPassword = ({ email, role }) => {
    return API.post(`/forgetPassword/passwordRecovery`, null, {
      params: {
        email,
        role,
      },
    });
  };
  
  export const verifyOtp = ({ email, role, otp }) => {
    return API.post(`/forgetPassword/passwordRecovery`, null, {
      params: {
        email,
        role,
        otp,
      },
    });
  };

  export const resetPassword = ({ email, role, newPassword, confirmPassword }) =>{
    return API.post(`/forgetPassword/passwordRecovery`, null, {
      params: {
        email,
        role,
        newPassword,
        confirmPassword,
      },
    });
  };
  