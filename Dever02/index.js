var app = require('express')();

var http = require('http').Server(app);

//socket io
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

//rota
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket){//prestar atenção se houve o evento connection
  socket.on('chat message', function(msg){//prestar atenção no evento chat message que nós criamos
    io.emit('chat message', msg); //emite para o servidor com a mensagem que chegou
  });
});

//coloca para funcionar a porta
http.listen(port, function(){
  console.log('Acesse em localhost:' + port);
});
