 
 require('dotenv').config();
 const express = require('express');
 const cors = require('cors');

 const { dbConnection } = require('./database/config');

// Crear el servidor Express
 const app = express();

 /// Configurar Cors:
 app.use( cors());


 /// Lectura y parseo del Body
 app.use( express.json());

 /// Rutas
 //mean_user
 //9k5qHGmLE8Cbn1mQ

dbConnection();

/* console.log(process.env); */

/// RUTAS 

app.use('/api/usuarios', require('./routes/usuarios') );
app.use('/api/hospitales', require('./routes/hospitales') );
app.use('/api/medicos', require('./routes/medicos') );
app.use('/api/todo', require('./routes/busquedas') );
app.use('/api/login', require('./routes/auth') );
app.use('/api/upload', require('./routes/uploads') );


 app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
 });