 //Alexander Iwoh
//101137400

//Stores reviews, accounts, movies, and people, as well as their ID counters.
reviewsList = []; nextReviewID = 0;
accountsList = []; nextAccountID = 0;
moviesList = []; nextMovieID = 0;
peopleList = []; nextPersonID = 0;
let moviesMap = {}, peopleMap = {}, peopleMapID = {}, accountsMap = {}, accountsMapID = {}, reviewsMapID = {};

let movieData = require("./Public/movie-data-short.json");//Movie data.
let movieDataFull = require("./Public/movie-data.json");//Movie data.

function setAverageRating(movie)  {
    //Calculates movie rating based on all reviews in Ratings array.
    let ratings = movie.Ratings;
    let avg = 0;
    let numRatings = ratings.length;
    for(let i=0; i<numRatings; i++) {
        //Parses rating string.
        let r = ratings[i];
        let rStr = r.Value;
        if(!rStr)   continue;
        let index;
        if((index = rStr.indexOf("/100"))!=-1)    {
            let num = rStr.slice(0,index);
            //console.log(`index[/100]: ${index}, score: "${rStr}" --> ${num}`);
            avg += Number(num)/10;
            continue;
        }
        if((index = rStr.indexOf("/10"))!=-1)    {
            let num = rStr.slice(0,index);
            //console.log(`index[/10]: ${index}, score: "${rStr}" --> ${num}`);
            avg += Number(num);
            continue;
        }
        if((index = rStr.indexOf("%"))!=-1)    {
            let num = rStr.slice(0,index);
            //console.log(`index[%]: ${index}, score: "${rStr}" --> ${num}`);
            avg += Number(num)/10;
            continue;
        }  
    }

    return movie.ratingScore = Number((avg/numRatings).toFixed(1));
}
//Constructor Movie object that stores movie data.
function Movie() { 
    return {
    ID:         nextMovieID,
    Name:       "movie"+nextMovieID,
    Genres:     "",
    Year:       2000,
    Directors:  "",
    Cast:       "",
    Writers:    "",
    Plot:       "...",
    Runtime:    "0 min",
    People:     {},
    Ratings:    [],
    userRatings: [],
    ratingScore:  0,
    Contributors:  [],
    Poster:     "/Content/stockPersonImage.jpg",
    fillInfo:       function()  {
            let pArray = [];

            pArray = this.Directors.split(', ');
            for(let i=0; i<pArray.length; i++)  {
                let p = findPersonByName(pArray[i]);
                if(!p)  continue;
                
                this.People[p.Name] = p.ID;
            }
            pArray = this.Cast.split(', ');
            for(let i=0; i<pArray.length; i++)  {
                let p = findPersonByName(pArray[i]);
                if(!p)  continue;
                this.People[p.Name] = p.ID;
            }
            pArray = this.Writers.split(', ');
            for(let i=0; i<pArray.length; i++)  {
                let p = findPersonByName(pArray[i]);
                if(!p)  continue;
                this.People[p.Name] = p.ID;
            }
        },
    calcRatingScore:    function()  {
            return setAverageRating(this);
        }
    
    }
}
//Constructs Movie objects from .json file data.
function MovieFromJSON(movieObject) { 
    return {
    ID:         nextMovieID,
    Name:       movieObject.Title,
    Genres:     movieObject.Genre,
    Year:       movieObject.Year,
    Directors:  movieObject.Director,
    Cast:       movieObject.Actors,
    Writers:    movieObject.Writer,
    People:     {},
    Ratings:    movieObject.Ratings,
    Poster:     movieObject.Poster,
    Plot:       movieObject.Plot,
    Runtime:    movieObject.Runtime,
    userRatings: [],
    ratingScore:  0,
    Contributors:   [],
    fillInfo:       function()  {
        let pArray = [];
        
        pArray = this.Directors.split(', ');
        for(let i=0; i<pArray.length; i++)  {
            
            let p = findPersonByName(pArray[i]);
            if(!p)  continue;
            this.People[p.Name] = p.ID;
        }
        pArray = this.Cast.split(', ');
        for(let i=0; i<pArray.length; i++)  {
            let p = findPersonByName(pArray[i]);
            if(!p)  continue;
            this.People[p.Name] = p.ID;
        }
        pArray = this.Writers.split(', ');
        for(let i=0; i<pArray.length; i++)  {
            let p = findPersonByName(pArray[i]);
            if(!p)  continue;
            this.People[p.Name] = p.ID;
        }
    },
    MovieJSON:  movieObject

    }
}
//Functions to add, find, and delete movies (by item or by ID).
function addMovie(movie)    {

    if(addItem(moviesList,movie))   {
        
        
        //Creates People objects representing Movie Director.
        let dirArray = []; let castArray = [];
        if(movie.Directors)  {
            
            dirArray = movie.Directors.split(", ");
            for(let i=0; i<dirArray.length; i++)    {
                let np = Person(); let p =dirArray[i];
                np.Name = p;
                addItemID(np.Movies,movie.ID);
                if(addItem(peopleList,np))  {
                    peopleMap[np.Name] = np.ID;
                    peopleMapID[np.ID] = np.Name;
                    nextPersonID++;
                }
            }  
        }
        //Creates People objects for each Cast member.
        if(movie.Cast)  {
            castArray = movie.Cast.split(", ");
            for(let i=0; i<castArray.length; i++)    {
                let np = Person(); let p =castArray[i];
                np.Name = p;
                addItemID(np.Movies,movie.ID);
                if(addItem(peopleList,np))  {
                    peopleMap[np.Name] = np.ID;
                    peopleMapID[np.ID] = np.Name;
                    nextPersonID++;
                }
            }  
        }
        //Creates People objects for each Writer.
        if(movie.Writers)  {
            castArray = movie.Writers.split(", ");
            for(let i=0; i<castArray.length; i++)    {
                let np = Person(); let p =castArray[i];
                np.Name = p;
                addItemID(np.Movies,movie.ID);
                if(addItem(peopleList,np))  {
                    peopleMap[np.Name] = np.ID;
                    peopleMapID[np.ID] = np.Name;
                    nextPersonID++;
                }
            }  
        }
        //Updates People objects' Movie arrays to have this movie's ID.
        for(let i=0; i<moviesList.length; i++)  {
            let mov = moviesList[i];
            for(let j=0; j<peopleList.length; j++)  {
                let p = peopleList[j];
                if(mov.Cast.includes(p.Name) || mov.Directors.includes(p.Name))   {
                    if (!p.Movies.includes(mov.ID))  {
                        p.Movies.push(mov.ID);
                    }
                }
            }
        }

        for(let i=0; i<peopleList.length; i++)  {
            peopleList[i].fillInfo();
        }
        moviesMap[movie.Name] = movie.ID;
        setAverageRating(movie);
        movie.fillInfo();
        nextMovieID++; 
        return true;
    }
    return false;
}
function delMovie(movie)    {
    return delItem(moviesList,movie);
}
function findMovieByID(id)  {
    for(let i=0; i<moviesList.length; i++)  {
        if(moviesList[i].ID==id)    {
            return moviesList[i];
        }
    }
    return null;
}
function delMovieByID(id)  {
    return delItemByID(moviesList,id);
}
//Constructor returning Account object that stores account data.
function Account() {    return {
    ID:                 nextAccountID,
    Name:               "account"+nextAccountID,
    loggedIn:           false,
    contributor:        false, 
    sessionID:          "",
    Age:                0,
    Movies:             [],
    Genres:             [],
    movieReviews:       [], //Key-Value pairs of Movie()-Review().attribute
    personReviews:      [],
    friends:            [],
    userFollowers:      [],
    userFollowing:      [],
    peopleFollowing:    [],
    notifications:      [],
    username:           "account"+nextAccountID,
    password:           "account"+nextAccountID,
    email:              "account"+nextAccountID+"@account.com"

}}
//Functions to add, find, and delete accounts (by item or by ID).
function addAccount(item)    {
    
    if(addItem(accountsList,item)) {
        accountsMap[item.Name] = item.ID;
        accountsMapID[item.ID] = item.Name;
        nextAccountID++; 
    }
}
function delAccount(item)    {
    delItem(accountsList,item);
}
function findAccountByID(id)  {
    for(let i=0; i<accountsList.length; i++)  {
        if(accountsList[i].ID==id)    {
            return accountsList[i];
        }
    }
    return null;
}
function findAccountByCredentials(username, password)   {
    for(let i=0; i<accountsList.length; i++)  {
        if(accountsList[i].username==username && accountsList[i].password==password)    {
            return accountsList[i];
        }
    }
    return null;
}
function findAccountByAttribute(attribute, value)   {
    for(let i=0; i<accountsList.length; i++)  {
        if(accountsList[i][attribute] && accountsList[i][attribute]==value)    {
            return accountsList[i];
        }
    }
    return null;
}
function delAccountByID(id)  {
    return delItemByID(accountsList,id);
}
//Functions to add and delete friends from a user account.
function addFriend(userID, friendID)    {
    let user = findAccountByID(userID);
    let friend = findAccountByID(friendID);
    if(user==null||friend==null)    return false;
    for(let i=0; i<user.friends.length; i++)    {
        if(user.friends[i]==friendID)    return false;
    }
    user.friends.push(friendID); return true;
}
function delFriendByID(userID,friendID)   {
    let user = findAccountByID(userID);
    let friend = findAccountByID(friendID);
    if(user==null||friend==null)    return false;
    

    let index = null;
    for(let i=0; i<user.friends.length; i++)  {
        if(user.friends[i]==friendID)    {
            index = i; 
            break;
        }    
    }
    if(index==null) return false;
    if(user.friends.length == 1)  user.friends.pop();
    user.friends.splice(index,1);
    return true;
}

