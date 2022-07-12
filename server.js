const express = require('express');
const server = express();

server.all('/', (req, res)=>{
    res.send("hello Jeremy")
})

function keepAlive(){
    server.listen(3000, ()=>{console.log("webserver online")});
}
module.exports = keepAlive;
