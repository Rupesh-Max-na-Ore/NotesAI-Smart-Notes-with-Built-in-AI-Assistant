import axios from "axios";

// Use env variable (works in both dev + production)
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || "https://notesai-smart-notes-with-built-in-ai.onrender.com" || "http://localhost:5000"}/api`,
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle expired token
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default API;