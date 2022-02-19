let express = require('express');
let app = express(); 
let logic = require('./logic.js');
const path = require("path");
const url = require("url"); 
let session = require('express-session');
app.set("view engine", "pug");
app.use(session({secret: "My umm secret"}));
app.use(function(req,res,next){
	/* console.log(req.method);
	console.log(req.url); 
	console.log(req.path);
	console.log(req.get("Content-Type"));  */
	next();
});

//Body parser
app.use(express.urlencoded({extended: true}));


//Router for movie data info.
let moviesRouter = require("./movies-router");
app.use(["/movielist","/movies"], moviesRouter);

//Router for account data info.
let accountsRouter = require("./accounts-router");
app.use(["/accountlist","/users"], accountsRouter);
app.use("/Content/account.html", preventPublicAccess);

//Router for account login/credentialing.
let loginRouter = require("./login-router");
app.use(["/account","login"], loginRouter);

//Router for people data info.
let peopleRouter = require("./people-router");
app.use(["/people","/personlist"], peopleRouter);

//Static server.
app.use(express.static("Public", {index: "main.html"}));

app.listen(3000);
console.log("Server listening at http://localhost:3000");

function preventPublicAccess(req, res, next)    {
    if(req.session.login && req.session.username) {
        return next();
    }
	//return res.write("<p>Unauthorized</p>");  
	return res.redirect("/Content/login.html");
}
