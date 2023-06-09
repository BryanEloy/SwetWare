const {Schema, model, default: mongoose}= require("mongoose");

const ventaSchema= Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Empleado"
        },
        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente"
        },
        productos:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Producto"
            }
        ],
        fecha:{
            type: Date,
            default: Date.now()
        },
        total: {
            type: Number,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true,
    }
);


module.exports= model('Venta', ventaSchema);