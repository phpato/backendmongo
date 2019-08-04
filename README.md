# backendmongo
Proyecto simple de backend usando la base de datos MongDB, con una base de datos en la nube MongoAtlas, validacion con jwt y buenas practicas de codigo aunque siempre se puede ser mejor
el deploy se hizo en heroku
se uso JWT, Express, Underscore, Bcrypt
CRUD de usuarios
CRUD de tareas
se hizo un middleware para que solo los ADMIN_ROLE puedan actualizar y eliminar
se valida en cada accion si tiene un token y si este token no ha sido alterado

Usuario con ADMIN_ROLE
email: test1@gmail.com
password: 123456

Usuario con USER_ROLE
email: test3@gmail.com
password: 123456
la ruta para el login es:
https://patriciocabrera-webpage.herokuapp.com/login/login
se de enviar por x-www-form-urlencoded
se nos entregara un token segun el usuario asignado este token debe poner es cada header, a continuacion se detalle mas infor de la api

//API PARA LISTAR TODAS LAS TAREAS
GET: https://patriciocabrera-webpage.herokuapp.com/tareas/tarea
entrega todas las tareas y ademas tiene variantes para paginacion de datos como por ejemplo
https://patriciocabrera-webpage.herokuapp.com/tareas/tarea?limite=1&desde=0
el limite es un parametro para limitar la cantidad de registros requeridos y desde es desde cual documento se debe saltar (skip)

API PARA CREAR UNA TEAREA
POST: https://patriciocabrera-webpage.herokuapp.com/tareas/tarea
se de enviar por x-www-form-urlencoded
nombre: "nuevo diseño"
descripcion: "descripcion test"

API PARA BORRAR UNA TAREA
DELETE: https://patriciocabrera-webpage.herokuapp.com/tareas/tarea/5d2c3a334bcea600173d6bd0
En este ejemplo ese documento ya se elimino pero aun asi se maneja el error




