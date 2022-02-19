//Will be used later for logging in and out.
let loggedIn = false, loginAccountID = null; loginAccount = {};
let curMovieID = -1;
let curAccountID = -1;
let curPersonID = -1;
//Parses query string if it exists.
let filterQueryString = curQueryString = "", curQueryArray = [], filterQueryParams = curQueryParams = {};
if(window.location.search) {
    curQueryString = window.location.search.substring(1);
    curQueryArray = curQueryString.split("&");
    for(let i=0; i<curQueryArray.length; i++)   {
        let q = curQueryArray[i].split("=");
        curQueryParams[q[0]] = q[1];
        filterQueryParams[q[0]] = q[1];
    }
    filterQueryString = curQueryString = window.location.search;
}


getMovieList();
getAccountsList();
getPeopleList();
setupFilter();
//alert(window.location.href +"\n" + window.location.search);
console.log(window.location.search);
console.log(curQueryArray); console.log(curQueryParams);
/* let x, y;
if ((curQueryString) && (x = document.getElementById("txtReview")) && (y = document.getElementById("txtRating")))   {
    x.value = curQueryString;
    y.value = 5;
} */

function setupFilter()  {
    let str = "";
    
    let elem = document.getElementById("filterTitleBox");
    if(elem && curQueryParams.title) {
        elem.value = curQueryParams.title;
        str += `Title: ${curQueryParams.title}\n`;
    }
    if(elem) {
        elem.addEventListener('change',updateLists);
        elem.addEventListener('input',updateLists);
    }

    elem = document.getElementById("filterNameBox");
    if(elem && curQueryParams.name) {
        elem.value = curQueryParams.name;
        str += `Name: ${curQueryParams.name}\n`;
    }
    if(elem) {
        elem.addEventListener('change',updateLists);
        elem.addEventListener('input',updateLists);
    }

    elem = document.getElementById("filterGenreBox");
    if(elem && curQueryParams.genre) {
        elem.value = curQueryParams.genre;
        str += `Genre: ${curQueryParams.genre}\n`;
    }
    if(elem) {
        elem.addEventListener('change',updateLists);
        elem.addEventListener('input',updateLists);
    }

    elem = document.getElementById("filterYearBox");
    if(elem && curQueryParams.year) {
        elem.value = curQueryParams.year;
        str += `Year: ${curQueryParams.year}\n`;
    }
    if(elem) {
        elem.addEventListener('change',updateLists);
        elem.addEventListener('input',updateLists);
    }

    elem = document.getElementById("filterRatingBox");
    if(elem && curQueryParams.minrating) {
        elem.value = curQueryParams.minrating;
        str += `Ratings above: ${curQueryParams.minrating}\n`;
    }
    if(elem) {
        elem.addEventListener('change',updateLists);
        elem.addEventListener('input',updateLists);
    }

    if(str) {
        alert(`Showing results for:\n${str}`);
    }

}

//Handles login button.
function updateLists()  {
    //Creates a querystring (based on filter values) for GET requests to update lists
    let str = "", params = [], elem;
    
    elem = document.getElementById("filterTitleBox");
    if(elem && elem.value) {
        params.push(`title=${elem.value}`);
    }
    elem = document.getElementById("filterNameBox");
    if(elem && elem.value) {
        params.push(`name=${elem.value}`);
    }
    elem = document.getElementById("filterGenreBox");
    if(elem && elem.value) {
        params.push(`genre=${elem.value}`);
    }
    elem = document.getElementById("filterYearBox");
    if(elem && elem.value) {
        params.push(`year=${elem.value}`);
    }
    elem = document.getElementById("filterRatingBox");
    if(elem && elem.value) {
        params.push(`minrating=${elem.value}`);
    }
    if(params)  {
        str += "?" + params.join("&");
        filterQueryString = str;
    }

    //console.log(`UPDATED: ${str} \n ${filterQueryString}`);
    getMovieList();
    getAccountsList();
    getPeopleList();
    
}

setInterval(updateLists, 30000);

function getPeopleList()    {
    //Requests list of movie objects from server.
    let peopleList = [];
    let req = new XMLHttpRequest();

    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            peopleList = JSON.parse(this.responseText).data;
            
            renderPeopleList(peopleList);
            return peopleList;
        }
    }
    
    req.open('GET',"/people"+filterQueryString);
    req.setRequestHeader('Accept','application/json');
    req.send();
    
}

