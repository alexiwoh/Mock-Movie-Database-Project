const express = require('express');
const path = require('path');
const fs = require("fs");
let logic = require('./logic.js');
let app = express.Router();
let bodyParser = require('body-parser');
const { Account, findAccountByID } = require('./logic.js');
const { error } = require('console');
let pug = require('pug');
//app.set("view engine", "pug");
//Body parser
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

const moviePageCompiler = pug.compileFile('displayMovie.pug');

//Returns movie data.
app.get('/', function(req, res, next)  {
    if(req.get('Accept')!='application/json')   {
        //console.log("QUERY:"+req.url);
        res.redirect('/Content/movies.html'+req.url.substring(1));
        return next();
    }
    
    //Parses query parameters.
    let title = "", genre = "", year = -1, minRating = 0;
    if(req.query.title) { title = req.query.title; }
    if(req.query.genre) { genre = req.query.genre; }
    if(req.query.year) { 
        try { year = Number(req.query.year); }
        catch { year = -1; }
    }
    if(req.query.minrating) { 
        try { minRating = Number(req.query.minrating); }
        catch { minRating = 0; }
    }
    //console.log(`title: "${title}", genre: "${genre}", year: ${year}, minRating: ${minRating}.`);
    let movies = logic.moviesList;
    let filteredMovies = [];
    for(let i=0; i<movies.length; i++)  {
        let m = movies[i];
        //Compares query parameters to movie values.
        if(title!="")   {
            if(!(m.Name.toLowerCase().includes(title.toLowerCase())))  {
                continue;
            }
        }
        if(genre!="")   {
            if(! (m.Genres.toLowerCase().includes(genre.toLowerCase()))) {
                continue;
            }
        }
        if(year>=0)     {
            if(m.Year!=year)    {
                continue;
            }
        }
        if(minRating>0)     {
            if(m.ratingScore<minRating)    {
                continue;
            }
        }
        //If movie passes all tests, add to export array.
        let n = JSON.parse(JSON.stringify(m));
        n.MovieJSON = "";
        filteredMovies.push(n);
    }

    res.send({data:filteredMovies});
    
    next();
});
//Returns movie with specific ID.
app.get('/:ID', function(req, res, next)  {
    //console.log(req.session);
    if(req.params.ID)    {
        
        let id;
        try {
            id = Number(req.params.ID);
            req.session.selectedMovieID = id;
            let movie = logic.findMovieByID(id);
            if(req.get('Accept')!='application/json' && movie)   {
                console.log("QUERY:"+req.url);
                res.setHeader('Content-Type','text/html');
                res.send(moviePageCompiler({data:movie, dataType: "movie"}));
                
                return next();
            }

            res.send({data:movie});
        } catch {
            res.status(404).send({data:logic.moviesList});
        }
    } else { 
    res.send({data:logic.moviesList});
    }
    next();
});
//Returns attribute value for a movie object.
app.get('/:ID/:Attribute', function(req, res, next)  {
    //console.log(req.session);
    if(req.params.ID && req.params.Attribute)    {
        //console.log("---ID: "+req.params.ID+" Attr: "+req.params.Attribute); //Debug.
        
        let attr = req.params.Attribute;
        try {
            let id = Number(req.params.ID);
            req.session.selectedMovieID = id;
            let a = logic.findMovieByID(id)[attr+""];
            if(a) {
                res.send({data:a});
            }
        } catch {
            res.status(404).send({data:logic.moviesList});
        }
    } else { 
    res.send({data:logic.moviesList});
    }
    next();
});


//Adds a movie.
app.post('/addMovie', function(req, res, next)  {
    //console.log(req.session);
    let movieInfo = req.body;
    console.log(movieInfo)
    let acc = logic.findAccountByAttribute("sessionID", req.session.id);
    let movie = logic.Movie();
    movie.Name=movieInfo.txtName; movie.Genres=movieInfo.txtGenres;
    movie.Year=movieInfo.txtYear; movie.Directors=movieInfo.txtDirectors;
    movie.Cast=movieInfo.txtCast; movie.Writers=movieInfo.txtWriters;
    if(!acc) {
        movie.Ratings=[{Source:movieInfo.txtReview,Value:movieInfo.txtRating}];
    } else {
        movie.Ratings=[{Source:movieInfo.txtReview,Value:movieInfo.txtRating,
        AccountID: acc.ID, AccountName: acc.Name}];
    }
    if(logic.addMovie(movie))   {
        if(acc) {
            for(let i=0; i<acc.userFollowers.length; i++)   {
                let a = logic.findAccountByID(acc.userFollowers[i]);
                if(!a)  continue;

                a.notifications.push(`User "${acc.Name}" added a movie: "${movie.Name}"!`);
            }
        }

        res.send("MOVIE ADDED");
    } else  {
        res.send("MOVIE NOT ADDED");
    }
    
    next();
});

//Adds a review.
app.post('/addReview', function(req, res, next)  {
    //console.log(req.session);
    let reviewInfo = req.body;
    if(!reviewInfo || !req.session.login || !req.session.id) {
        console.log("---PLEASE LOGIN");
        res.status(200).send("PLEASE LOGIN"); return next();
    }
    let movie = movieID = null;
    movieID = req.session.selectedMovieID;
    let review = logic.Review();
    if(movieID==null)   {
        console.log("--->INCOMPLETE REV SESSION DATA");
        res.status(200).send("SELECT OPTION"); return next();    
    }
    let acc = logic.findAccountByAttribute("sessionID", req.session.id);
    try    {
        movie = logic.findMovieByID(movieID);
        review.AccountID = acc.ID;
    }
    catch   {
        console.log("--->INCOMPLETE REV SESSION DATA");
        res.status(200).send("SELECT OPTION"); return next();
    }

    if(!acc.contributor)    {
        console.log("---CHANGE ACCOUNT TO CONTRIBUTOR");
        res.status(200).send("MUST BE CONTRIBUTOR"); return next();
    }
    
    //console.log(reviewInfo);
    
    review.rating = reviewInfo.txtRating; review.review = reviewInfo.txtReview;
    review.AccountID = acc.ID; review.AccountName = acc.Name; 
    review.fullReview = reviewInfo; review.Movie = movie.Name;
    logic.addReview(review);
    let r = {Source: reviewInfo.txtReview, Value: reviewInfo.txtRating, 
    AccountID: acc.ID, AccountName: acc.Name};
    movie.Ratings.push(r);
    logic.addItemID(acc.movieReviews,review.ID);
    logic.setAverageRating(movie);

    if(acc) {
        for(let i=0; i<acc.userFollowers.length; i++)   {
            let a = logic.findAccountByID(acc.userFollowers[i]);
            if(!a)  continue;

            a.notifications.push(`User "${acc.Name}" added a review to movie: "${movie.Name}"!`);
        }
    }
    
    res.status(200).send("REVIEW ADDED");
    
    next();
});

module.exports = app; 