//Helper methods to generally add and remove items from collections. 
function addItem(collection, item)    {
    if(collection==null || item==null) return false;
    for(let i=0; i<collection.length; i++)  {
        
        if(collection[i].ID==item.ID || collection[i].Name==item.Name)    {
            //console.log("---DID NOT ADD"); 
            return false;
        }  
    }
    collection.push(item); return true;
}
//Helper methods to add movie by ID.
function addItemID(collection, id)    {
    if(collection==null || id==null) return false;
    for(let i=0; i<collection.length; i++)  {
        
        if(collection[i].ID==id)    {
            //console.log("---DID NOT ADD"); 
            return false;
        }  
    }
    collection.push(id); return true;
}
function delItem(collection, item)    {
    if(collection==null || item==null) return;
    let index = null;
    for(let i=0; i<collection.length; i++)  {
        if(collection[i].ID==item.ID && collection[i].Name==item.Name)    {
            index = i; 
            //console.log("---INDEX TO REMOVE: "+index); 
            break;
        }    
    }
    if(index==null) return false;
    if(collection.length == 1)  collection.pop();
    collection.splice(index,1);
    return true;
}
function delItemByID(collection, id)    {
    if(collection==null || id==null) return;
    let index = null;
    for(let i=0; i<collection.length; i++)  {
        if(collection[i].ID==id || collection[i]==id)    {
            index = i; 
            break;
        }    
    }
    if(index==null) return false;
    if(collection.length == 1)  collection.pop();
    collection.splice(index,1);
    return true;
}

