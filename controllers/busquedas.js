
const { response} = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

getTodo = async( req , resp = response) => {

    const busqueda = req.params.busqueda;
    const regEx = new RegExp( busqueda , 'i' );


    const [ usuarios , medicos , hospitales ] = await Promise.all([
         Usuario.find({ nombre : regEx }),
         Medico.find({ nombre : regEx }),
         Hospital.find({ nombre : regEx }),
    ])

    resp.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });

}
 
getDocumentosColeccion = async( req , resp = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regEx = new RegExp( busqueda , 'i' );

    // El parametro 'i' indica que la busqueda es insensible( no es case Sensitive )

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre : regEx })
                                .populate('usuario' , 'nombre img' )
                                .populate('hospital' , 'nombre img' );
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre : regEx })
                                 .populate('usuario' , 'nombre img' );
            break;
        case 'usuarios':
             data = await Usuario.find({ nombre : regEx });
  
            break;
    
        default:
            return resp.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser: Usuarios / Medicos / Hospitales'
            });

    }

    resp.json({
        ok:true,
        resultados: data
    })

}
 



module.exports = {
    getTodo,
    getDocumentosColeccion
}