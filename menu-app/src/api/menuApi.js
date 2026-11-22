import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const getAllMenus = () => axios.get(`${BASE_URL}/menus`);
export const getMenusByModuleId = (moduleId) => axios.get(`${BASE_URL}/menus/module/${moduleId}`);
export const createMenu = (menu) => axios.post(`${BASE_URL}/menus`, menu);
export const updateMenu = (id, menu) => axios.put(`${BASE_URL}/menus/${id}`, menu);
export const deleteMenu = (id) => axios.delete(`${BASE_URL}/menus/${id}`);
export const saveMenuVideo = (id, videoData) => axios.put(`${BASE_URL}/menus/${id}/video`, { videoData });