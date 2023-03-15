const {Schema, model}= require("mongoose");


const productoSchema= Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        precio:{
            type: Number,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
    }
);


module.exports= model('Producto', productoSchema);