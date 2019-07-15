var express = require('express');
var router = express.Router();
const Tarea = require('../models/tarea')
const _ = require('underscore')
const jwt = require('jsonwebtoken')
const {
  verificaToken,
  verificaAdmin
} = require('../middlewares/autenticacion')


//api para agregar una tarea
router.post('/tarea', verificaToken, verificaAdmin, function (req, res, next) {

  let body = req.body
  let tarea = new Tarea({
    nombre: body.nombre,
    descripcion: body.descripcion,
  })

  tarea.save((err, tareaDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: tareaDB
    })
  })

})

//api para obtener usuarios con parametros para la paginacion de los usuarios (solo si es administrador)
router.get('/tarea', verificaToken, function (req, res, next) {

  let desde = req.query.desde || 0
  desde = Number(desde)
  let limite = req.query.limite || 0
  limite = Number(limite)
  //consulta pero filtrando los campos
  Tarea.find({}, 'nombre descripcion terminado')
    .skip(desde)
    .limit(limite)
    .exec((err, tareas) => {
      //si hay un error, 400 con el error
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      Tarea.count({}, (err, conteo) => {
        //200 por default con el objeto actualizado
        //ademas de contar los registros uso undersocre para contar la cantidad de objetos en la coleccion de usuarios
        res.json({
          ok: true,
          tareas,
          cantidad_usuarios: _.size(tareas)
        })
      })

    })

})
//api para borrar una tarea fisicamente(borrar el registro, borrado no logico)
router.delete('/tarea/:id', verificaToken, verificaAdmin, function (req, res, next) {
  let id = req.params.id
  Tarea.findByIdAndRemove(id, (err, tareaBorrada) => {
    //si hay un error, 400 con el error
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    //si el usuario no se encuentra, devolver error
    if (!tareaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Tarea no encontrada'
        }
      })
    }
    //todo bien
    res.json({
      ok: true,
      tareaBorrada
    })
  })
})

//api para borrar logicamente a un usuario
router.put('/terminar_tarea/:id', verificaToken, verificaAdmin, function (req, res, next) {

  let id = req.params.id
  //para visualizar mejor el codigo
  let actualizaEstado = {
    terminado: true
  }
  Tarea.findByIdAndUpdate(id, actualizaEstado, {
    new: true,
    runValidators: true,
    context: 'query'
  }, (err, tareaDB) => {
    //si hay un error, 400 con el error
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    //si la tarea no se encuentra, devolver error
    if (!tareaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Tarea no encontrada'
        }
      })
    }
    //200 por default con el objeto actualizado
    res.json({
      ok: true,
      usuario: tareaDB,
      message: "tarea marcada como terminada"
    })

  })

})


module.exports = router;