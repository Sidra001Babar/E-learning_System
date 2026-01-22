import axios from "axios";

// const api = axios.create({ baseURL: "https://elearning-production-1595.up.railway.app" });
const api = axios.create({ baseURL: "http://127.0.0.1:5000" });

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export default api;
