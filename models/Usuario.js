const {Schema, model}= require("mongoose");
const bcrypt= require("bcrypt");

const usuarioSchema= Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        password: {
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
        token:{
            type: String
        },
        confirmado:{
            type: Boolean,
            default: false
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
//Hashear el password
usuarioSchema.pre('save', async function(next){
    //Si no se esta modificando el password salimos de la funcion
    if(!this.isModified("password")) next();

    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
});
//Validar Contraseña
usuarioSchema.methods.comprobarPassword= async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports= model('Usuario', usuarioSchema);