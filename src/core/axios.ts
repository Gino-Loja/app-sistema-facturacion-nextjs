import axios, { AxiosResponse } from 'axios';

// Crear instancia de Axios con configuración predeterminada
export const Axios = axios.create({
  baseURL: 'https://gary-api-node.jaapmariscalsucre.site',
  headers: {
    'Content-Type': 'application/json',
  },
});

