//Alexander Iwoh
//101137400

/* File handles sends form requests from all html files to create new accounts and movies */

//Handles account creation on login.html.
let createAccountButton = document.getElementById("createButton");
if(createAccountButton) {
createAccountButton.onclick = function() {
    
    let req = new XMLHttpRequest();
    let name = document.getElementById("txtboxName").value;
    let username = document.getElementById("txtboxUser").value;
    let password = document.getElementById("txtboxPassword").value;
    let email = document.getElementById("txtboxEmail").value;

    if(!name || !username || !password || !email)   {
        alert("Please fill in all required information");
        return;
    }

    let obj = JSON.stringify({name, username, password, email});
    //console.log(obj);
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                //console.log(this.getResponseHeader('Content-Type'));

                if(this.getResponseHeader('Content-Type').startsWith("text/plain")) {
                    if(this.responseText=="NAME TAKEN")
                        alert("NAME TAKEN!");
                    if(this.responseText=="USERNAME TAKEN")
                        alert("USERNAME TAKEN!");
                    if(this.responseText=="EMAIL TAKEN")
                        alert("EMAIL TAKEN!");
                    return;
                }
                
                let text = JSON.parse(this.responseText);
                //console.log(text);
                alert(`Thank you ${text.Name}!\nAccount Created Successfully!`);
                
            }
        }
    }
    req.open('POST',"/accountlist/createAccount");
    req.setRequestHeader('Content-Type','application/json');
    req.send(obj); 
}
}
//Handles email recovery button.
let requestAccountButton = document.getElementById("recoverButton");
if(requestAccountButton)    {
requestAccountButton.onclick = function() {
    let req = new XMLHttpRequest();
    let email = document.getElementById("txtboxEmail2").value;

    if(!email)  {
        alert("Please fill in required information.");
        return;
    }

    let obj = JSON.stringify({email});
    console.log(obj);
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                
                if(this.getResponseHeader('Content-Type').startsWith("text/plain")) {
                    if(this.responseText=="NO SUCH EMAIL")
                        alert("NO SUCH EMAIL EXISTS!");
                    
                    return;
                }

                let text = JSON.parse(this.responseText);
                //console.log(text);
                alert(`Password for account with email ${text.email} is:\n "${text.password}"!
                \n---THIS IS FOR TESTING PURPOSES ONLY. SHOULD SEND TO ACTUAL EMAIL IN FULL WEBSITE---`);
            }
        }
    }
    req.open('POST',"/accountlist/recoverAccount");
    req.setRequestHeader('Content-Type','application/json');
    req.send(obj); 
}
}

//Handles login on login.html.
let loginAccountButton = document.getElementById("loginButton");
if(loginAccountButton)  {
loginAccountButton.onclick = function() {
    
    let req = new XMLHttpRequest(); 
    let username = document.getElementById("txtboxUser1").value;
    let password = document.getElementById("txtboxPassword1").value;

    if(!username || !password)   {
        alert("Please fill in all required information");
        return;
    }
    let obj = JSON.stringify({username, password});
    console.log(obj);
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                console.log(this.getResponseHeader('Content-Type'));
                
                if(this.getResponseHeader('Content-Type').startsWith("text/plain")) {
                    if(this.responseText=="ALREADY LOGGED IN")  {
                        alert("You are aleady logged in!");
                        window.location.href = `/Content/account.html`;
                    }
                    if(this.responseText=="UNAUTHORIZED")
                        alert("UNAUTHORIZED!");
                    if(this.responseText=="NO SUCH ACCOUNT EXISTS")
                        alert("NO SUCH ACCOUNT EXISTS!");
                    return;
                }
                window.location.href = `/Content/account.html`;
            }
        }
    }
    req.open('PUT',"/account/login");
    req.setRequestHeader('Content-Type','application/json');
    req.send(obj); 
}
}

