const express = require('express');
const router = express.Router();
const apiClient = require('../services/apiClient');

// GET /productos - listado
router.get('/', async (req, res) => {
    try {
        const productos = await apiClient.getAll();
        res.render('index', { productos, mensaje: req.query.msg || null, error: null });
    } catch (err) {
        res.render('index', {
            productos: [],
            mensaje: null,
            error: 'No se pudo conectar con la API REST. Verifica que VentaPlus.WebApi este corriendo y que API_BASE_URL en .env sea correcta.'
        });
    }
});

// GET /productos/nuevo - formulario de creacion
router.get('/nuevo', (req, res) => {
    res.render('create', { errores: [], valores: {} });
});

// POST /productos - crear
router.post('/', async (req, res) => {
    const producto = {
        nombre: (req.body.nombre || '').trim(),
        descripcion: (req.body.descripcion || '').trim(),
        precio: parseFloat(req.body.precio) || 0,
        stock: parseInt(req.body.stock, 10) || 0,
        categoria: (req.body.categoria || '').trim(),
        activo: req.body.activo === 'on'
    };

    const errores = [];
    if (!producto.nombre) errores.push('El nombre es obligatorio.');
    if (producto.precio <= 0) errores.push('El precio debe ser mayor a 0.');

    if (errores.length > 0) {
        return res.render('create', { errores, valores: req.body });
    }

    try {
        await apiClient.create(producto);
        res.redirect('/productos?msg=' + encodeURIComponent('Producto registrado correctamente.'));
    } catch (err) {
        res.render('create', {
            errores: ['La API respondio con un error: ' + (err.response ? err.response.status : err.message)],
            valores: req.body
        });
    }
});

// GET /productos/:id/editar - formulario de edicion
router.get('/:id/editar', async (req, res) => {
    try {
        const producto = await apiClient.getById(req.params.id);
        res.render('edit', { producto, errores: [] });
    } catch (err) {
        res.redirect('/productos?msg=' + encodeURIComponent('El producto no existe.'));
    }
});

// PUT /productos/:id - actualizar
router.put('/:id', async (req, res) => {
    const producto = {
        idProducto: parseInt(req.params.id, 10),
        nombre: (req.body.nombre || '').trim(),
        descripcion: (req.body.descripcion || '').trim(),
        precio: parseFloat(req.body.precio) || 0,
        stock: parseInt(req.body.stock, 10) || 0,
        categoria: (req.body.categoria || '').trim(),
        activo: req.body.activo === 'on'
    };

    const errores = [];
    if (!producto.nombre) errores.push('El nombre es obligatorio.');
    if (producto.precio <= 0) errores.push('El precio debe ser mayor a 0.');

    if (errores.length > 0) {
        return res.render('edit', { producto, errores });
    }

    try {
        await apiClient.update(req.params.id, producto);
        res.redirect('/productos?msg=' + encodeURIComponent('Producto actualizado correctamente.'));
    } catch (err) {
        res.render('edit', {
            producto,
            errores: ['La API respondio con un error: ' + (err.response ? err.response.status : err.message)]
        });
    }
});

// DELETE /productos/:id - eliminar
router.delete('/:id', async (req, res) => {
    try {
        await apiClient.remove(req.params.id);
        res.redirect('/productos?msg=' + encodeURIComponent('Producto eliminado correctamente.'));
    } catch (err) {
        res.redirect('/productos?msg=' + encodeURIComponent('No se pudo eliminar el producto.'));
    }
});

module.exports = router;
