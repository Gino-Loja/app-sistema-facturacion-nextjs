import axios, { AxiosResponse } from 'axios';

// Crear instancia de Axios con configuración predeterminada
export const Axios = axios.create({
  baseURL: 'http://localhost:3030/', // Reemplaza con la URL base de tu API
  timeout: 5000, // Tiempo de espera para las solicitudes
  headers: {
    'Content-Type': 'application/json',
  },
});

