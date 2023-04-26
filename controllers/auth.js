const { response }= require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


const login = async( req , res = response ) => {

    const { email , password} = req.body;


    try {
    /// Verificar Email
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

    /// Verificar Contraseña
        const validPassword = bcrypt.compareSync( password , usuarioDB.password );
        if( !validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Contraseña no valida'
            });
        }

    /// Generar el TOKEN - Json Web Token ( JWT )
        const token = await generarJwt( usuarioDB.id );


        res.json({ 
            ok: true,
            token,
            menu: getMenuFrontEnd( usuarioDB.role )
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador.'
        });
    }

}

const googleSingIn = async( req , res = response ) => {

    try {
        const { email, name, picture }  = await googleVerify( req.body.token );

        const usuarioDB = await Usuario.findOne( { email} );
        let usuario;

        if( !usuarioDB ){
            usuario = new Usuario( {
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        /// Guardar usuario:
        await usuario.save();

        /// Generar el JWT:
        const token = await generarJwt( usuario.id );


        res.json({
            ok: true,
            email, name, picture,
            token,
            menu: getMenuFrontEnd( usuario.role )
        });
 
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false ,
            msg: 'Token de Google no es correcto'
        });
    }
 
} 


const renewtoken = async( req , res = response) => {
    
    const uid = req.uid;

     // generar el TOKEN - JWT
     const token = await generarJwt( uid );

     // Obtener el usuario por UID

     const usuario = await Usuario.findById( uid);

     res.json({
        ok: true,
        token, 
        usuario,
        menu: getMenuFrontEnd( usuario.role )
     });
}

module.exports = {
    login,
    googleSingIn, 
    renewtoken
}