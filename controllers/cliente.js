const { request, response } = require("express");

const Cliente= require('../models/Cliente');

const nuevoCliente= async ( req= request, res= response )=>{
    //Evitar Registros duplicados
    const {email}= req.body;
    const clienteExist= await Cliente.findOne({email});
    if(clienteExist){
        const error= new Error("Cliente ya registrado");
        return res.status(400).json({msg: error.message});
    }
    try {   
        const cliente= new Cliente(req.body);

        const clienteAlmacenado= await cliente.save();
        res.json(clienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerCliente= async (req= request, res= response)=>{

    const {email}= req.body;
    const clienteExist= await Cliente.findOne({email});

    if(!clienteExist){
        const error= new Error("Cliente no encontrado");
        return res.status(400).json({msg: error.message});
    }
    res.json(clienteExist);
}

const eliminarCliente= async (req= request, res= response)=>{
    const {id}= req.params;

    const cliente= await Cliente.findById(id);
    if(!cliente){
        const error= new Error("Cliente No encontrado");
        return res.status(404).json({msg: error.message});
    }
    try {
        await cliente.deleteOne();
        res.json({msg: "Cliente Eliminado"});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    obtenerCliente,
    nuevoCliente,
    eliminarCliente
}