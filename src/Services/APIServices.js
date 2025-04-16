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

export const loginUser = async (email, password,role) => {
    try {
        return await axios.post("http://localhost:8080/auth/login", {
            email,
            password,
            role,
        });
       
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
}

const API = axios.create({
  baseURL: "http://localhost:8080", 
});


API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  console.log(sessionStorage.getItem("token"));
  console.log("Token in interceptor:", token); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
    return API.get(`/departments/${id}`);
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
      const response = await API.put(
        `/teams/${id}`,teamData);
      return response.data;
    } catch (error) {
      console.error("Error updating team:", error.response?.data || error);
      throw error;
    }
  };

  export const addTeamMember = (data) => {
    return API.post("/team-members/createTeamMember", data);
  };


export const getAllMembers = async () => {
    console.log("Retrieved Token:");
    try {
        const response = await API.get("/team-members/getAllTeamMember");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

 export const deleteTeamMember = (id) =>{
    return API.delete(`/team-members/deleteTeamMember/${id}`);
 }

export const getMemberById = (id) => {
    return API.get(`/team-members/getByIdTeamMember/${id}`);  
}

export const updateMember = (id,member) => {
    return API.put(`/team-members/updateTeamMember/${id}`,member);  
}

export const MakeLeader = (id) => {
    return API.put(`/team-members/make-leader/${id}`);  
}


export const addProject = (data) => {
    return API.post("/Project/addProject", data);
  };

  
  export const getAllProjects = async () => {
    try {
        const response = await API.get("/Project/getAllProjects");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
};

export const deleteProjects = (id) =>{
    return API.delete(`/Project/deleteProject/${id}`);
 }

 export const addTask = async (task) => {
        return await API.post("/task/create", task);
  };

  export const deleteTask = (taskId) =>{
    return API.delete(`/task/${taskId}`);
 }
 
 export const updateTask = async (taskId,task) =>{
    try{
        return await API.put(`/task/${taskId}`, task );
    } catch (error) {
        console.error(error)
    }
    }
 
 export const getAllTask = async () => {
    try {
        const response = await API.get("/task/all");
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error);
        throw error;
    }
}; 


export const forgotPassword = ({ email, role }) => {
    return axios.post(`http://localhost:8080/forgetPassword/passwordRecovery`, null, {
      params: {
        email,
        role,
      },
    });
  };
  
  export const verifyOtp = ({ email, role, otp }) => {
    return axios.post(`http://localhost:8080/forgetPassword/passwordRecovery`, null, {
      params: {
        email,
        role,
        otp,
      },
    });
  };

  export const resetPassword = ({ email, role, newPassword, confirmPassword }) =>{
    return axios.post(`http://localhost:8080/forgetPassword/passwordRecovery`, null, {
      params: {
        email,
        role,
        newPassword,
        confirmPassword,
      },
    });
  };
  