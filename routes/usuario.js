var express = require('express');
var router = express.Router();
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const jwt = require('jsonwebtoken')
const {verificaToken,verificaAdmin}  = require('../middlewares/autenticacion')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//api para agregar un usuario
router.post('/usuario',verificaToken,verificaAdmin, function(req, res, next) {
  
  let body = req.body
  let usuario = new Usuario({
    nombre :body.nombre,
    apellido: body.apellido,
    email: body.email,
    password: bcrypt.hashSync( body.password, 10),
    role: body.role,
  })

  usuario.save( (err,usuarioDB) =>{
    
    if(err){
      return res.status(400).json({ok: false, err})
    }

    res.json({
      ok: true,usuario: usuarioDB
    })
  })

});
//api para actualizar la informacion de un usuario
router.put('/usuario/:id',verificaToken,verificaAdmin, function(req, res, next) {
  
  let id = req.params.id
  //funcion para solo obtener los campos deseados y evitar inputs extras,(undersocre.js)
  let body = _.pick(req.body ,['nombre','email','email','password','role','google'])
  //metodo para buscar un objeto por su id y actualizar el documento
  //la funcion new es para devolver el elemento actualizado
  //runValidators es para correr las validaciones del esquema del usuario
  //el context query es para que ignore los unique durante la actualizacion 
  Usuario.findByIdAndUpdate (id,body,{new: true, runValidators: true, context: 'query'}, (err,usuarioDB) =>{
    //si hay un error, 400 con el error
    if(err){
      return res.status(400).json({
        ok: false, err
      })
    }
    //200 por default con el objeto actualizado
    res.json({
      ok: true,
      usuario: usuarioDB
    })

  })

})
//api para obtener usuarios con parametros para la paginacion de los usuarios
router.get('/usuario',verificaToken, function(req, res, next) {
  
  let desde = req.query.desde || 0
  desde = Number(desde)
  let limite = req.query.limite || 0
  limite = Number(limite)
  //consulta pero filtrando los campos
  Usuario.find({estado:true},'nombre email role estado google')
          .skip(desde)
          .limit(limite)
          .exec((err,usuarios)=>{
            //si hay un error, 400 con el error
            if(err){
              return res.status(400).json({ok: false, err})
            }
            Usuario.count({},(err,conteo) =>{
              //200 por default con el objeto actualizado
              //ademas de contar los registros uso undersocre para contar la cantidad de objetos en la coleccion de usuarios
              res.json({
                ok: true,usuarios,
                cantidad_usuarios: _.size(usuarios)
              })
            })

          })

})
//api para borrar un usuario fisicamente
router.delete('/usuario/:id',verificaToken,verificaAdmin,function (req,res,next) {
  let id = req.params.id
  Usuario.findByIdAndRemove(id,(err,usuarioBorrado) =>{
    //si hay un error, 400 con el error
    if(err){
      return res.status(400).json({
        ok: false, err
      })
    } 

    //si el usuario no se encuentra, devolver error
    if(!usuarioBorrado){
      return res.status(400).json({
        ok: false, 
        err:{
          message: 'Usuario no encontrado'
        }
      })
    }
    //todo bien
    res.json({ok: true,usuarioBorrado})
  })
})


//api para borrar logicamente a un usuario
router.delete('/usuario_borrado_logico/:id', verificaToken,verificaAdmin, function(req, res, next) {
  
  let id = req.params.id
  //para visualizar mejor el codigo
  let actualizaEstado = {
    estado: false
  }
  Usuario.findByIdAndUpdate (id,actualizaEstado,{new: true, runValidators: true, context: 'query'}, (err,usuarioDB) =>{
    //si hay un error, 400 con el error
    if(err){
      return res.status(400).json({
        ok: false, 
        err
      })
    }
    //200 por default con el objeto actualizado
    res.json({
      ok: true,
      usuario: usuarioDB
    })

  })

})

module.exports = router;
