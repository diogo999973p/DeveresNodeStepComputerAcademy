const express = require("express")();
const cors = require("cors");
const http = require("http").createServer(express);
const io = require("socket.io")(http);
const fetch = require('node-fetch');


express.use(cors());

express.set('views', __dirname);
express.set('view engine', 'ejs');

function sendEmail(nome, email, idade, cep) {
    
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    fetch(`https://us-central1-testedgb01.cloudfunctions.net/sendFormDataToFirebase?nome=${nome}&email=${email}&idade=${idade}&cep=${cep}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//eventos
io.on("connection", (socket) => {
    console.log('a user connected');
    
    socket.on("cadastro", (cadastro) => {
        console.log("receiving message from client, in server");
        
        sendEmail(cadastro['nome'], cadastro['email'], cadastro['idade'], cadastro['cep']);
    });
});

express.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

http.listen(3000, async () => {
    try {
        console.log("Listening on port :%s...", http.address().port);
    } catch (e) {
        console.error(e);
    }
});
