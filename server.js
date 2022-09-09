const express = require('express');
const server = express();
const port = process.env.PORT || 3000
server.all('/', (req, res)=>{
    res.send("sdfgghfg")
})
console.log(port)
function keepAlive(){
    server.listen(port, ()=>{console.log("webserver online")});
}
module.exports = keepAlive;
