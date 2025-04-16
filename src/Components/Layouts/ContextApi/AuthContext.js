import { createContext, useContext, useState } from "react";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);


    const loginUser = (newToken) => {
        setToken(newToken);
        sessionStorage.setItem("jwtToken", newToken);
    };

    const logout = () => {
        setToken(null);
        sessionStorage.removeItem("jwtToken");
    };

    return (
        <AuthContext.Provider value={{ token, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
