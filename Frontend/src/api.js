import axios from 'axios';

// 1. Read the base URL from the environment variables.
const API_URL = import.meta.env.VITE_API_URL;

// 2. Create a new axios instance with only the baseURL configured.
const apiClient = axios.create({
  baseURL: API_URL
});

// 3. Export the simplified client. The token interceptor is removed.
export default apiClient;