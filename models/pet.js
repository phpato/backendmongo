const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema
const Owner = mongoose.model('Owner');

let petSchema = new Schema({
	nombre: String,
    tipo: String,
    owner: { type: Schema.ObjectId, ref: "Owner" } 
});



module.exports = mongoose.model('Pet',petSchema);

