// Node dependencies ------------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; // default port 8080

// Data -------------------------------------------------

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234aa"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Dependencies to be used ------------------------------

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['YEET']
}));

// Functions --------------------------------------------

const generateRandomString = () => {
  let result = '';
  let alphanumeric = 'ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

  for (let i = 0; i < 6; i++) {
    let random = (Math.round(Math.random() * (alphanumeric.length - 1)));
    result += alphanumeric[random];
  }
  return result;
};

const checkForEmail = (input) => {
  for (const keys in users) {
    if (users[keys].email === input) {
      return true;
    }
  }
  return false;
};

const urlsForUser = (id) => {
  let tmp = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      tmp[url] = { longURL: urlDatabase[url].longURL, userID: id };
    }
  }
  return tmp;
};

// Setting view engine ----------------------------------

app.set('view engine', 'ejs');

// Routes -----------------------------------------------

app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const urls = urlsForUser(req.session["user_id"]);
  const templateVars = { user: users[req.session["user_id"]], urls: urls};
  if (!req.session["user_id"]) {
    return res.send('You must login before features of this website are accessible.');
  }
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]], urls: urlDatabase };
  if (!users[req.session["user_id"]]) {
    return res.redirect('/urls');
  }
  res.render('urls_new', templateVars);
});

app.get('/register', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]], urls: urlDatabase };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('BAD REQUEST: NO EMAIL/PASSWORD');
  } else if (checkForEmail(req.body.email)) {
    return res.status(400).send('BAD REQUEST: EMAIL EXISTS');
  }

  const newUserID = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[newUserID] = { id: newUserID, email: req.body.email, password: hashedPassword };
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
  const templateVars = { user: users[req.session["user_id"]], urls: urlDatabase };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  let foundUser = null;
  const email = req.body.email;
  const password = req.body.password;

  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Missing Input');
  }

  for (const key in users) {
    if (checkForEmail(email)) {
      foundUser = users[key];
    }
  }

  if (!bcrypt.compareSync(password, foundUser.password)) {
    return res.send('Incorrect password');
  }

  if (foundUser === null) {
    return res.send('no user with that email found');
  }

  req.session["user_id"] = foundUser.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session["user_id"]) {
    delete urlDatabase[req.params .shortURL];
    return res.redirect('/urls');
  }
});

app.post('/urls/:shortURL', (req, res) => {
  if (req.session["user_id"]) {
    urlDatabase[req.params.shortURL] = req.body.longURL;
    return res.redirect('/urls');
  }
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});


app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// ---------------------------------------------------------------------