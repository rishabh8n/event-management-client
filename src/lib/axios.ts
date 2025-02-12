import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL + "/api" || "http://localhost:8000" + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 7000,
  withCredentials: true,
});

instance.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        const response = await instance.post("/auth/refresh-tokens");
        if (response.status === 200) {
          return instance.request(error.config);
        }
      } catch (error) {
        console.log(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
