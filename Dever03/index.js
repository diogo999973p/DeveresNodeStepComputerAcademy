let restifyClients = require('restify-clients');
let fs = require('fs');
let client = restifyClients.createJSONClient({'url':'https://www.uol.com.br'});

console.log('Seja Bem-vindo ao Sistema');

client.get('/index.html', function (error, req, res, retorno){
    console.log('A página index de uol está logo abaixo:');
    console.log(retorno);

    fs.writeFile("E:/STEP/Node/Projetos/Deveres/Dever03/index_out.txt", retorno, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("O arquivo foi salvo!");
    }); 
}
);