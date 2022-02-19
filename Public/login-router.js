const express = require('express');
let logic = require('./logic.js');
let app = express.Router();
let bodyParser = require('body-parser');
const { findAccountByAttribute } = require('./logic.js');
//Body parser
app.use(express.urlencoded({extended: true})); 
app.use(bodyParser.json());
//Handles login route.
app.put('/login', function(req,res,next)    { 
    //console.log(req.session);
    let body = req.body;
    //console.log(body);
    //console.log(req.session); console.log(req.session.login+", "+req.session.id); console.log(req.session.cookie);
    //res.setHeader('Content-Type','text/plain'); res.status(200).send("ALREADY LOGGED IN"); next();

    if(req.session.login  && req.session.username)  {
        console.log("ALREADY LOGGED IN");
        res.setHeader('Content-Type','text/plain');
        res.status(200).send("ALREADY LOGGED IN"); 
        return next();
    }
    let username = req.body.username, password = req.body.password;
    console.log("user/pass: "+username+", "+password);
    if(username && password) {
        let acc = logic.findAccountByCredentials(username, password);
        //console.log(acc);
        if(acc) {
            req.session.login = true;   req.session.username = username; req.session.Name = acc.Name;
            req.session.userID = acc.ID;
            acc.sessionID = req.session.id; acc.loggedIn = true;
            res.setHeader('Content-Type','application/json');
            res.status(200).send({username, Name: acc.Name}); return next();
        } else {
            console.log("NO SUCH ACCOUNT EXISTS");
            res.setHeader('Content-Type','text/plain'); 
            res.status(200).send("NO SUCH ACCOUNT EXISTS"); return next();
        }

    } else  {
        console.log("UNAUTHORIZED");
        res.setHeader('Content-Type','text/plain');
        res.status(200).send("UNAUTHORIZED"); return next();
    }
    res.send(); next();
});
//Handles logout.
app.put('/logout', function(req,res,next)    {
        
        //console.log("LOGGED IN. SHOULD I LOG OUT?");
        let acc = logic.findAccountByAttribute("sessionID", req.session.id);
        //console.log(acc);
        
        if(acc) {
            acc.sessionID = ""; acc.loggedIn = false;
        }
        req.session.login = false;   req.session.username = ""; req.session.Name = "";
        req.session.destroy();
        return next(); 
    
    console.log("NOT LOGGED IN");
    return next();
});

app.get('/userAccount', function(req,res,next)    {
    if(req.session.login && req.session.username)   {
        //console.log("LOGGED IN. WANT INFO?");
        let acc = logic.findAccountByAttribute("sessionID", req.session.id);
        //console.log(acc);
        res.setHeader('Content-Type','application/json');
        res.status(200).json({data:acc});
        return next(); 
    }
    //console.log("NOT LOGGED IN; CANNOT GET INFO");
    res.status(200).json({});
    return next();
});
//Changes contributor status.
app.put('/contributor', function(req,res,next)    {
    //console.log(req.session);
    if(req.session.login && req.session.username)   {
        console.log("CHANGE CONTRIBUTOR STATUS?");
        let acc = logic.findAccountByAttribute("sessionID", req.session.id);
        console.log(acc);
        res.setHeader('Content-Type','application/json');
        if(acc) {
            acc.contributor = !acc.contributor;
            res.status(200).json({data:acc});
        } else  {
            res.status(200).json({});
        }
        
        return next(); 
    }
    console.log("NOT LOGGED IN; CANNOT CHANGE CONTRIBUTOR STATUS");
    res.status(200).json({});
    return next();
});
//Deletes account.
app.delete('/delete', function(req,res,next)    {
    
    //console.log("LOGGED IN. SHOULD I LOG OUT?");
    let acc = logic.findAccountByAttribute("sessionID", req.session.id);
    let acc2 = JSON.parse(JSON.stringify(acc));
    console.log(acc);
    if(acc) {
        acc.sessionID = ""; acc.loggedIn = false;
        logic.delAccountByID(acc.ID);
    }
    req.session.login = false;   req.session.username = ""; req.session.Name = "";
    req.session.selectedAccountID = req.session.selectedMovieID = "";
    req.session.destroy();
    res.status(200).json({data:acc2});
    return next(); 

console.log("NOT LOGGED IN");
return next();
});