//Constructor Person object that stores person data. Person can refer to actors, directors, etc.
function Person() {   
    return {
    ID:         nextPersonID,
    Name:       "person"+nextPersonID,
    Age:        0,
    Movies:     [],
    MovieNames: "",
    Genres:     "",
    GenreList:  "",
    Collaborators:  "",
    CollaboratorList: [],
    Followers:  [],
    Ratings:    {},
    fillInfo:    function() {
        
            let totalStr = "";
            this.Genres = "";
            this.MovieNames = "";
            let movieArr = [];
            for(let i=0; i<this.Movies.length; i++) {
                let mov = findMovieByID(this.Movies[i]);
                if(mov == null) {
                    continue;
                }
                let g = mov.Genres.split(", ");
                for(let i=0; i<g.length; i++)   {
                    if(!this.Genres.includes(g[i]))    {
                        if(g[i] && this.Genres) {
                            this.Genres += ", ";
                        }
                        if(g[i])  {
                            this.Genres += g[i];
                        }
                    } 
                }   
                if(!movieArr.includes(mov.Name)) {
                    if(mov.Name && this.MovieNames)   {
                        this.MovieNames += ", ";
                    }
                    if(mov.Name)    {
                        this.MovieNames += mov.Name;
                        movieArr.push(mov.Name);
                    }
                }

                //console.log("!!!"+mov.Cast);
                let str = "";
                if(mov.Cast && mov.Directors) {
                    str = mov.Cast + ", " + mov.Directors;
                }
                if(mov.Cast && !mov.Directors) str = mov.Cast;
                if(mov.Directors && !mov.Cast) str = mov.Directors;
                if(i<this.Movies.length-1)  str += ", ";
                
                totalStr += str;
            }
            //totalStr = totalStr.split(', ');
            this.Collaborators =  totalStr;
            this.MovieNames = movieArr.join(', ');
        }

    }
}
//Constructor Review object that stores review and rating data.
function Review()   {   return {
    ID:         nextReviewID,
    Name:       "review"+nextReviewID,
    AccountID:    null,
    rating:     0,
    review:     "",
    fullReview: "",
    Movie:  ""
}}
function addPerson(item)    {
    if(addItem(peopleList,item))
        nextPersonID++; 
}
function delPerson(item)    {
    delItem(peopleList,item);
}

