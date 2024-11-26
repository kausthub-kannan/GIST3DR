//api/apiClient.js  
import axios from 'axios';

const apiClient = axios.create({
  // baseURL: process.env.BACKEND_API_URL,
  baseURL: 'https://kausthub-kannan--gist3dr-api-fastapi-app.modal.run',
  headers: { 'Content-Type': 'application/json' }
});

export default apiClient;
