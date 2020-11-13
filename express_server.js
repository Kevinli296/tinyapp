// Node dependencies/exports ----------------------------

const { getUserByEmail, generateRandomString, urlsForUser, urlDatabase, users } = require('./helpers');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; // default port 8080

// Dependencies to be used ------------------------------

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['YEET']
}));

// Setting view engine ----------------------------------

app.set('view engine', 'ejs');

// Routes -----------------------------------------------

app.get('/urls', (req, res) => {
  const urls = urlsForUser(req.session["user_id"]);
  const templateVars = { user: users[req.session["user_id"]], urls: urls};
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]] };
  if (!users[req.session["user_id"]]) {
    return res.redirect('/urls');
  }
  res.render('urls_new', templateVars);
});

app.get('/register', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]] };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    return res.status(400).send('BAD REQUEST: MISSING INPUT');
  }

  for (const key in users) {
    if (getUserByEmail(email, users) === key) {
      return res.status(400).send('BAD REQUEST: EMAIL EXISTS');
    }
  }

  const newUserID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[newUserID] = { id: newUserID, email: email, password: hashedPassword };
  req.session["user_id"] = newUserID;
  res.redirect('/urls');
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL };
  urlDatabase[shortURL].userID = req.session["user_id"];
  res.redirect(`/urls/${shortURL}`);
});

app.get('/login', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]] };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  let foundUser = null;
  const email = req.body.email;
  const password = req.body.password;

  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('BAD REQUEST: MISSING INPUT');
  }

  for (const key in users) {
    if (getUserByEmail(email, users) === key) {
      foundUser = users[key];
    }
  }

  if (foundUser === null) {
    return res.send('BAD REQUEST: NO USER WITH THAT EMAIL FOUND');
  }

  if (!bcrypt.compareSync(password, foundUser.password)) {
    return res.send('BAD REQUEST: INCORRECT PASSWORD');
  }

  req.session["user_id"] = foundUser.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const databaseUserID = urlDatabase[req.params.shortURL].userID;
  const sessionID = req.session["user_id"];
  if (databaseUserID === sessionID) {
    delete urlDatabase[req.params .shortURL];
    return res.redirect('/urls');
  } else {
    return res.status(400).send('BAD REQUEST: NICE TRY :)');
  }
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  return res.redirect('/urls');
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => {
  const databaseUserID = urlDatabase[req.params.shortURL].userID;
  const sessionID = req.session["user_id"];
  if (databaseUserID === sessionID) {
    const templateVars = {
      user: users[req.session["user_id"]],
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]
    };
    res.render('urls_show', templateVars);
  } else {
    res.send('BAD REQUEST: NICE TRY :)');
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// --------------------------------------------------------------------