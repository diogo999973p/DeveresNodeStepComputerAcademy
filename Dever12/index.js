fetch = require("node-fetch");

API_KEY = "k_blufsf0n";
EXPRESSION = "Matrix";

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
};

console.log("\nIniciando Fetch 1");

fetch(`https://imdb-api.com/en/API/SearchMovie/${API_KEY}/${EXPRESSION}`, requestOptions)
    .then((res) => { return res; })
    .then((res) => { return res.json(); })
    .then((res) => {
        console.log(res);
    })
    .catch(console.log("Error querying movie"));

console.log("\nFinalizando Fetch 1");

console.log("\nIniciando Fetch 2");

fetch(`https://imdb-api.com/en/API/SearchMovie/${API_KEY}/${EXPRESSION}`, requestOptions)
    .then((res) => { console.log(res.json()); })
    .catch(console.log("Error querying movie"));

console.log("\nFinalizando Fetch 2");