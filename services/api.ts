import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Add token to request if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        const { access_token, user } = response.data;
        
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        
        return { token: access_token, user };
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
};

export const getMe = async () => {
    try {
        const response = await api.get("/auth/profile");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
