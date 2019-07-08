var express = require('express');
var router = express.Router();
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/login', function(req, res, next) {
    let body = req.body
    //verificamos si existe el email en la bd de fallar tan solo eso validamos
    Usuario.findOne({email: body.email}, (err,usuarioBD) =>{
        if(err){
            return res.status(400).json({ok: false, err})
        }

        if(!usuarioBD){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "Usuario no existe en la base de datos"
                }
            })
        }

        //si la contrañsena que se ingreso es igual a la del usuario del correo se devuelve el usuario
        if(!bcrypt.compareSync(body.password, usuarioBD.password)){
            res.status(400).json({
                ok: true,
                err:{
                    message: "La contraseña ingresada no es valida"
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioBD
        },'secret', {expiresIn: 60*60*12*24*30})
        
        res.json({
            ok: true,
            usuarioBD,
            token
        })


    })
 
  });
  

module.exports = router;