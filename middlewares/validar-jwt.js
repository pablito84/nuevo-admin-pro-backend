const  jwt  = require("jsonwebtoken");


const validarJWT = (req, res, next ) => {

/// Leer el token desde el Header:
    const token = req.header('x-token');

    //console.log(token);

    if( !token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
     
        const { uid } = jwt.verify( token , process.env.JWT_SECRET );

        req.uid = uid;
        next();
       // console.log(uid);
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

   
}

module.exports = {
    validarJWT
}