//Handles add friend on accounts.html.
let addPersonButton = document.getElementById("addPersonButton");
if(addPersonButton) {
addPersonButton.onclick = function()    {
    
    let req = new XMLHttpRequest(); 
    let obj = JSON.stringify({id:addPersonButton.value});
    console.log(obj);
    let friendStatus = document.getElementById("followStatus");
    let friendOptions = document.getElementById("followOptions");
    req.onreadystatechange = function()   {
        
        if(this.status==200&&this.readyState==4)    {
            
            if(this.responseText)   {
                //console.log(this.getResponseHeader('Content-Type'));
                console.log(this.responseText);
                if(this.responseText=="ADDED PERSON") {
                    if(friendStatus.innerHTML!="Following")
                        alert("Following person!");
                    friendStatus.setAttribute("style","color:green;");
                    friendStatus.innerHTML = "Following";
                }
                if(this.responseText=="REMOVED PERSON") {
                    if(friendStatus.innerHTML!="Not Following")   {
                        alert("Unfollowed person.");
                    }
                    friendStatus.setAttribute("style","color:red;");
                    friendStatus.innerHTML = "Not Following";
                }

            }
        }
        if(this.status==201&&this.readyState==4)    {
            if(this.responseText)   {
                console.log(this.getResponseHeader('Content-Type'));
                console.log(this.responseText);
                if(this.responseText=="PLEASE LOGIN")   {
                    window.location.href = `/Content/login.html`;
                    alert("Please login first!");
                }
                if(this.responseText=="SELECT OPTION")
                    alert("Select an account first!");
            }
        }
    }
    req.open('PUT',"/account/followPerson");
    req.setRequestHeader('Content-Type','application/json');
    req.send(obj); 
}
}

//Handles add friend on accounts.html.
let addFriendButton = document.getElementById("addFriendButton");
if(addFriendButton) {
addFriendButton.onclick = function()    {
    let req = new XMLHttpRequest(); 
    let obj = JSON.stringify({id:addFriendButton.value});
    console.log(obj);
    let friendStatus = document.getElementById("friendStatus");
    let friendOptions = document.getElementById("friendOptions");
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                console.log(this.getResponseHeader('Content-Type'));
                console.log(this.responseText);
                if(this.responseText=="ADDED FRIEND") {
                    if(friendStatus.innerHTML!="Friends")
                        alert("Added as friend!");
                    friendStatus.setAttribute("style","color:green;");
                    friendStatus.innerHTML = "Friends";
                }
            }
        }
        if(this.status==201&&this.readyState==4)    {
            if(this.responseText)   {
                console.log(this.getResponseHeader('Content-Type'));
                console.log(this.responseText);
                if(this.responseText=="PLEASE LOGIN")   {
                    window.location.href = `/Content/login.html`;
                    alert("Please login first!");
                }
                if(this.responseText=="SELECT OPTION")
                    alert("Select an account first!");
            }
        }
    }
    req.open('PUT',"/account/addFriend");
    req.setRequestHeader('Content-Type','application/json');
    req.send(obj); 
}
}

//Handles remove friend on accounts.html.
let delFriendButton = document.getElementById("delFriendButton");
if(delFriendButton) {
delFriendButton.onclick = function()    {
    
    let req = new XMLHttpRequest(); 

    let obj = JSON.stringify({id:delFriendButton.value});
    console.log(obj);
    let friendStatus = document.getElementById("friendStatus");
    let friendOptions = document.getElementById("friendOptions");
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                console.log(this.getResponseHeader('Content-Type'));
                console.log(this.responseText);
                if(this.responseText=="REMOVED FRIEND") {
                    if(friendStatus.innerHTML!="Not Friends")   {
                        alert("Removed friend!");
                    }
                    friendStatus.setAttribute("style","color:red;");
                    friendStatus.innerHTML = "Not Friends";
                }
            }
        }
        if(this.status==201&&this.readyState==4)    {
            if(this.responseText)   {
                console.log(this.getResponseHeader('Content-Type'));
                console.log(this.responseText);
                if(this.responseText=="PLEASE LOGIN")   {
                
                    window.location.href = `/Content/login.html`;
                    alert("Please login first!");
                }
                if(this.responseText=="SELECT OPTION")
                    alert("Select an account first!");
            }
        }
    }
    req.open('PUT',"/account/delFriend");
    req.setRequestHeader('Content-Type','application/json');
    req.send(obj);
}
}
//Handles create movie on addMovie.html.
let addMovieButton = document.getElementById("addMovieButton");
if(addMovieButton)  {
addMovieButton.onclick = function()    {
    
    //Takes in input data.
    let txtName, txtGenre, txtYear, txtDirectors, txtCast, txtReview, txtRating, txtWriters, txtPlot, txtRuntime;
    txtName = document.getElementById("txtName").value; console.log(txtName);
    txtGenres = document.getElementById("txtGenres").value;
    txtYear = document.getElementById("txtYear").value;
    txtDirectors = document.getElementById("txtDirectors").value;
    txtCast = document.getElementById("txtCast").value;
    txtReview = document.getElementById("txtReview").value;
    txtRating = document.getElementById("txtRating").value;
    txtWriters = document.getElementById("txtWriters").value;

    if(!(txtName&&txtGenres&&txtYear&&txtDirectors&&txtCast&&txtReview&&txtRating&&txtWriters)) {
        alert("Please fill in all information.");
        return;
    }
    //Checks if year and rating inputs are integers and adjusts their range.
    txtYear = Number(txtYear);
    txtRating = Number(txtRating);
    txtRating = Math.max(0,txtRating); txtRating = Math.min(100,txtRating);
    if(!Number.isInteger(txtYear)  || !Number.isInteger(txtRating))  {
    alert("Please write whole numbers (no decimals) in Year and Score boxes.");
    return;
    }
    txtRating = txtRating + "/100";
    let obj = {txtName, txtGenres, txtYear, txtDirectors, txtCast, txtWriters, txtReview, txtRating};
    console.log(obj);
    obj = JSON.stringify(obj);

    let req = new XMLHttpRequest(); 
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                //console.log(this.getResponseHeader('Content-Type'));
                
                if(this.responseText=="MOVIE ADDED")  {
                    alert("Movie Added!");
                    return;
                }
                if(this.responseText=="MOVIE NOT ADDED")  {
                    alert("Movie Not Added.");
                    return;
                }
                return;
            }
        }
    }
    req.open('POST',"/movielist/addMovie");
    req.setRequestHeader('Content-Type','application/json');
    req.send(obj); 



}
}