app.put('/followPerson', function(req,res,next)  {
    //console.log(`Person ID: ${req.body.id}`);
    if(!req.session.login) {
        console.log("---PLEASE LOGIN");
        res.status(201).send("PLEASE LOGIN"); return next();
    }
    let userID = selID = acc = null;
    //console.log(ID);
    try {
        acc = logic.findAccountByAttribute("sessionID", req.session.id);
        userID = acc.ID;
        selID = Number(req.session.selectedPersonID);
    } catch {
        console.log("--->INCOMPLETE ADD PERSON DATA");
        res.status(201).send("SELECT OPTION"); return next();
    }
    let selAcc = logic.findPersonByID(selID);
    if(!selAcc) selID = null;

    if(acc && userID!=null && selID!=null && userID!=selID) {
        if(!selAcc.Followers.includes(userID))  {
            logic.addItemID(acc.peopleFollowing,selID)
            logic.addItemID(selAcc.Followers,userID);
            res.status(200).send("ADDED PERSON");
        } else {
            console.log("UNFOLLOWING");
                logic.delItemByID(acc.peopleFollowing, selID);   
                logic.delItemByID(selAcc.Followers,userID);
                
                res.status(200).send("REMOVED PERSON");
        }
        
    }
    
    next();
})

app.put('/addFriend', function(req, res, next)  {
    //console.log(req.session);
    if(!req.session.login) {
        console.log("---PLEASE LOGIN");
        res.status(201).send("PLEASE LOGIN"); return next();
    }
    let userID = selID = acc = null;
    //console.log(ID);
    try {
        acc = logic.findAccountByAttribute("sessionID", req.session.id);
        userID = acc.ID;
        selID = Number(req.session.selectedAccountID);
    } catch {
        console.log("--->INCOMPLETE ADD SESSION DATA");
        res.status(201).send("SELECT OPTION"); return next();
    }
    let selAcc = logic.findAccountByID(selID);
    if(!selAcc) selID = null;

    console.log("---PREPARING TO ADD FRIEND");
    if(acc && userID!=null && selID!=null && userID!=selID) {
        logic.addFriend(userID,selID);
        logic.addItemID(selAcc.userFollowers,userID);
        logic.addItemID(acc.userFollowing,selID);
        logic.addFriend(selID,userID);
        res.status(200).send("ADDED FRIEND");
    }
    next();
});

app.put('/delFriend', function(req, res, next)  {
    //console.log(req.session);
    if(!req.session.login) {
        console.log("---PLEASE LOGIN");
        res.status(201).send("PLEASE LOGIN"); return next();
    }
    let userID = selID = acc = null;
    try {
        acc = logic.findAccountByAttribute("sessionID", req.session.id);
        userID = acc.ID;
        selID = Number(req.session.selectedAccountID);
    } catch {
        console.log("--->INCOMPLETE DEL SESSION DATA");
        res.status(201).send("SELECT OPTION"); return next();
    }
    let selAcc = logic.findAccountByID(selID);
    if(!selAcc) selID = null;
    
    console.log("---PREPARING TO REMOVE FRIEND");
    if(acc && userID!=null && selID!=null && userID!=selID) {
        logic.delFriendByID(userID,selID);
        logic.delFriendByID(selID,userID);
        logic.delItemByID(selAcc.userFollowers,userID);
        logic.delItemByID(acc.userFollowing,selID);
        res.status(200).send("REMOVED FRIEND");
    }
    next();
});

module.exports = app;