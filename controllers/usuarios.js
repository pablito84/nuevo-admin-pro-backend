const { response } = require('express'); 
const bcrypt  = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt');



const getUsuarios = async( req, res ) =>{

   const desde = Number(req.query.desde) || 0 ;

   const [ usuarios , total] = await Promise.all([
         Usuario.find({} , 'nombre email password google img role')
         .skip( desde )
         .limit( 5 ),
         
         Usuario.countDocuments()
   ]);
   /// Skip y limit es para la paginacion:
 /*    const usuarios = await Usuario.find({} , 'nombre email password google')
                                  .skip( desde )
                                  .limit( 5 )

    const total = await Usuario.count(); */


    res.json({
       ok: true,
       usuarios,
       uid: req.uid,
       total 
    });

  }

const crearUsuario = async( req, res = response ) =>{
//    console.log(req.body );
    const{ email , password } = req.body;


   try {

   const existeEmail = await Usuario.findOne({ email });

   if( existeEmail) {
      return res.status(400).json({
         ok:false,
         msg: 'El correo ya esta registrado..'
      });
   }

   console.log(req.body);

    const usuario = new Usuario( req.body );

    /// Encriptar Contraseña:

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password , salt );

    // Grabar usuario:
    await usuario.save();

      /// Generar el TOKEN - Json Web Token ( JWT )
      const token = await generarJwt( usuario.id );

    res.json({
       ok: true,
       usuario,
       token
    });

      
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Error inesperado... revisar logs'
      });
   }    
  } 

  
  const actualizarUsuario = async ( req , res = response ) => {

   const uid = req.params.id;

   try {
      console.log('uid', uid);
      const usuarioDB = await Usuario.findById( uid );

      if ( !usuarioDB ){
         return res.status(404).json({
            ok: false,
            msg: 'No existe un usuario con ese ID'
         });
      }

      /// Actualizaciones:
      const { password , google , email , ...campos} = req.body;

      if ( usuarioDB.email != email ){
         const existeEmail = await Usuario.findOne( { email } );
         if( existeEmail ){
            return res.status(400).json({
               ok:false,
               msg: 'Ya existe un usuario con ese mail'
            });
         }
      }

      if(!usuarioDB.google) {
         campos.email = email;
      } else if( usuarioDB.email !== email) {
         return res.status(400).json({
            ok: false,
            msg: 'Usuarios de Google no pueden cambiar su correo.'
         });
      }
      
      const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos , { new: true });

      res.json({
         ok: true,
         usuario: usuarioActualizado

      })
      
   } catch (error) {
      console.log(error);
      res.status( 500 ).json({
         ok: false,
         msg: 'Error inesperado en el Alta'
      })
      
   }

  }


  const borrarUsuario = async( req , res = response ) => {

   const uid = req.params.id;

   try {
      const usuarioDB = await Usuario.findById( uid );

      if ( !usuarioDB ){
         return res.status(404).json({
            ok: false,
            msg: 'No existe un usuario con ese ID'
         });
      }
      
      await Usuario.findByIdAndDelete( uid );

      res.json({
         ok: true,
         msg: 'Usuario eliminado'
      })

   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Hable con el Administrador'
      });
   }

  }

 module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
 } 