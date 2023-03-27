const {Schema, model}= require("mongoose");

const clienteSchema= Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            require: true,
            trim: true,
            unique: true
        },
        direccion: {
            type: String,
            required: true
        },
        telefono:{
            type: Number,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports= model('Cliente', clienteSchema);