const {Router}= require('express');
const { check } = require('express-validator');

const { validarDatos } = require('../middlewares/validarDatos');
const checkAuth = require('../middlewares/checkAuth');

const {nuevaVenta, obtenerVentas, eliminarVenta}= require('../controllers/venta');

const router= Router();

router.post('/nuevaVenta', [
    checkAuth, 
    check('total', 'Se requiere el total de la venta').isEmail(),
    validarDatos
], nuevaVenta );

router.get('/obtenerVentas', [
    checkAuth,
    check('clienteId', 'No es un ID de usuario Valido').isMongoId(), 
    validarDatos
], obtenerVentas );

router.delete('/eliminarVenta/:id', [
    checkAuth,
    check('id', 'No es un ID de usuario Valido').isMongoId(), 
    validarDatos
], eliminarVenta)

module.exports= router;