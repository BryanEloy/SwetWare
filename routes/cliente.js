const {Router}= require('express');
const { check } = require('express-validator');

const {obtenerCliente, nuevoCliente, eliminarCliente}= require('../controllers/cliente');
const checkAuth = require('../middlewares/checkAuth');
const validarDatos = require('../middlewares/validarDatos');

const router= Router();

router.post('/nuevoCliente', [
    checkAuth,
    check('email', 'Email invalido').isEmail(),
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    validarDatos
], nuevoCliente );

router.get('/obtenerCliente', [
    checkAuth,
    check('email', 'Email invalido').isEmail(),
    validarDatos
], obtenerCliente );

router.delete('/eliminarCliente/:id', [
    checkAuth,
    check('id', 'No es un ID Valido').isMongoId(),
    validarDatos
], eliminarCliente)

module.exports= router;