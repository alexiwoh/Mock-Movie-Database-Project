const express = require('express');
const path = require('path');
const fs = require("fs");
let logic = require('./logic.js');
let app = express.Router();
let bodyParser = require('body-parser');
let pug = require('pug');
const accountPageCompiler = pug.compileFile('displayUser.pug');
//Body parser 
app.use(express.urlencoded({extended: true})); 
app.use(bodyParser.json());

//Returns account data without credentials.
app.get('/', function(req, res, next)  {
    //Redirects request if it does not Accept JSON.
    if(req.get('Accept')!='application/json')   {
        //console.log("QUERY---STR: "+req.url)
        res.redirect('/Content/accounts.html'+req.url.substring(1));
        return next();
    }
    let name = "";
    if(req.query.name)  { name = req.query.name; }
    let people = logic.returnAccountsWithoutCredentials();
    let filteredPeople = [];
    for(let i=0; i<people.length; i++)  {
        let p = people[i];
        //Compares query parameters to people values.
        if(name!="")   {
            if(!(p.Name.toLowerCase().includes(name.toLowerCase())))  {
                continue;
            }
            
        }
        //If person passes all tests, add to export array.
        let n = JSON.parse(JSON.stringify(p));
        filteredPeople.push(n);
    }


    res.send({data:filteredPeople});
    next();
});
//Returns account with specific ID.
app.get('/:ID', function(req, res, next)  {
    //console.log(req.session);
    if(req.params.ID)    {
        let id;
        try {
            id = Number(req.params.ID);
            let acc = logic.findAccountByID(id);
            req.session.selectedAccountID = id;
            let acc2 = JSON.parse(JSON.stringify(acc));
            acc2.username = acc2.password = acc2.sessionID = "";

            if(req.get('Accept')!='application/json' && acc2)   {
                console.log("QUERY:"+req.url);
                res.setHeader('Content-Type','text/html');
                let pMap = JSON.parse(JSON.stringify(logic.peopleMap));
                let mMap = JSON.parse(JSON.stringify(logic.moviesMap));
                //console.log(pMap)
                res.send(accountPageCompiler({data:acc2, accountsMap: logic.accountsMapID, reviewsMap: logic.reviewsMapID, moviesMap: mMap, peopleMap: pMap, peopleMapID: logic.peopleMapID, dataType: "user"}));
                
                return next();
            }

            res.send({data:acc2, id: req.session.userID});
        } catch {
            res.status(200).send({data:logic.returnAccountsWithoutCredentials()});
        }
    } else { 
    res.send({data:logic.returnAccountsWithoutCredentials()});
    }
    next();
});
//Returns attribute value for an account object.
app.get('/:ID/:Attribute', function(req, res, next)  {
    //console.log(req.session);
    if(req.params.ID && req.params.Attribute)    {
        
        
        let attr = req.params.Attribute;
        try {
            console.log("---ID: "+req.params.ID+" Attr: "+req.params.Attribute); //Debug.
            let id = Number(req.params.ID);
            let acc2 = logic.findAccountByID(id);
            let acc = JSON.parse(JSON.stringify(acc2));
            req.session.selectedAccountID = id;
            acc.username = acc.password = acc.sessionID = "";
            console.log("Acc: "+acc);
            let a = acc[attr+""];
            if(a) {
                res.send({data: a});
            }
        } catch {
            res.status(200).send({data: logic.returnAccountsWithoutCredentials()});
        }
    } else { 
        res.send({data: logic.returnAccountsWithoutCredentials()});
    }
    next();
});
//Handles create account form data.
app.post('/createAccount', function(req,res,next)   {
     
    let body = req.body;
    
    if(body.username && body.password && body.email) {
        let acc = logic.Account();
        acc.Name = body.name; acc.username = body.username; acc.password = body.password; acc.email = body.email;
        if(logic.findAccountByAttribute("Name",acc.Name))   {
            
            res.setHeader('Content-Type','text/plain');
            res.send("NAME TAKEN"); next(); return;
        }
        if(logic.findAccountByAttribute("username",acc.username))   {
            
            res.setHeader('Content-Type','text/plain');
            res.send("USERNAME TAKEN"); next(); return;
        }
        if(logic.findAccountByAttribute("email",acc.email))   {
            
            res.setHeader('Content-Type','text/plain');
            res.send("EMAIL TAKEN"); next(); return;
        } 

        logic.addAccount(acc);
        acc = logic.findAccountByCredentials(body.username, body.password);
        //console.log(acc);
        if(acc) {
        
        res.send(acc);
        //console.log("---SUCCESS");
        next()
        }
    }
    res.send();
    next();
   
});
//Handles create account form data.
app.post('/recoverAccount', function(req,res,next)   {
    //console.log(req.session);
    let body = req.body;
    
    if(body.email) {
        
        let acc = logic.findAccountByAttribute("email",body.email);
        
        if(acc) {
        //console.log("---ACCOUNT RETURNED: "+acc.Name+", "+acc.password);
        res.send(acc);
        //console.log("---SUCCESS");
        next()
        } else  {
            res.setHeader('Content-Type','text/plain');
            res.send("NO SUCH EMAIL"); next(); return;
        }
    }
    res.send();
    next();
   
});



module.exports = app; 