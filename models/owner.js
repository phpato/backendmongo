const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema

let ownerSchema = new Schema({
    nombre:{
        type: String,
        required: [true,"EL nombre es obligatorio"]
    },
    apellido: {
        type: String,
        unique: true,
        required: [true,"EL apellido es obligatorio"]
    },
    email: {
        type: String,
        unique: true,
        required: [true,"El email es obligatorio"]
    }
});



ownerSchema.plugin( uniqueValidator,{message: '{PATH} debe ser único'})

module.exports = mongoose.model('Owner',ownerSchema);

