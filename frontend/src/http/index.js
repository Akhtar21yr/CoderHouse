import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500",
  withCredentials: true,
});

export const SEND_OTP_API = (data) => api.post("/api/send-otp", data);
export const VERIFY_OTP_API = (data) => api.post("/api/verify-otp", data);
export const ACTIVATE_API = (data) => api.post("/api/activate", data);
export const LOGOUT_API = () => api.get('/api/logout')
export const CREATE_ROOM_API = (data) => api.post('/api/rooms',data)
export const GET_ALL_ROOMS_API =  () => api.get('/api/rooms')








api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        await axios.get("http://localhost:5500/api/refresh", {
          withCredentials: true,
        });

        return api.request(originalRequest);
      } catch (err) {
        console.log(err.message);
      }
    }
    throw error;
  }
);
