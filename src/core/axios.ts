import axios, { AxiosResponse } from 'axios';

// Crear instancia de Axios con configuración predeterminada
export const Axios = axios.create({
  baseURL: 'https://localhost:3030/', // Reemplaza con la URL base de tu API
  headers: {
    'Content-Type': 'application/json',
  },
});

