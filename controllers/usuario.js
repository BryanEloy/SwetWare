const { request, response } = require("express");

const Usuario= require('../models/Usuario');
const generarJWT= require('../helpers/generarJWT');
const generarID= require('../helpers/generarID');
const {emailRegistro, emailOlvidePassword}= require('../helpers/email');

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

const autenticar= async(req= request, res= response)=>{

    const {email, password}= req.body;
    //Comprobar si el usuario existe
    const usuario= await Usuario.findOne({email});
    if(!usuario){
        const error= new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }
    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error= new Error("Tu cuenta no esta confirmada");
        return res.status(403).json({msg: error.message});
    }
    //Comprobar el password
    if( await usuario.comprobarPassword(password) ){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });
    }else{
        const error= new Error("Contraseña incorrecta");
        return res.status(403).json({msg: error.message});
    }
}

const confirmar= async(req= request, res= response)=>{

    const {token}= req.params;
    const usuarioConfirmar= await Usuario.findOne({token});
    if(!usuarioConfirmar){
        const error= new Error("Token Invalido");
        return res.status(403).json({msg: error.message});
    }
    try {
       usuarioConfirmar.confirmado= true;
       usuarioConfirmar.token="";
       await usuarioConfirmar.save();
       res.json({msg: "Usuario confirmado con exito"}); 
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword= async(req= request, res= response)=>{

    const {email}= req.body;
    //Comprobar si el usuario existe
    const usuario= await Usuario.findOne({email});
    if(!usuario){
        const error= new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }
    //Generarmos un nuevo token para validar el usuario 
    try {
        usuario.token= generarID();
        usuario.save();
        //Enviar Email para restablecer
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });
        res.json({ msg: "Hemos enviado un email para restablecer tu contraseña"})
    } catch (error) {
        console.log(error);
    }
}

const confirmarPassword= async(req= request, res= response)=>{
    const {token}= req.params;
    const tokenValido= await Usuario.findOne({token});

    if(tokenValido){
        res.json({ msg: 'Token valido y el usuario existe'})
    }else{
        const error= new Error("Token Invalido");
        return res.status(404).json({msg: error.message});
    }
}

const nuevoPassword= async(req= request, res= response)=>{
    const {token}= req.params;
    const {password}= req.body;

    const usuario= await Usuario.findOne({token});
    if(usuario){
        usuario.password= password;
        usuario.token= '';
        try {
            await usuario.save();
            return res.json({msg: "Password modificado con exito"});   
        } catch (error) {
            console.log(error);
        }
        
    }else{
        const error= new Error("Token no valido");
        return res.status(404).json({msg: error.message});
    }
}

module.exports = {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    confirmarPassword,
    nuevoPassword
}