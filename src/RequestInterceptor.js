import axios from "axios";

const createApi = (auth) => {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_HOST, 
  });

  api.interceptors.request.use(
    async (config) => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) { 
          const token = await currentUser.getIdToken(true); 
          config.headers.Authorization = `Bearer ${token}`;
          console.log("API HOST", process.env.REACT_APP_API_HOST)
        }
        
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json";
        return config;

      } catch (error) {
        console.error("Error getting token:", error);
        return Promise.reject(error);
      }
    },
    (error) => Promise.reject(error)
  );
  return api; 
};

export default createApi; 
