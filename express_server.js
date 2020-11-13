// Node dependencies/exports ----------------------------

const { getUserByEmail, generateRandomString, urlsForUser, urlDatabase, users } = require('./helpers'); // Importing our helper functions
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; // Default port 8080

// Dependency setups for use ----------------------------

app.use(bodyParser.urlencoded({extended: true}));
// Using cookie-session middleware to manage user sessions
app.use(cookieSession({
  name: 'session',
  // Using one session key.
  keys: ['YEET']
}));

// Setting view engine ----------------------------------

app.set('view engine', 'ejs');

// Routes -----------------------------------------------

// Makes a GET request to view the homepage.
app.get('/urls', (req, res) => {
  const urls = urlsForUser(req.session["user_id"]);
  const templateVars = { user: users[req.session["user_id"]], urls: urls};
  res.render('urls_index', templateVars);
});

// Makes a GET request to view the new URL creation page.
app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]] };
  //Redirects user to homepage if not signed in.
  if (!users[req.session["user_id"]]) {
    return res.redirect('/urls');
  }
  res.render('urls_new', templateVars);
});

// Makes a GET request to view the registration page.
app.get('/register', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]] };
  res.render('urls_register', templateVars);
});

// Makes a POST request submit a form for new user registration.
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // If there is no email or password input, returns a vague error message.
  // NOTE: all 'Invalid Input' error messages are purposely vague to deter malicious users from gaining any information.
  if (email === '' || password === '') {
    return res.status(400).send('Invalid input.');
  }

  for (const key in users) {
    if (getUserByEmail(email, users) === key) {
      // If the user is attempting to register a new account with an existing email, returns a vague error message.
      return res.status(400).send('Invalid input.');
    }
  }

  const newUserID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  // Creates a new user (key) with the user's information (sub-object value.)
  users[newUserID] = { id: newUserID, email: email, password: hashedPassword };
  // The session cookie's user ID is now defined as a new user's ID.
  req.session["user_id"] = newUserID;
  // Redirects to homepage.
  res.redirect('/urls');
});

// Makes a POST request to submit a form for new URL creation.
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL };
  urlDatabase[shortURL].userID = req.session["user_id"];
  // Redirects to the created short URL page for details and/or edit.
  res.redirect(`/urls/${shortURL}`);
});

// Makes a GET request to view the login page.
app.get('/login', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]] };
  res.render('urls_login', templateVars);
});

// Makes a POST request to submit a form for user login.
app.post('/login', (req, res) => {
  let foundUser = null;
  const email = req.body.email;
  const password = req.body.password;

  // If there is no email or password input, returns a vague error message.
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Invalid input.');
  }

  for (const key in users) {
    // If the user from the helper function matches a user in the database, 
    if (getUserByEmail(email, users) === key) {
      // That matching user is now defined as the found user.
      foundUser = users[key];
    }
  }

  // If there is no found user(null), returns a vague error message.
  if (foundUser === null) {
    return res.send('Invalid input.');
  }

  // If the password input does not match with the hashed password, returns a vague error message.
  // (Condition is checked specifically with bcrypt password comparison function.)
  if (!bcrypt.compareSync(password, foundUser.password)) {
    return res.send('Invalid input.');
  }

  // The session cookie's user ID is now defined as the found user's ID.
  req.session["user_id"] = foundUser.id;
  res.redirect('/urls');
});

// Makes a POST request to submit a form for a user to logout.
app.post('/logout', (req, res) => {
  // The session cookie's user ID will be defined to null to indicate there is no currently signed in user.
  req.session = null;
  // Once logged out, user is redirected to homepage.
  res.redirect('/urls');
});

// Makes a POST request to submit a form for short URL deletion.
app.post('/urls/:shortURL/delete', (req, res) => {
  const databaseUserID = urlDatabase[req.params.shortURL].userID;
  const sessionID = req.session["user_id"];
  // Checks to see if the current session cookie's ID is authorized to delete the short URL.
  if (databaseUserID === sessionID) {
    delete urlDatabase[req.params .shortURL];
    return res.redirect('/urls');
  } else {
    // If not authorized, returns an unauthorized error message.
    return res.status(400).send('You are not authorized to perform this action.');
  }
});

// Makes a POST request to submit a form for editing the short URL.
app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  return res.redirect('/urls');
});

// Makes a GET request to view the website of the short URL.
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  // Redirects user to the website of the short URL.
  res.redirect(longURL);
});

// Makes a GET request to view the page for editing the short URL.
app.get('/urls/:shortURL', (req, res) => {
  const databaseUserID = urlDatabase[req.params.shortURL].userID;
  const sessionID = req.session["user_id"];
  // Checks to see if the current session cookie's ID is authorized to edit the short URL.
  if (databaseUserID === sessionID) {
    const templateVars = {
      user: users[req.session["user_id"]],
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]
    };
    res.render('urls_show', templateVars);
  } else {
    // If not authorized, returns an unauthorized error message.
    res.send('You are not authorized to perform this action.');
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// --------------------------------------------------------------------