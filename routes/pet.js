var express = require('express');
var router = express.Router();
const Pet = require('../models/pet')
const _ = require('underscore')
const jwt = require('jsonwebtoken')
const {
  verificaToken,
  verificaAdmin
} = require('../middlewares/autenticacion')


//api para agregar una tarea
router.post('/mascota', function (req, res, next) {

  let body = req.body
  console.log("body massconta: ",body)
  let pet = new Pet({
    nombre: body.nombre,
    tipo: body.tipo,
    owner: body.owner
  })

  pet.save((err, petDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: petDB
    })
    console.log("mascota guardada")
  })

})

//api para obtener usuarios con parametros para la paginacion de los usuarios (solo si es administrador)
router.get('/mascota', function (req, res, next) {

  let desde = req.query.desde || 0
  desde = Number(desde)
  let limite = req.query.limite || 0
  limite = Number(limite)
  //consulta pero filtrando los campos
  Pet.find({}, 'nombre apellido email')
    .skip(desde)
    .limit(limite)
    .exec((err, pets) => {
      //si hay un error, 400 con el error
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      Pet.count({}, (err, conteo) => {
        //200 por default con el objeto actualizado
        //ademas de contar los registros uso undersocre para contar la cantidad de objetos en la coleccion de usuarios
        res.json({
          ok: true,
          data: pets,
          cantidad_usuarios: _.size(pets)
        })
      })

    })

})


module.exports = router;