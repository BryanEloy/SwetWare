const { validationResult } = require("express-validator");

const validarDatos= (req, res, next)=>{
    //Validar datos
    const errors= validationResult(req);
    if( !errors.isEmpty() ) return res.status(400).json(errors);

    next();
}

module.exports={
    validarDatos
}