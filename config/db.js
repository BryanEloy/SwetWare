const mongoose= require('mongoose');

const DBconection= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado DB');

    } catch (error) {
        console.log(error);
        process.exit(1);//Detener la aplicacion en caso dde haber un error
    }
}

module.exports= DBconection;