function renderPeopleList(list)    {
    //Updates scrollable list of people on people.html.
    let htmlList = document.getElementById("peopleList");
    if(htmlList==null)   return;
    htmlList.innerHTML = "";
    let str = "";
    for(let i=0; i<list.length; i++) {
        str +=`<li  class="listElement" >`;
        str += `<input type="button" class="input3" id="listElement${list[i].ID}" value="${list[i].Name}" 
        onclick="renderPeopleInfo(this.id)">`;
        str +=`</li>`;
    }
    htmlList.innerHTML = str;
}

function renderPeopleInfo(id)    {
    
    //Updates people info pane on movies.html.
    let elem = document.getElementById(id);
    console.log(elem.value); console.log(elem.id);
    let ID = elem.id.substring(11);
    curPersonID = ID;
    let person = null;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            person = JSON.parse(this.responseText).data;
            let myID = JSON.parse(this.responseText).id;
            console.log(person);
 
            let friends = []
            if(person && person.Followers)  {
                friends = person.Followers;
            }
            
            console.log(friends);
            let friendStatus = document.getElementById("followStatus");
            let friendOptions = document.getElementById("followOptions");


            if(friends.includes(myID))    {
                
                friendStatus.setAttribute("style","color:green;");
                friendStatus.innerHTML = "Following";
                document.getElementById("addPersonButton").value = "Unfollow";
                //friendOptions.innerHTML = '<input id="addPersonButton" class="accountButton" type="button" name="accountButton" value="Unfollow">'
                
                
            } else {
                //console.log("HERE")
                friendStatus.setAttribute("style","color:red;");
                friendStatus.innerHTML = "Not Following";
                document.getElementById("addPersonButton").value = "Follow";
                //friendOptions.innerHTML = '<input id="addPersonButton" class="accountButton" type="button" name="accountButton" value="Follow">'
            }



            let info = document.getElementById("info");
            info.innerHTML = 
            `<p>Name: ${person.Name} <span currentPersonID=${person.ID} style="color:black; visibility: hidden;">${person.ID}</span></p>
            <p>Collaborators: ${person.Collaborators}...</p>
            <p>Movies: ${person.Movies}...</p>
            <a href="/people/${person.ID}" style="font-size: large">Edit/See More</a>
            `; 



            let reviewForm = document.getElementById("elemInputPerson");
            reviewForm.style.visibility = "visible";
            //reviewForm.disabled = false;
        }
    }
    
    req.open('GET',"/people/"+`${ID}`);
    req.setRequestHeader('Accept','application/json');
    req.send();
}

function getMovieList()  {
    //Requests list of movie objects from server.
    let movieList = [];
    let req = new XMLHttpRequest();
    
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            movieList = JSON.parse(this.responseText).data;
            //console.log(movieList);
            renderMovieList(movieList);
            return movieList;
        }
    }
    
    req.open('GET',"/movielist"+filterQueryString);
    req.setRequestHeader('Accept','application/json');
    req.send();
    //console.log(movieList);
    
}

function renderMovieList(list)  {
    //Updates scrollable list of movies on main.html and movies.html.
    let htmlList = document.getElementById("movieList");
    if(htmlList==null)   return;
    htmlList.innerHTML = "";
    let str = "";
    for(let i=0; i<list.length; i++) {
        str +=`<li  class="listElement" >`;
        str += `<input type="button" class="input3" id="listElement${list[i].ID}" value="${list[i].Name}" onclick="renderMovieInfo(this.id)">`;
        str +=`</li>`;
    }
    htmlList.innerHTML = str;
}

function renderMovieInfo(id)  {
    //Updates movie info pane on movies.html.
    //let movieList = getMovieList();
    let elem = document.getElementById(id);
   // console.log(elem.value); console.log(elem.id);
    let ID = elem.id.substring(11);
    curMovieID = ID;

    let movie = null;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            movie = JSON.parse(this.responseText).data;
            //console.log(movie);
 
            let info = document.getElementById("info");
            info.innerHTML = 
            `<p>Name: ${movie.Name} <span id="currentMovieID${movie.ID}" style="color:black; visibility: hidden;">${movie.ID}</span></p>
            <p>Genre: ${movie.Genres.slice(0,15)}...</p>
            <p>Year: ${movie.Year}</p>
            <p>Directors: ${movie.Directors.slice(0,15)}...</p>
            <p>Cast: ${movie.Cast.slice(0,15)}...</p>
            <p>Rating: ${movie.ratingScore}</p>
            <a href="/movielist/${movie.ID}" style="font-size: large">Edit/See More</a>
            `; 

            let reviewForm = document.getElementById("elemInput");
            reviewForm.style.visibility = "visible";
            reviewForm.disabled = false;
        }
    }
    
    req.open('GET',"/movielist/"+`${ID}`);
    req.setRequestHeader('Accept','application/json');
    req.send();
}

