const {Router}= require('express');
const { check } = require('express-validator');

const { validarDatos } = require('../middlewares/validarDatos');

const { registrar, autenticar, confirmar, olvidePassword, nuevoPassword, confirmarPassword, perfil } = require('../controllers/usuario');


const router= Router();
//Registrar Usuario
router.post('/new', [
    check('email', 'Correo invalido').isEmail(),
    check('password', 'La contraseña debe contener al menos 6 caracteres').isLength( {min:6} ),
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    check('rol', 'El Rol es obligatorio').not().isEmpty(),
    check('direccion', 'Direccion Obligatoria').not().isEmpty(),
    validarDatos
], registrar);
//Autenticar
router.post('/login',[
    check('password', 'Contraseña invalida').isLength( {min:6} ),
    check('email', 'El correo es obligatorio').isEmail(),
    validarDatos
], autenticar);
//Confirmar
router.get('/confirmar/:token',[], confirmar);

//Enviar token para restablecer password
router.post('/olvide-password',[
    check('email', 'Correo invalido').isEmail(),
    validarDatos
], olvidePassword);

//confirmar token y crear nuevo password
router.route('/olvide-password/:token')
    .post([
        check('password', 'Contraseña invalida').isLength( {min:6} ),
        validarDatos
        ],nuevoPassword)
    .get(confirmarPassword);

//router.get('/perfil',[checkAuth], perfil);

module.exports= router;