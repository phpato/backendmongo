var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuario');
var loginRouter = require('./routes/login');
var tareasRouter = require('./routes/tarea');

var app = express();
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

 
mongoose.connect("mongodb+srv://usuarioprueba:usuarioprueba123@cluster0-x6qsf.mongodb.net/test",{useNewUrlParser: true }, (err,res) =>{
  if(err){
    throw err;
  }
  console.log("conexion exitosa a mongo atlas");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/login', loginRouter);
app.use('/tareas', tareasRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
