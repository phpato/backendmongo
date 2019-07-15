const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema

let tareaSchema = new Schema({
    nombre:{
        type: String,
        required: [true,"EL nombre es obligatorio"]
    },
    descripcion: {
        type: String,
        unique: true,
        required: [true,"La descrición es obligatoria"]
    },
    terminado: {
        type: Boolean,
        default: false
    }
});


tareaSchema.plugin( uniqueValidator,{message: '{PATH} debe ser único'})

module.exports = mongoose.model('Tarea',tareaSchema);

