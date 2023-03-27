const { request, response } = require("express");

const Producto= require('../models/Producto');

const obtenerProductos= async (req= request, res= response)=>{
    const {nombre}= req.body;

    const regex= new RegExp(nombre, 'i');
    const busqueda= await Producto.find({nombre: regex});

    res.json({
        results: busqueda
    });
};
const eliminarProducto= async (req= request, res= response)=>{
    const {id}= req.params;

    const producto= await Producto.findById(id);  
    if(!producto){
        const error= new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    }
    try {
        await producto.deleteOne();
        res.json({msg: "Producto Eliminado"});
    } catch (error) {
        console.log(error);
    }
};
const agregarProducto= async (req= request, res= response)=>{
    const {body}= req;
    const productoDB= await Producto.findOne({nombre: body.nombre});

    //Si el producto ya existe en la base de datos
    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya fue registrado`
        });
    }
    body.nombre= body.nombre.toUpperCase();
    const producto= new Producto(body);

    try {
        const productoAlmacenado= await producto.save();
        res.json(productoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};
const editarProducto= async (req= request, res= response)=>{
    const {id}= req.params;
    const {body}= req;

    //Informacion del producto
    if( body.nombre) body.nombre= body.nombre.toUpperCase();

    const producto= await Producto.findByIdAndUpdate(id, body, {new: true} );
    res.json({
        msg: 'Producto Actualizado',
        producto
    });
};

module.exports= {
    obtenerProductos,
    eliminarProducto,
    agregarProducto,
    editarProducto
}