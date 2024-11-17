import apiClient from './apiClient';

export const getPatients = (token) => 
  apiClient.get('/patient/', {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getPatient = (patientId, token) => 
  apiClient.get(`/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createPatient = (data, token) => 
  apiClient.post('/patient/create', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updatePatient = (patientId, data, token) => 
  apiClient.put(`/patient/${patientId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deletePatient = (patientId, token) => 
  apiClient.delete(`/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
