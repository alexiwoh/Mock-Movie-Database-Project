const express = require('express');
const path = require('path');
const fs = require("fs");
let logic = require('./logic.js');
let app = express.Router();
let bodyParser = require('body-parser');
let pug = require('pug');
const personPageCompiler = pug.compileFile('displayPerson.pug');
//Body parser 
app.use(express.urlencoded({extended: true})); 
app.use(bodyParser.json());

//Returns people data.
app.get('/', function(req, res, next)  {
    //Redirects request if it does not Accept JSON.
    if(req.get('Accept')!='application/json')   {
        res.redirect('/Content/people.html'+req.url.substring(1));
        return next();
    }

    let name = "";
    if(req.query.name)  { name = req.query.name; }
    let people = logic.peopleList;
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

//Returns person with specific ID.
app.get('/:ID', function(req, res, next)  {
    //console.log(req.session);
    if(req.params.ID)    {
        let id;
        try {
            let p;
            
            id = Number(req.params.ID);
            req.session.selectedPersonID = id;
            p = logic.findPersonByID(id);
            
            if(req.get('Accept')!='application/json' && p)   {
                //console.log("QUERY:"+req.url);
                res.setHeader('Content-Type','text/html');
                
                let pMap = JSON.parse(JSON.stringify(logic.peopleMap));
                let mMap = JSON.parse(JSON.stringify(logic.moviesMap));
                //console.log(pMap)
                res.send(personPageCompiler({data:p, moviesMap: mMap, peopleMap: pMap, peopleMapID: logic.peopleMapID, accountsMapID: logic.accountsMapID, accountsMap: logic.accountsMap, dataType: "person"}));
                
                return next();
            }
            
            res.send({data:p, id: req.session.userID});
        } catch {
            res.status(404).send({data:logic.peopleList});
        }
    } else { 
    res.send({data:logic.peopleList});
    }
    next();
});

app.post('/createPerson', function(req, res, next)  {

    let info = req.body;
    let acc = logic.findAccountByAttribute("sessionID", req.session.id);
    if(!info || !req.session.login || !req.session.id) {
        console.log("---PLEASE LOGIN");
        res.status(200).send("PLEASE LOGIN"); return next();
    }

    if(!acc.contributor)    {
        console.log("---CHANGE ACCOUNT TO CONTRIBUTOR");
        res.status(200).send("MUST BE CONTRIBUTOR"); return next();
    }
    let p = logic.findPersonByName(info.txtName);
    if(p)   {
        console.log("---PERSON ALREADY EXISTS");
        res.status(200).send("ALREADY EXISTS"); return next();
    }

    p = logic.Person();
    p.Name = info.txtName;
    
    
    if(logic.addPerson(p))  {
        logic.peopleMap[p.Name] = p.ID;
        logic.peopleMapID[p.ID] = p.Name;
    }
    console.log("---PERSON CREATED");
    res.status(200).send("PERSON ADDED"); return next();

    next();
});


module.exports = app;