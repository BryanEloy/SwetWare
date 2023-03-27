const { request, response } = require("express");

const Venta= require('../models/Venta');
const Cliente= require('../models/Cliente');

const nuevaVenta= async ( req= request, res= response )=>{
    const {body}= req;
    //Obtener cliente
    const cliente= await Cliente.findOne({email: body.cliente});
    if(!cliente){
        const error= new Error("Cliente no encontrado");
        return res.status(404).json({msg: error.message});
    }
    const venta= new Venta(req.body);
    venta.empleado= req.usuario._id;
    venta.cliente= cliente._id;

    try {
        const ventaAlmacenada= await venta.save();
        res.json(ventaAlmacenada);
    } catch (error) {
        console.log(error);
    }
};

const obtenerVentas= async (req= request, res= response)=>{

    const {clienteId}= req.body;
    
    const ventas= await Venta.find().where("cliente").equals(clienteId)
        .populate('productos', "nombre")
        .populate('usuario', "nombre");

    if(!ventas){
        const error= new Error("No se encontraron Ventas o Cliente");
        return res.status(404).json({msg: error.message});
    }
    res.json(ventas);
}

const eliminarVenta= async (req= request, res= response)=>{
    const {id}= req.params;

    const venta= await Venta.findById(id);  
    if(!venta){
        const error= new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    }
    try {
        await venta.deleteOne();
        res.json({msg: "Venta Eliminada"});
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    nuevaVenta,
    obtenerVentas,
    eliminarVenta
}