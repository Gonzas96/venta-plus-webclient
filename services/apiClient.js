const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:52301/api/productos';

const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
});

/**
 * Unico modulo que habla con la API REST de Productos.
 * Ninguna otra parte de la aplicacion hace peticiones HTTP directamente
 * ni accede a base de datos.
 */
const apiClient = {
    async getAll() {
        const { data } = await http.get('/');
        return data;
    },

    async getById(id) {
        const { data } = await http.get(`/${id}`);
        return data;
    },

    async create(producto) {
        const { data } = await http.post('/', producto);
        return data;
    },

    async update(id, producto) {
        const { data } = await http.put(`/${id}`, producto);
        return data;
    },

    async remove(id) {
        const { data } = await http.delete(`/${id}`);
        return data;
    }
};

module.exports = apiClient;
