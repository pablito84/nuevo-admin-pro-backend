 
 require('dotenv').config();
 const express = require('express');
 const cors = require('cors');

 const { dbConnection } = require('./database/config');

// Crear el servidor Express
 const app = express();

 /// Configurar Cors:
 app.use( cors());

 /// Rutas
 //mean_user
 //9k5qHGmLE8Cbn1mQ

dbConnection();

/* console.log(process.env); */

 app.get( '/' , ( req, res ) =>{
   res.json({
      ok: true,
      msg: 'Hola mundo'
   });
 });

 app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
 });