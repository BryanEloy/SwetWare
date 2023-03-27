//Middleware para verificar el jsonwebtoken en la peticion

const jwt= require('jsonwebtoken');
const { request, response } = require("express");

const Usuario= require('../models/Usuario');

const checkAuth= async (req= request, res= response, next)=>{
    let token;
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token= req.headers.authorization.split(" ")[1];
            const decoded= jwt.verify(token, process.env.JWT_SECRET);
            req.usuario= await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -__v");
            return next();
        } catch (error) {
            return res.status(404).json({msg: "Hubo un error"});
        }
    }
    if(!token){
        const error= new Error("Token no valido");
        return res.status(401).json({msg: error.message});
    }
    
    next();
}

module.exports= checkAuth;