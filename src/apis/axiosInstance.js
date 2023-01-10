import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url !== "/auth/login") {
      const accessToken = localStorage.getItem("accessToken");
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
