const functions = require("firebase-functions");
const fetch = require("node-fetch"); 
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

//npm i nodemailer
//npm i cors 
//npm fecth

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'diogogbrandao@poli.ufrj.br',
      pass: '11hmf1110d' // naturally, replace both with your real credentials or an application-specific password
    }
  });
  
exports.sendMailWelcome = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const email = req.query.email;
        const name = req.query.name;
        //const login = req.query.login;
        //const password = req.query.password;

        const mailOptions = {
            from: 'diogogbrandao@poli.ufrj.br',
            to: email,
            subject: 'Sua filiação está em análise', // email subject
            html: 
            ` 
            <body style="margin:0;padding:0;font-family: Open Sans;">
    <table width="700" align="center" cellpadding="0" cellspacing="0">
        <tr>
            <td style="padding:30px 0 30px 0" align="center">
                <img width="276px" height="124px" alt="Imagem" style="display:block;"
                    src="https://i.imgur.com/6Etq71W.png" />
            </td>
        </tr>
        <tr>
            <td style="padding:20px 0" bgcolor="#263272" align="center">
                <h2 style="color: #fff;margin: 0;font-size: 35px;">Sua filiação está em análise</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 20px 20px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="border-bottom: 2px solid #ccc;padding: 30px 0 50px 0;">
                            <span style="color: #000;font-size: 22px;font-weight: bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Olá, ${name}</span>
                            <p
                                style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 600;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Olá, seja bem-vindo(a) ao aplicativo do PDT.
                                Agora você pode ficar por dentro de tudo o que acontece no partido, como notícias,
                                vídeos e até podcasts!
                            </p>
                            <p
                                style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 600;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Informamos que a análise das filiações estão levando um pouco mais de tempo devido a
                                pandemia, mas em breve você receberá uma
                                resposta de nossa equipe neste mesmo e-mail cadastrado.
                            </p>
                            <p
                                style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 600;margin-bottom: 20px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Fique atento também a sua pasta de Spam e Lixo Eletrônico,
                                pois nosso e-mail poderá cair lá.
                            </p>
                            <p
                                style="color:#263272;font-size: 16px;padding-bottom: 10px;font-weight: 600;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
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

            // email content in HTML
        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});