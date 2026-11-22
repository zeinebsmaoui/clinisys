import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const getAllModules = (employeeId) =>
  axios.get(`${BASE_URL}/modules`, { params: employeeId ? { employeeId } : {} });
export const createModule = (name, employeeId) =>
  axios.post(`${BASE_URL}/modules`, { name }, { params: employeeId ? { employeeId } : {} });
export const deleteModule = (id) => axios.delete(`${BASE_URL}/modules/${id}`);
export const renameModule = (id, name) => axios.put(`${BASE_URL}/modules/${id}`, { name });