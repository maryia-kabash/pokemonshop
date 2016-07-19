// var http = require("http"),
//     port = process.env.PORT || 1881;
//
// var server = http.createServer(function(request,response){
//     response.writeHeader(200, {"Content-Type": "text/plain"});
//     response.write("Hello HTTP!");
//     response.end();
// });
//
let add = (x,y) => x + y;
let result = add(1,1);
console.log(result);
//
// server.listen(port);
// console.log("Server Running on "+port+".\nLaunch http://localhost:"+port);

var koa = require('koa');
var app = koa();

app.use(function *(){
    this.body = 'Hello World!';
});
console.log("Server Running on http://localhost:3000");
app.listen(3000);