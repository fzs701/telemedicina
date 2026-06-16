import axios, { InternalAxiosRequestConfig } from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, 
  (error: any) => {
    return Promise.reject(error);
  }
);

export const registrarUsuarioApi = async (datosUsuario: any) => {
  return await API.post('/registro', datosUsuario);
};

export const loginUsuarioApi = async (credenciales: any) => {
  try {
    const respuesta = await API.post('/login', credenciales);
    if (respuesta.data.token) {
      localStorage.setItem('token', respuesta.data.token);
    }
    return respuesta.data;
  } catch (error: any) {
    throw error.response?.data || { mensaje: 'Error de conexión con el servidor' };
  }
};

export const guardarSignosVitalesApi = async (datosClinicos: any) => {
  return await API.post('/signos-vitales', datosClinicos);
};

export default API;