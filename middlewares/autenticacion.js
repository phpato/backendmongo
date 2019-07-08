const jwt = require('jsonwebtoken')
/*
* Veriicar token
*/
let verificaToken = (req,res,next) => {
    //se obtiene el header de la request
    let token = req.get('token')
    //si no se envio un token en la cabecera mandar error
    if(!token){
        return res.status(401).json({
            ok: false,
            err:{
                message: "Debe ingresar un token"
            }
        })  
    }
    //si no cuadra el token mandar error
    jwt.verify(token,'secret',(err,decoded) =>{
        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    message: "Token invalido"
                }
            })
        }
        req.usuario = decoded.usuario

        next()
    })

}

let verificaAdmin = (req,res, next) =>{
    if(!req.usuario || req.usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err:{
                message: "No tiene acceso para esta acción"
            }
        })
    }

    next()
}
//se exporta la arrow function
module.exports = {
    verificaToken,
    verificaAdmin
};