let addReviewButton = document.getElementById("addReviewButton");
if(addReviewButton) {
addReviewButton.onclick = function()    {    
    //Takes in input data.
    let txtReview, txtRating; 
    txtReview = document.getElementById("txtReview").value;
    txtRating = document.getElementById("txtRating").value;
    if(!(txtReview&&txtRating)) {
        alert("Please fill in all information.");
        return;
    }
    
    //Checks if rating input is an integer and adjusts its range.
    txtRating = Number(txtRating);
    txtRating = Math.max(0,txtRating); txtRating = Math.min(100,txtRating);
    if(!Number.isInteger(txtRating))  {
        alert("Please write whole number (no decimals) in the Score box.");
        return;
    }
    txtRating = txtRating + "/100";
    let obj = {txtReview, txtRating};
    console.log(obj);
    obj = JSON.stringify(obj);

    let req = new XMLHttpRequest(); 
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                //console.log(this.getResponseHeader('Content-Type'));
                
                if(this.responseText=="PLEASE LOGIN")   {
                    window.location.href = `/Content/login.html`;
                    alert("Please login first!");
                }
                if(this.responseText=="SELECT OPTION")
                    alert("Select an account first!");

                if(this.responseText=="REVIEW ADDED")
                    alert("Review Added!");
                if(this.responseText=="MUST BE CONTRIBUTOR")    {
                    window.location.href = `/Content/account.html`;
                    alert("Must be a contributor to add reviews.");
                }
                    
                return;
            }
        }
    }
    req.open('POST',`/movielist/addReview`);
    req.setRequestHeader('Content-Type','application/json');
    req.send(obj); 
}
}

let createPersonButton = document.getElementById("createPersonButton");
if(createPersonButton) {
    createPersonButton.onclick = function()    {    
        //Takes in input data.
        let txtName;
        txtName = document.getElementById("txtPersonName").value;
        
        if(!txtName) {
            alert("Please fill in all information.");
            return;
        }
        
        let obj = {txtName};
        console.log(obj);
        obj = JSON.stringify(obj);
    
        let req = new XMLHttpRequest(); 
        req.onreadystatechange = function()   {
            if(this.status==200&&this.readyState==4)    {
                if(this.responseText)   {
                    //console.log(this.getResponseHeader('Content-Type'));
                    
                    if(this.responseText=="PLEASE LOGIN")   {
                        window.location.href = `/Content/login.html`;
                        alert("Please login first!");
                    }
    
                    if(this.responseText=="PERSON ADDED")
                        alert("Person Added!");
                    if(this.responseText=="ALREADY EXISTS")
                        alert("Person Already Exists.");
                    if(this.responseText=="MUST BE CONTRIBUTOR")    {
                        window.location.href = `/Content/account.html`;
                        alert("Must be a contributor to add reviews.");
                    }
                        
                    return;
                }
            }
        }
        req.open('POST',`/people/createPerson`);
        req.setRequestHeader('Content-Type','application/json');
        req.send(obj); 
    }
    }