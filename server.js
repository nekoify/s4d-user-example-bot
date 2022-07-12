const express = require('express');
const server = express();
const port = process.env.PORT || 3000;
server.all('/', (req, res) => {
    res.send("hello Jeremy")
    res.header("Access-Control-Allow-Origin", req.header('origin'));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
})

function keepAlive() {
    server.listen(port, () => { console.log("webserver online") });
}
module.exports = keepAlive;
