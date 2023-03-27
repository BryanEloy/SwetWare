const {Router}= require('express');
const { check } = require('express-validator');

const checkAuth = require('../middlewares/checkAuth');
const validarDatos = require('../middlewares/validarDatos');

const {obtenerProductos, eliminarProducto, agregarProducto, editarProducto}= require('../controllers/producto');

const router= Router();

router.get('/obtenerProductos', [
    checkAuth,
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    validarDatos
], obtenerProductos);

router.delete('/eliminarProducto/:id', [
    checkAuth,
    check('id', 'No es un ID Valido').isMongoId(),
    validarDatos
], eliminarProducto);

router.post('/agregarProducto', [
    checkAuth,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    validarDatos
], agregarProducto);

router.put('/editarProducto/:id', [
    checkAuth,
    check('id', 'No es un ID Valido').isMongoId(),
    validarDatos
], editarProducto);

module.exports= router;