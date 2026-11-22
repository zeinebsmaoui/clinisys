import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const getCapturesByMenuId = (menuId) => axios.get(`${BASE_URL}/captures/${menuId}`);

export const getAllCaptures = () => axios.get(`${BASE_URL}/captures`);

export const uploadCapture = (file, menuId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('menuId', menuId);
  return axios.post(`${BASE_URL}/captures`, formData);
};

export const deleteCapture = (id) => axios.delete(`${BASE_URL}/captures/${id}`);

export const reorderCaptures = (orderedIds) => axios.put(`${BASE_URL}/captures/reorder`, orderedIds);

export const updateCapture = (id, capture) => axios.put(`${BASE_URL}/captures/${id}`, capture);

export const generateVideo = (imageUrls, menuName) =>
  axios.post('http://localhost:5000/generate-video', { imageUrls, menuName }, { responseType: 'blob' });