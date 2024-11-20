//api/patient.js
import apiClient from './apiClient';

export const getAllPatients = (token) => 
  apiClient.get('/patient', {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getPatient = (patientId, token) => 
  apiClient.get(`/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  export const createPatient = async (data, token) => {
    console.log("Data sent to API:", data);
    console.log("Token sent:", token);
    return apiClient.post('/patient/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  

export const updatePatient = (patientId, data, token) => 
  apiClient.put(`/patient/${patientId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deletePatient = (patientId, token) => 
  apiClient.delete(`/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
