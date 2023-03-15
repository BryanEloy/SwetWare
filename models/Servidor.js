const express= require('express');
const cors= require('cors');
const { Server } = require("socket.io");

const DBConection= require('../config/db');

class Servidor{
    constructor(){

        //crear el servidor
        this.app= express();
        //Puerto de la app
        this.port= process.env.PORT || 4000;
        //Levatar el server donde iran los sockets
        this.server= null;
        //Creamos el socket en el server
        this.io= null

        //Endpoints al server
        this.paths={
            example: "/api/example"
        }
        
        //Conexion a las DB
        this.conection()
        //Middlewares
        this.middlewares();
        //Rutas de la pp
        this.routes();
        //Conectar servidor al puerto
        this.listen();
        //Sockets del server
        this.sockets();
    }

    async conection(){
        await DBConection();
    }

    routes(){
        this.app.use( this.paths.users, require('../routes/usuario') );
    }

    middlewares(){
        //Lectura y parseo del body
        this.app.use( express.json() );

        //Habilitar CORS
        const whiteList= [process.env.FRONTEND_URL];
        const corsOptions={
            origin: function(origin, callback){
                if(whiteList.includes(origin)){
                    //Permitir consulta a LA API
                    callback(null, true);
                }else{
                    //No esta permitido
                    console.log(origin);
                    callback(new Error("Error de cors"));
                }
            }
        }
        this.app.use(cors(corsOptions));
    }

    listen(){
        this.server= this.app.listen(this.port, ()=>{
            console.log(`Servidor funcionando en el puerto ${this.port}`)
        });
    }
    
    sockets(){
        //Conectar al servidor
        this.io= new Server(this.server,{
            pingTimeout: 60000,
            cors:{
                origin: process.env.FRONTEND_URL
            }
        });
        //Coneccion a los sockets
        this.io.on( 'connection', (socket)=>{
            console.log('conectado a socket io');

            //Definir los eventos en los sockets

            socket.on('abrir proyecto', (proyecto)=>{
                //Unir la conexion a la sala del proyecto
                socket.join(proyecto);
            });

            socket.on('nueva tarea', (tarea)=>{
                //Emitir la nueva tarea a los usuarios que esten conectados al proyecto
                socket.to(tarea.proyecto).emit('Tarea Agregada', tarea);
            });

            socket.on('eliminar tarea', (tarea)=>{
                //Eliminar la tarea a los usuarios que esten conectados al proyecto
                socket.to(tarea.proyecto).emit('Tarea Eliminada', tarea);
            });

            socket.on('actualizar tarea',(tarea)=>{
                //Editar la tarea para todos los usuarios conectados al proyecto
                socket.to(tarea.proyecto._id).emit('Tarea Editada', tarea);
            });

            socket.on('cambiar estado', (tarea)=>{
                //Actualizar el estado de la tarea 
                socket.to(tarea.proyecto._id).emit('Tarea Estado', tarea);
            });
        });
    }
}

module.exports= Servidor;