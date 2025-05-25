import axios from 'axios';

const BASE_URL = "https://ecommercepwa-be.onrender.com/api/";

const authApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

export default authApiClient;
