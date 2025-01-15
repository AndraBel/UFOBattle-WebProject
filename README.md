# <span style="color:coral"> UFO Battle

## <span style="color:darkorchid">Home

This page introduces the game with a brief description and allows
the user to play it. However, the user must be logged in to start
the game. Even if the play button at the bottom of the first page
or in the navigation bar is clicked, an action will redirect the
user to the login page if they are not logged in.

## <span style="color:cyan">Login

This page implements login functionality using a GET request with
the provided API. The JWT token is stored in session storage for
future actions, along with the user's name, which appears in the
navigation bar when logged in. Once logged
out, the game becomes inaccessible as before. A logged-in user
can set preferences and start the game, while a guest can only
access the homepage and records page from the left side of the navbar and both register and login from the right. If a guest tries to access the Preferences or Play pages, a toastr error will be displayed at the bottom of the screen and a redirection to the login page will me made.

## <span style="color:deeppink">Register

For registration, I ensured the following requirements were met: If the username is already in use, a toastr error is displayed, and the user cannot press the "Register" button or fill out the other inputs until a valid username is chosen. Additionally, the username must not exceed 8 characters. Again, the user cannot proceed with any further actions related to the form until a valid username is entered. Once all the data is valid, the user is redirected to the login page.

## <span style="color:brown">Preferences + Play

A logged-in user can set game preferences, such as the number of UFOs and the game duration (in seconds). By default, the preferences are retrieved from local storage. If none are found, the default values are set to one UFO and 60 seconds for the game duration. The user has three options before starting the game:

1. **Save Local**: Saves the current user's preferences to local storage.
2. **Save Server**: Saves the preferences to a local server implemented with Node.js. For this to work, the server must be started using the `node optionsserver.js` command. This option also saves the preferences in local storage for future use.
3. **Get from Server**: Retrieves the most recently saved preferences from the server.

Once preferences are set, pressing the **Start Game** button redirects the user to the game page, where the game begins immediately. When the timer runs out, the final score is calculated using the given formulas and displayed on the panel.

After the game ends, the user is presented with three choices:

- **Save Score**: Sends a POST request to the API with the user's data to save the score.
- **Play Again**: Restarts the game.
- **Exit**: Redirects the user to the home page.

Additionally, when the timer expires, the missile becomes inactive, preventing further play.

# <span style="color:orange">Records

This page displays the top 10 players ranked by their final scores
using a GET request to the API. The highest-ranking player receives a gold
medal!
For all the pages I used toastr to display errors, warnings and info messages.

