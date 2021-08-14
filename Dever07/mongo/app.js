var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//Adicionei
var cors = require("cors"); //biblioteca para comunicação entre cliente e servidor
const http = require("http").createServer(express) //
const io = require("socket.io")(http); //
const { MongoClient } = require("mongodb"); //biblioteca de client do mongodb//puxando só o MongoClient
const { isObject } = require("util"); //
var app = express();

var resource = "mongodb+srv://root:123@cluster0.xzgr7.mongodb.net/test"

const client = new MongoClient(resource);

//cores: biblioteca de cross origens: comunicação do banco com o cliente
//mongodb: biblioteca padrão para banco de dados do mongodb
app.use(cors());

//Configurando o chat
var collection; //vou usar para conectar ao banco

io.on("connection", (socket) => {
  socket.on("join", async(gameId) => {
      try {
        let result = await collection.findOne({ "_id": gameId });
        if(!result) {
            await collection.insertOne({ "_id": gameId, messages: [] });
        }
        socket.join(gameId);
        socket.emit("joined", gameId);
        socket.activeRoom = gameId;
    } catch (e) {
        console.error(e);
    }
  });
  socket.on("message", (message) => {
      collection.updateOne({ "_id": socket.activeRoom }, {
        "$push": {
            "messages": message
        }
    });
    io.to(socket.activeRoom).emit("message", message);
  });
});

app.get("/chats", async (request, response) => {
  try {
    let result = await collection.findOne({ "_id": request.query.room });
    response.send(result);
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = {http, app, client};
