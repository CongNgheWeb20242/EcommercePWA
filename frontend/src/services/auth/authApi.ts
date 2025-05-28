import axios from 'axios';

const BASE_URL = "http://localhost:3000/api/";

const authApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000
});

export default authApiClient;
