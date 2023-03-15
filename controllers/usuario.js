const { request, response } = require("express");

const Usuario= require('../models/Usuario');
const {emailRegistro}= require('../helpers/email');

const registrar= async(req= request, res= response)=>{

     //Evitar Registros duplicados
     const {email}= req.body;
     const usuarioExist= await Usuario.findOne({email});
     if(usuarioExist){
         const error= new Error("Usuario ya registrado");
         return res.status(400).json({msg: error.message});
     }
     try {
        const usuario= new Usuario(req.body);
        usuario.token= generarID();
        await usuario.save();

        //Enviar Email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });

        res.json({msg: 'Usuario creado correctamente, confirma tu cuenta via Email'});
   } catch (error) {
        console.log(error);
   } 
}

module.exports = {
    registrar
}