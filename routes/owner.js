var express = require('express');
var router = express.Router();
const Owner = require('../models/owner')
const Pet = require('../models/pet')
const _ = require('underscore')
const jwt = require('jsonwebtoken')
const {
  verificaToken,
  verificaAdmin
} = require('../middlewares/autenticacion')


//api para agregar una tarea
router.post('/propietario', function (req, res, next) {

  let body = req.body
  let owner = new Owner({
    nombre: body.nombre,
    apellido: body.apellido,
    email: body.email,
  })

  owner.save((err, ownerDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: ownerDB
    })
  })

})

//api para obtener usuarios con parametros para la paginacion de los usuarios (solo si es administrador)
router.get('/propietario', function (req, res, next) {

  let desde = req.query.desde || 0
  desde = Number(desde)
  let limite = req.query.limite || 0
  limite = Number(limite)
  //consulta pero filtrando los campos
  Owner.find({}, 'nombre apellido email')
    .skip(desde)
    .limit(limite)
    .exec((err, owners) => {
      //si hay un error, 400 con el error
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      Owner.count({}, (err, conteo) => {
        //200 por default con el objeto actualizado
        //ademas de contar los registros uso undersocre para contar la cantidad de objetos en la coleccion de usuarios
        res.json({
          ok: true,
          data: owners,
          cantidad_usuarios: _.size(owners)
        })
      })

    })

})
//api para borrar una tarea fisicamente(borrar el registro, borrado no logico)
router.delete('/propietario/:id', function (req, res, next) {
  let id = req.params.id
  Owner.findByIdAndRemove(id, (err, propietarioBorrado) => {
    //si hay un error, 400 con el error
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    //si el usuario no se encuentra, devolver error
    if (!propietarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Propietario no encontrado'
        }
      })
    }
    //todo bien
    res.json({
      ok: true,
      propietarioBorrado
    })
  })
})

//api para borrar una tarea fisicamente(borrar el registro, borrado no logico)
router.get('/propietario/:id', function (req, res, next) {
  let id = req.params.id

  Pet.find({owner: id}, (err, propietarioMascota) => {
    //si hay un error, 400 con el error
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    //si el usuario no se encuentra, devolver error
    if (!propietarioMascota) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Propietario sin mascotas'
        }
      })
    }
    //todo bien
    res.json({
      ok: true,
      propietarioMascota
    })
  })
})

module.exports = router;