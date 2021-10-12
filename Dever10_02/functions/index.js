const functions = require("firebase-functions");
const firebase = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const fetch = require('node-fetch');
const { response } = require("express");
const app = require("express")();

firebase.initializeApp();

let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: 'mail.azimutestartup.com',
    port: 465,
    secure: true,
    auth: {
        user: 'trabalheconosco@azimutestartup.com',
        pass: 'e$0^,s%I4b@E'
    }
});

var transporterMailTrap = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "29f38165dc972b",
      pass: "140bb73fa999d3"
    }
  });

exports.sendEmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const email = req.query.email;

        const mailOptions = {
            from: 'PDT <noreply@pdt-app-fe29a.firebaseapp.com>',
            to: email,
            subject: 'Parabéns! Sua filiação foi aceita!', // email subject
            html:
                ` 
            <body style="margin:0;padding:0;font-family: Open Sans;">
            <table width="700" align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:30px 0 30px 0" align="center">
                        <img width="180px" height="100px" alt="Imagem" style="display:block;"
                            src="https://i.imgur.com/6Etq71W.png" />
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 0" bgcolor="#263272" align="center">
                        <h2 style="color: #fff;margin: 0;font-size: 35px;">Parabéns! Sua filiação foi aceita!</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 20px 20px 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" style="border-bottom: 2px solid #ccc;padding: 30px 0 50px 0;">
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 600;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Agora você já é um filiado do Partido Democrático Trabalhista!
        
                                    </p>
        
                                    <p
                                        style="color:#263272;margin-top: 10px;font-size: 16px;padding-bottom: 10px;font-weight: 500;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Para acessar seu perfil e a sua carteirinha digital, basta abrir o app,
                                        ir em Perfil e digitar seu e-mail e senha.
        
                                    </p>
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        Esqueceu sua senha? Não tem problema.
                                        Em Perfil, clique em "Esqueci minha senha" antes de digitar seu e-mail
                                        e nós enviaremos uma redefinição de senha para o seu e-mail.
        
                                    </p>
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                    
                                        Fique atento também a sua pasta de Spam e Lixo Eletrônico,
                                        pois nosso e-mail poderá cair lá.
                                      
                                    </p>
        
        
                                    <p
                                        style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 500;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                    
                                        Um grande abraço!
                                        Equipe PDT
        
                                    </p>
        
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
            `
        };

        // returning resulta
        return transporterMailTrap.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

exports.sendFormDataToFirebase = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        const nome = req.query.nome;
        const email = req.query.email;
        const idade = req.query.idade;
        const cep = req.query.cep;

        function insertInDataBase() {
            let res = firebase.database().ref('listaDeEmail');
            let key = res.push().key;
            res.child(key).set({
                 nome: nome,
                 email: email,
                 idade: idade,
                 cep: cep
             });
         }
        
         insertInDataBase();

         return null;
    });
});


exports.sendEmailToRegisteredUsers = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
    var query = firebase.database().ref("listaDeEmail").orderByKey();

    regs = [];

    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          //var childData = childSnapshot.val();

         
          register = {
            nome:  childSnapshot.child("nome").val(),
            email: childSnapshot.child("email").val(),
            idade: childSnapshot.child("idade").val(),
            cep: childSnapshot.child("cep").val()
          }
           
          /*
          register = {
            nome:  childData.child("nome").val(),
            email: childData.child("email").val(),
            idade: childData.child("idade").val(),
            cep: childData.child("cep").val()
          }*/

          regs.push(register);
      });
    });

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    for (let regIndex in regs){
        //console.log(regs[regIndex].email);
        functions.logger.log("Email:", regs[regIndex].email);

        fetch(`https://us-central1-testedgb01.cloudfunctions.net/sendAnEmail?email=${regs[regIndex].email}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

    /*
    for (let regDict in regs){
        fetch(`https://us-central1-testedgb01.cloudfunctions.net/sendFormDataToFirebase?nome=${regDict.nome}&email=${regDict.email}&idade=${regDict.idade}&cep=${regDict.cep}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }*/
    return null;
});

