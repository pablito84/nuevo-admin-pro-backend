

/*
    Path: 'api/login'
*/
const { Router} = require('express');
const { check } = require('express-validator');
const { login, googleSingIn, renewtoken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.post('/', 
            [
             check('email' , 'El email es obligatorio').isEmail(),
             check('password' , 'El password es obligatorio').not().isEmpty(),
             validarCampos
            ],
            login
            
)
router.post('/google', 
            [
             check('token' , 'El Token de Google es obligatorio').not().isEmpty(),
             validarCampos
            ],
            googleSingIn
            
)

router.get('/renew', 
            validarJWT,
            renewtoken 
            
)









module.exports = router;
