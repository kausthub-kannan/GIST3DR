import apiClient from './apiClient';

export const getPatients = () => apiClient.get('/patient/');
export const getPatient = (patientId) => apiClient.get(`/patient/${patientId}`);
export const createPatient = (data) => apiClient.post('/patient/create', data);
export const updatePatient = (patientId, data) => apiClient.put(`/patient/${patientId}`, data);
export const deletePatient = (patientId) => apiClient.delete(`/patient/${patientId}`);