function postMovieReview(id)    {
    //Will be used to send POST requests for movie reviews.
}

function putMovie(movieObj)    {
    //Will be used to send PUT requests to add movies.
}


function getAccountsList()  { 
    //Requests list of account objects from server.
    let accountsList = [];
    let req = new XMLHttpRequest();
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            accountsList = JSON.parse(this.responseText).data;
            //console.log("FIRST: "+accountsList);
            renderAccountList(accountsList);
            return accountsList;
        }
    }
    req.open('GET',"/accountlist"+filterQueryString);
    req.setRequestHeader('Accept','application/json');
    req.send();
    //console.log("SECOND: "+accountsList);
    //return accountsList;
}

function renderAccountList(list)  {
    //Updates scrollable list of movies on main.html and movies.html.
    let htmlList = document.getElementById("accountList");
    if(htmlList==null)   return;
    htmlList.innerHTML = "";
    let str = "";
    for(let i=0; i<list.length; i++) {
        str +=`<li  class="listElement" >`;
        str += `<input type="button" class="input3" id="listElement${list[i].ID}" value="${list[i].Name}" onclick="renderAccountInfo(this.id)">`;
        str +=`</li>`;
    }
    htmlList.innerHTML = str;
}

function renderAccountInfo(id)  {
    //Updates account info pane on accounts.html.
    //let itemList = getAccountsList();
    let elem = document.getElementById(id);
    //console.log(elem.value); console.log(elem.id);
    let ID = elem.id.substring(11);
    curID = ID;

    let item = null;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            item = JSON.parse(this.responseText).data;
            let myID = JSON.parse(this.responseText).id;
            //console.log("---RETURNED ARRAY: "); console.log(item); console.log(item.friends); console.log("myID: "+myID);
            let friends = []
            if(item && item.friends)  {
                friends = item.friends;
            }
            console.log(friends);
            let friendStatus = document.getElementById("friendStatus");
            let friendOptions = document.getElementById("friendOptions");
            if(friends.includes(myID))    {
                //console.log("---Set to Green");
                friendStatus.setAttribute("style","color:green;");
                friendStatus.innerHTML = "Friends";
                //friendOptions.innerHTML = '<input id="delFriendButton" class="accountButton" type="button" name="accountButton" value="Remove Friend">'
                document.getElementById("addFriendButton").style.visibility = "hidden";
                
                document.getElementById("delFriendButton").style.visibility = "visible";
            } else {
                //console.log("---Set to Red");
                friendStatus.setAttribute("style","color:red;");
                friendStatus.innerHTML = "Not Friends";
                //friendOptions.innerHTML = '<input id="addFriendButton" class="accountButton" type="button" name="accountButton" value="Add Friend">'
                document.getElementById("addFriendButton").style.visibility = "visible";
                document.getElementById("delFriendButton").style.visibility = "hidden";
                
            }

            let info = document.getElementById("info");
            info.innerHTML = 
            `<p>Name: ${item.Name} 
            <span id="currentAccountID${item.ID}" style="color:black; visibility: hidden;">${item.ID}</span>
            </p>
            <a href="/accountlist/${item.ID}" style="font-size: large">Edit/See More</a>
            `;
            
            let form = document.getElementById("elemInput");
            form.style.visibility = "visible";
            
            
            {/* <p>Genre: ${movie.Genres.slice(0,15)}...</p>
            <p>Year: ${movie.Year}</p>
            <p>ID: ${item.ID}</p>
            <p>Directors: ${movie.Directors.slice(0,15)}...</p>
            <p>Cast: ${movie.Cast.slice(0,15)}...</p>
            <p>Rating:
            </p>`;  */}

        }
    }
    
    req.open('GET',"/accountlist/"+`${ID}`);
    req.setRequestHeader('Accept','application/json');
    req.send();
}