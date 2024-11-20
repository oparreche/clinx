import axios from "axios";

const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api",
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
}, (error) => {
    return Promise.reject(error);
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const clinicSlug = localStorage.getItem("clinicSlug");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Only redirect if we're not already on a login page
            const currentPath = window.location.pathname;
            if (!currentPath.endsWith('/login')) {
                if (clinicSlug) {
                    window.location.href = `/${clinicSlug}/login`;
                } else {
                    window.location.href = "/";
                }
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (email: string, password: string, clinicSlug: string) => {
    try {
        const response = await api.post("/auth/login", { 
            email, 
            password,
            clinic_slug: clinicSlug 
        });
        const { access_token: token, user } = response.data;
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("clinicSlug", clinicSlug);
        
        return { user, token };
    } catch (error) {
        throw error;
    }
};

export const register = async (userData: any) => {
    try {
        const response = await api.post("/auth/register", userData);
        const { token, user } = response.data;
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        return { user, token };
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    const clinicSlug = localStorage.getItem("clinicSlug");
    try {
        await api.post("/auth/logout");
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Always remove items and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (clinicSlug) {
            window.location.href = `/${clinicSlug}/login`;
        } else {
            window.location.href = "/";
        }
    }
};

export const getMe = async () => {
    try {
        const response = await api.get("/auth/profile");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const validateClinic = async (clinicSlug: string) => {
    try {
        const response = await api.get(`/clinics/validate/${clinicSlug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { api };
export default api;
