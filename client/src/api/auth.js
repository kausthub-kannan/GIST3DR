import apiClient from './apiClient';

export const signup = (data) => apiClient.post('/auth/signup', data);
export const signin = (data) => apiClient.post('/auth/signin', data);
export const signout = () => apiClient.post('/auth/signout');
export const refreshToken = () => apiClient.post('/auth/refresh-token');
