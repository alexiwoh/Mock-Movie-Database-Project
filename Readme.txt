_____________________________________________________________________________________________________________________________________________________
Alexander Iwoh

Mock Movie Database Project
_____________________________________________________________________________________________________________________________________________________
List of files:

./Public/Public   (Folder)
    accounts-router.js          -   Handles requests to create account, and get account info in JSON form.
    displayMovie.pug            -   Template engine for displaying specific movie pages.
    displayPerson.pug           -   Template engine for displaying specific person pages.
    displaySidebar.pug          -   Template engine for displaying sidebar.
    displayUser.pug             -   Template engine for displaying specific user pages.
    logic.js                    -   Contains all code for business logic as well as website data. (Data will be handled on a database in future)
    login-router.js             -   Handles routes for logging in/out, and manipulating account data such as adding/removing friends, following People, and changing contributor status.
    movies-router.js            -   Handles routes for adding a movie/review and returning movie data in JSON form.
    package.json                -   Contains dependencies for project.
    people-router.js            -   Handles routes for returning Person data, creating a Person, and rendering a Person page template.
    server.js (use node on this!)  -   Server running on (http://127.0.0.1:3000/ or http://localhost:3000/). It handles requests by allowing for account creation/deletion, 
                                    movie creation/deletion, and adding/removing friends. It also handles all 
                                    url-based GET/POST/PUT/DELETE requests: it parses the URL and serves the appropriate html, js, css, etc. file back to the client/browser,
                                    or sends the request to a router page for handling there.
                                    Any path that doesn't exist will redirect to a blank page with an error message. Some helper methods exists to aid the processes.
                                    When the server is run in the terminal the business logic will be simulated by showing the appropriate account/movie objects
                                    after several operations; scroll upwards after running "node server.js" to see this simulation.
    Public/                         (Folder)
        main.html                   -   The main page for website access. Has links that go to the appropriate position of the login page for entering, 
                                        creating, and remebering the password for an account. Also has a scrollable movie(at the bottom) list that will 
                                        display popular movies.
        main.css                    -   Main page stylesheet. Will be reused for other html pages.
        main.js                     -   Javascript file for main page: this is a shared client for multiple html files. Right now it can send 
                                        GET requests to server.js to get movie data and update the main.html and movies.html scrollable lists and movie info panes
                                        when the buttons corresponding to movie names are clicked. Will be responsible for sending POST, PUT, and DELETE requests in the future.
        forms.js                    -   Sends requests for account, movie, review, creation and friends addition/deletion.
        Content/                        (Folder)
            account.css             -   User account stylesheet.
            account.html            -   User's account page. (for now it can be accessed by pressing the "Login" button on login.html page; will change later).
            accounts.html           -   Page that allows you to browse scrollable list (at the bottom of the page) of all user accounts.
            addMovie.html           -   Page that has textboxes to enter info. to add a movie. To access you need to click the "Add Movie" link in the User Account 
                                        page after "logging in" (pressing the login button) from login.html.
            browse.css              -   Shared stylesheet for movies, people, and accounts .html pages.
            login.css               -   Login page stylesheet.
            login.html              -   Login page html. Also features account creation and password forget sections. 
                                        The page scrolls while keeping the sidebar and searchbar static.
            movies.html             -   Page that allows you to browse scrollable list (at the bottom of the page) of all movies.
            people.html             -   Page that allows you to browse scrollable list (at the bottom of the page) of all people.
            stockMovieImage.jpg     -   Stock movie reel image.
            stockPersonImage.jpg    -   Stock person avatar image.

_____________________________________________________________________________________________________________________________________________________

Instructions to run

-   Use "npm install " to install dependencies from package.json.
-   Navigate to ./Public/Public/ then type in "node ./server.js" into terminal.


Note: Recovery email portion does not work for now.

