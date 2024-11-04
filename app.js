var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
const cors = require('cors');
var port = process.env.port || 4201; 

var app = express();

var clientes_router = require('./routes/cliente');
var usuario_router = require('./routes/usuario');

//Para poder recibir datos de un formulario
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});


//Archivos de ruteo que se están usando
app.use('/api', clientes_router);
app.use('/api', usuario_router);



async function startServer() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda');
        console.log('Conectado a la base de datos');

        app.listen(port, function() {
            console.log('Servidor corriendo en el puerto ' + port);
        });
    } catch (error) {
        console.log('Error al conectar con la base de datos:', error);
    }
}



startServer();

module.exports = app;