exports.removeDataInDatabase = functions.pubsub.schedule('every 10 minutes').onRun((context) => {
    firebase.database().ref("listaDeEmail").remove();
    
    return null;
});




// Take the text parameter passed to this HTTP endpoint and insert it into// Firestore under the path /messages/:documentId/original
exports.addDataToFirestore = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = firebase.firestore().collection('messages').add({original: original});

    // Send back a message that we've successfully written the message
    res.json(
        {result: `Message with ID: ${writeResult.id} added.`
    });
});



// MEU CODIGO
/*
const db = firebase.firestore().collection("todos");

app.get("/todos", function(req, res) {
    db.get().then(function(docs){
        let todos = [];

        docs.forEach(function (doc){
            todos.push({
                id:doc.id,
                description: doc.data().description
            });
        });

        res.json(todos);
    });
});

app.post("/todos", function(req, res) {
    db.add({
        description: req.body.description
    }).then(function(){
        res.json({general: 'Works'});
    });
});

exports.api = functions.https.onRequest(app);
*/

const db = firebase.firestore().collection("movies");

app.get("/movies", (req,res) => {    
    db.get().then((docs) => {

        let movies = [];
        
        docs.forEach((doc) => {
            data = doc.data();

            movies.push({
                id: doc.id,
                name: data.name,
                release: data.release,
                synopsis: data.synopsis,
                rating: data.rating
            });
        });

        res.json(movies);
    });
});

app.get("/movies/find/:name", (req,res) => {
    qmovie = req.params.name;

    //res.json({"qmovie": qmovie});

    db.get().then((docs) => {

        let movies = [];
        
        docs.forEach((doc) => {
            data = doc.data();

            if(data.name == qmovie){
                movie = {
                    id: doc.id,
                    name: data.name,
                    release: data.release,
                    synopsis: data.synopsis,
                    rating: data.rating
                };

                res.json(movie);

                return null;
            }
        });

        res.json({"message":"No movie was found with that name."});
    });
});

app.get("/movies/top2", (req,res) => {    
    db.get().then((docs) => {

        let movies = [];
        
        docs.forEach((doc) => {
            data = doc.data();

            movies.push({
                id: doc.id,
                name: data.name,
                release: data.release,
                synopsis: data.synopsis,
                rating: data.rating
            });
        });

        movies.sort(function(da,db){
            return (db.rating - da.rating); 
        });

        top2Movies = []

        if(movies.length >= 2){
            for(let i = 0 ; i < 2; i++){
                top2Movies.push(movies[i]);
            }

            res.json(top2Movies);
        }else{
            res.json({message: 'There are not more than two registered films.'});
        }  

        res.json(top2Movies);
    });
});

app.post("/movies", (req,res) => {
    db.add({
        name: req.body.name,
        release: req.body.release,
        synopsis: req.body.synopsis,
        rating: req.body.rating
    }).then(function(){
        res.json({message: 'added a movie'})
    });
});

exports.api = functions.https.onRequest(app);


/*
exports.addMessage = functions.https.onRequest(async (req, res) => {

    // Grab the text parameter.

    const original = req.query.text;

    // Push the new message into Firestore using the Firebase Admin SDK.

    const writeResult = await admin.firestore().collection('messages').add({original: original});

    // Send back a message that we've successfully written the message

    res.json({result: `Message with ID: ${writeResult.id} added.`});

});*/

/*
exports.readDataInDataBase = functions.pubsub.schedule('every 10 minutes').onRun((context) => {
    firebase.database().ref('listDeEmail').on('value', (snapshot) => {
    snapshot.forEach((chilItem) => {
    let array = {
    key: chilItem.key,
    email: chilItem.val().email,
    name: chilItem.val().name
    };
    //const arryVazio = push(array)
    })
    })
    `https://us-central1-flapp-c0888.cloudfunctions.net/sendAffiliationAccepted?${email}&${name}`
    //firebase.database().ref("listaDeEmail").remove();
    //firebase.database().ref('tipo').set('Vendedor');
    //return null;
    });*/