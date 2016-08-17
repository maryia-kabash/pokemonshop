(function(){
    "use strict";

    const
        Router = require('koa-router'),

        koa = require('koa'),
        app = koa();


    //Middleware: request logger
    function *reqlogger(next){
        console.log('%s - %s %s',new Date().toISOString(), this.req.method, this.req.url);
        yield next;
    }
    app.use(reqlogger);

    app.use(Router(app));


    app.get('/', function *(){
        this.body = "This is root page ('/')";
    });

    function *account(){
        this.body = "This is account page ('/account')";
    }
    app.get('/account', account);

    const publicRouter = new Router();

    publicRouter.get('/auth/github', function *(){
        console.log("Middleware-style Example");
        this.body = "Authenticate with GitHub OAUTH API (Coming Soon)";
    });

    app.use(publicRouter.middleware());


    app.use(function *(){
        this.body = 'Hello World';
    });

    app.listen(3000);
})();

