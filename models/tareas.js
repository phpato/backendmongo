const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema
let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un role valido'
}
let tareaSchema = new Schema({
    nombre:{
        type: String,
        required: [true,"EL nombre es obligatorio"]
    },
    descripcion: {
        type: String,
        unique: true,
        required: [true,"El correo es obligatorio"]
    },
    estado: {
        type: String,
        required: [true,"La contraseña es obligatoria"]
    }
});


tareaSchema.plugin( uniqueValidator,{message: '{PATH} debe ser único'})

module.exports = mongoose.model('Tarea',tareaSchema);

