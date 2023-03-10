
const { Schema , model } = require( 'mongoose' )

const medicoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    hospital: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
});

/// Esto es para renombrar el campo "_id" por "id"
medicoSchema.method('toJSON' , function(){
    const { __v, ...object } = this.toObject() ;
    return object;
})

module.exports = model('Medico', medicoSchema );