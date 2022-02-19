
//Gets user account info and renders page.
req = new XMLHttpRequest();
req.onreadystatechange = function()   {
    if(this.status==200&&this.readyState==4)    {
        if(this.responseText)   {
            if(this.getResponseHeader('Content-Type').startsWith("application/json"))  {
                let acc = JSON.parse(this.responseText).data;
                //console.log(acc);
                if(acc)    {
                let info = document.getElementById("info");
                let notificationsBox = document.getElementById("notificationsBox");
                str = 
                `<p>Welcome ${acc.Name}!</p>
                 <p>Username: ${acc.username}!</p>
                 <p>Password: ${acc.password}!</p>
                 <p>Email: ${acc.email}!</p>   
                 <a href="/accountlist/${acc.ID}" style="font-size: large">See My Account Info</a>
                `;
                let friendsList = acc.friends;
                info.innerHTML = str;
                let str2 = "";
                for(let i=0; i<acc.notifications.length; i++)   {
                    str2 += `<p>${acc.notifications[i]}</p>`;
                }
                notificationsBox.innerHTML = `
                <h1>Notifications</h1>
                ${str2}
                `;
                }
            }
        }

    }

}
req.open('GET', '/account/userAccount');
req.send();

//Handles logout link on account.html.
let logoutAccountButton = document.getElementById("logoutOption");
logoutAccountButton.onclick = function() {
    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                //console.log(this.getResponseHeader('Content-Type'));
                window.location.href = `/main.html`;
            }
        }
    }
    req.open('PUT',"/account/logout");
    //req.setRequestHeader('Content-Type','application/json');
    req.send(); 
    
}

//Handles change to contributor account.html.
let contributorButton = document.getElementById("contributorButton");
contributorButton.onclick = function() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                //console.log(this.getResponseHeader('Content-Type'));
                let acc = JSON.parse(this.responseText).data;
                //console.log(acc);
                if(acc)    {
                    if(acc.contributor)
                        alert("You are now a Contributor!"); 
                    else    
                        alert("You are not a Contributor."); 
                }
                //window.location.href = `http://localhost:3000/main.html`;
            } 
        }
    }
    req.open('PUT',"/account/contributor");
    req.send();  
}

//Handles change to contributor account.html.
let deleteButton = document.getElementById("deleteOption");
deleteButton.onclick = function() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function()   {
        if(this.status==200&&this.readyState==4)    {
            if(this.responseText)   {
                //console.log(this.getResponseHeader('Content-Type'));
                let acc = JSON.parse(this.responseText).data; //deleted account.
                //console.log(acc);
                if(acc)    {
                    window.location.href = `/main.html`;
                }
                else    {
                    alert("ACCOUNT NOT DELETED"); 
                }
            }
            else    {
                alert("ACCOUNT NOT DELETED");
            }
        }
    }
    req.open('DELETE',"/account/delete");
    req.send();  
}


