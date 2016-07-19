var koa = require('koa');
var app = koa();

// logger

app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

// response

app.use(function *(){
    this.body = 'Hello Pokemon Shop';
});

app.use(function* (next) {
    // skip the rest of the code if the route does not match
    if (this.request.path !== '/') return yield next;

    this.response.body = 'we are at home!';
});

var port = 3000;
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});