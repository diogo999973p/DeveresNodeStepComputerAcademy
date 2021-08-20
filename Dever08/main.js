const express = require("express")();
const cors = require("cors");
const http = require("http").createServer(express);
const io = require("socket.io")(http);
const { MongoClient } = require("mongodb");

resource = "mongodb+srv://root:123@cluster0.xzgr7.mongodb.net/test"
const client = new MongoClient(resource);

express.use(cors());

express.set('views', __dirname);
express.set('view engine', 'ejs');

var collection;

function isConnected() {
    return !!client && !!client.topology && client.topology.isConnected()
}
  

//eventos
io.on("connection", (socket) => {
    console.log('a user connected');

    socket.on("join", async (gameId) => {
        try {
            let result = await collection.findOne({ "_id": gameId });
            
            if(!result) {
                await collection.insertOne({ "_id": gameId, messages: [] });
                console.log("Creating a collection with id " + gameId);
            }

            console.log("Collection with id " + gameId + " already existed");    

            socket.join(gameId);
            //socket.emit("joined", gameId);
            socket.activeRoom = gameId;
        } catch (e) {
            console.error(e);
        }
    });

    socket.on("message", (message) => {
        console.log("receiving message from client, in server");

        collection.updateOne({ "_id": socket.activeRoom }, {
            "$push": {
                "messages": message
            }
        });

        io.to(socket.activeRoom).emit("message", message);
    });
});

//rotas
express.get("/chats", async(request, response) => {
    console.log("Dentro de Chats");

    try {
        let result = await collection.findOne({ "_id": request.query.room });
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

express.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

http.listen(3000, async () => {
    try {
        await client.connect();
        collection = client.db("gamedev").collection("chats");
        console.log("Listening on port :%s...", http.address().port);
    } catch (e) {
        console.error(e);
    }
});