function findPersonByID(id) {
    for(let i=0; i<peopleList.length; i++)  {
        if(peopleList[i].ID==id)    {
            
            //peopleList[i].fillInfo();
            return peopleList[i];
        }
    }
    return null;
}
function findPersonByName(name) {
    for(let i=0; i<peopleList.length; i++)  {
        if(peopleList[i].Name==name)    {
            return peopleList[i];
        }
    }
    return null;
}
function addReview(item)    {
    if(addItem(reviewsList,item)) {
        reviewsMapID[item.ID] = item;
        nextReviewID++;
        return true;
    } 
    
    return false;
}
function delReview(item)    {
    delItem(accountsList,item);
}

//Demos business logic.
if(1)   {

//Arbitraty objects for example purposes.
let movie0=Movie(); addMovie(); addMovie(movieB=Movie()); //Debug.
let review0 = Review(); let account0 = Account(); let person0 = Person(); //Debug.

//Adding movies made from from "movie-data-short.json file then prints movie list:
// console.log("\n---Adding movies converted from JSON files.");
addMovie(movie6=MovieFromJSON(movieData[0]));
addMovie(movie7=MovieFromJSON(movieData[1]));
addMovie(movie8=MovieFromJSON(movieData[2]));
addMovie(movie9=MovieFromJSON(movieData[3]));
addMovie(movie9);   //Attempts to add a duplicate movie.
addMovie(movie10=MovieFromJSON(movieData[4]));
addMovie(MovieFromJSON(movieData[5])); addMovie(MovieFromJSON(movieData[6])); addMovie(MovieFromJSON(movieData[7])); addMovie(MovieFromJSON(movieData[8])); addMovie(MovieFromJSON(movieData[9]));
// console.log("\n---Removing movie with ID: 2 (Jumanji)!");
delMovieByID(2); //Removes movie with ID: 2.
// console.log("\n---FIRST THREE MOVIES:\n"); console.log(moviesList[0]); console.log(moviesList[1]); console.log(moviesList[2]);
for(let i=0; i<110; i++)    {
    //Adds more movies.
    addMovie(MovieFromJSON(movieDataFull[i]));
}
/* for(let i=0; i<moviesList.length; i++) {
    //Calculates Rating Score for each movie.
    //setAverageRating(moviesList[i]);
} */
/* for(let i=0; i<peopleList.length; i++)  {
    peopleList[i].fillInfo();
} */




//console.log(peopleMap);

//Creating Accounts then print first four:
// console.log('\n---Create an account named "account0" with username: "" and password: "".');
// console.log('\n---Create an account named "account1" with username: "user" and password: "1234".');
addAccount(account0); addAccount(account1=Account()); account1.username = "user"; account1.password = "user";
let account2=Account(); account2.Name = "Alex Iwoh"; account2.username = "alex"; account2.password = "alex";
addAccount(account2);
let account3=Account(); account3.Name = "Dave McKenney"; account3.username = "dave"; account3.password = "dave";
addAccount(account3);
let account4=Account(); account4.Name = "TA"; account4.username = "TA"; account4.password = "TA";
addAccount(account4);
let account5=Account(); account5.Name = "a"; account5.username = "a"; account5.password = "a"; account5.email = "a";
addAccount(account5);
// console.log("\n---Removing account1!");
delAccountByID(1);
// console.log("\n---ACCOUNTS:\n");  console.log(accountsList[0]);   console.log(accountsList[1]); console.log(accountsList[2]); console.log(accountsList[3]);

//Adding friends (Dave McKenney and TA) to Alex Iwoh.
// console.log("\n---Adding friends (Dave McKenney and TA) to Alex Iwoh :)\n");
addFriend(2,0); addFriend(2,3); addFriend(2,4);
// console.log(accountsList[1]);
//console.log("\n---Deleting friend (Dave McKenney) from Alex Iwoh :(\n");
delFriendByID(2,3); 
// console.log(accountsList[1]);

//Logging in to Alex Iwoh (ID: 3).
//console.log('\n---Logging in to Alex Iwoh (ID: 2) with username "Alexi" and password "101137400":\n');
//console.log("---SUCCESS!\n");
// console.log(accountsList[1]);

//Make Alex Iwoh a contributor.
//console.log("\n---Make Alex Iwoh a contributor!\n");
accountsList[1].contributor=true;
//console.log("---SUCCESS!\n");
//console.log(accountsList[1]);

//console.log("\n^^^SCROLL UP TO SEE SIMULATION OF BUSINESS LOGIC^^^\n");
}
//Initialization script to create accounts.
for(let i=0; i<25; i++) {
    let acc = Account();
    let n = `${String.fromCharCode(65+ Math.round(Math.random()*26))}${String.fromCharCode(65+ Math.round(Math.random()*25))}`;
    acc.Name = `${n}`;
    acc.username = acc.password = acc.email = n;
    addAccount(acc);
    
    
    
}
//Intiailization script to have random accounts add eachother as friends.
 for(let i=0; i<accountsList.length; i++)    {
    let m = Math.floor((Math.random()*0.99)*accountsList.length);
    let a = Math.floor((Math.random()*0.99)*accountsList.length);
    //console.log(`acc1 ID: ${m} and acc2 ID: ${a}`);
    let acc1 = accountsList[m];
    let acc2 = accountsList[a];
    let userID = acc1.ID, selID = acc2.ID, acc = acc1, selAcc = acc2; 
    if(userID==selID)   continue;

    addFriend(userID,selID);
    addItemID(selAcc.userFollowers,userID);
    addItemID(acc.userFollowing,selID);
    addFriend(selID,userID); 

    
} 

