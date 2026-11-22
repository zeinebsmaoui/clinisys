import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const login = (email, password) =>
  axios.post(`${BASE_URL}/auth/login`, { email, password });

export const getEmployees = () => axios.get(`${BASE_URL}/employees`);
export const createEmployee = (employee) => axios.post(`${BASE_URL}/employees`, employee);
export const updateEmployee = (id, employee) => axios.put(`${BASE_URL}/employees/${id}`, employee);
export const deleteEmployee = (id) => axios.delete(`${BASE_URL}/employees/${id}`);
