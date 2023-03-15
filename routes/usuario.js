const {Router}= require('express');

const { registrar } = require('../routes/usuario');

const router= Router();

router.post('/new', [], registrar);

module.exports= router;