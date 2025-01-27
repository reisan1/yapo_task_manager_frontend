import axios from 'axios';

/*const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});*/

const axiosInstance = axios.create({
  baseURL: 'https://yapo-task-manager-backend.vercel.app',
});

export default axiosInstance;