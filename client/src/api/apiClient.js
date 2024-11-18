//api/apiClient.js  
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://kausthub-kannan--gist3dr-api-fastapi-app.modal.run',
  headers: { 'Content-Type': 'application/json' }
});

export default apiClient;