//Initialization script to have random accounts follow People.
for(let i=0; i<peopleList.length; i++) {
    let m = Math.floor((Math.random()*0.99)*peopleList.length);
    let a = Math.floor((Math.random()*0.99)*accountsList.length);
    let person = peopleList[m];
    let acc = accountsList[a];
    addItemID(acc.peopleFollowing,person.ID);
    addItemID(person.Followers,acc.ID); 

}

//Initialization script to write reviews for random movies by random users.
for(let i=0; i<moviesList.length; i++) {
    moviesList[i].fillInfo();

    //Write reviews
    let m = Math.floor((Math.random()*0.99)*moviesList.length);
    let a = Math.floor((Math.random()*0.99)*accountsList.length);
    //console.log(`movie ID: ${m} and account ID: ${a}`);
    let movie = moviesList[m];
    let acc = accountsList[a];
    
    let review = Review();
    let reviewInfo = {};
    reviewInfo.txtRating = `${Math.round(Math.random()*100)}/100`;
    reviewInfo.txtReview = `Review by user "${acc.Name}" for movie: "${movie.Name}"`;

    review.rating = reviewInfo.txtRating;
    review.review = reviewInfo.txtReview;
    review.AccountID = acc.ID; 
    review.AccountName = acc.Name; 
    review.fullReview = reviewInfo; review.Movie = movie.Name;
    addReview(review);
    let r = {Source: reviewInfo.txtReview, Value: reviewInfo.txtRating, 
    AccountID: acc.ID, AccountName: acc.Name};
    movie.Ratings.push(r);

    if(!addItemID(acc.movieReviews,review.ID))    {
        /* console.log(`xxxFAILED TO ADD REVIEW ${review.ID} to ${acc.Name}'s List
        Review List: ${acc.movieReviews}`); */
    }
    setAverageRating(movie);

    if(acc) {
        for(let i=0; i<acc.userFollowers.length; i++)   {
            let a = findAccountByID(acc.userFollowers[i]);
            if(!a)  continue;
            
            a.notifications.push(`User "${acc.Name}" added a review to movie: "${movie.Name}"!`);
        }
    }

}



/***********************************************************************************/

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

function returnAccountsWithoutCredentials() {
    let accounts = [];
    for(let i=0; i<accountsList.length; i++)  {
        let acc = JSON.parse(JSON.stringify(accountsList[i]));
        acc.username = "";
        acc.password = "";
        acc.sessionID = "";
        accounts.push(acc);

    }
    return accounts;
}





module.exports = { moviesList, Movie, addMovie, findMovieByID, accountsList, Account, findAccountByID
, returnAccountsWithoutCredentials, findAccountByCredentials, addAccount, findAccountByAttribute,
delAccountByID, addFriend, delFriendByID, Review, addReview, Person, addPerson, peopleList, findPersonByID, findPersonByName, setAverageRating,
moviesMap, peopleMap, accountsMap, accountsMapID, reviewsMapID, peopleMapID, addItem, addItemID, delItem, delItemByID };