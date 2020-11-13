// Helper functions -------------------------------------
const getUserByEmail = (email, database) => {
    let user;
    for (const key in database) {
      if(database[key].email === email) {
          user = key;
    }
  }
  return user;
}

const generateRandomString = () => {
    let result = '';
    let alphanumeric = 'ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  
    for (let i = 0; i < 6; i++) {
      let random = (Math.round(Math.random() * (alphanumeric.length - 1)));
      result += alphanumeric[random];
    }
    return result;
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

const checkMatchingUser = (id, url, database) => {
    let boolean = false;
  for (const key in database) {
    if ((database[key].userID === id) && (database[key].longURL === url)) {
      boolean = true;
    }
  }
  return boolean;
}

//Data --------------------------------------------------
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

module.exports = { getUserByEmail, generateRandomString, urlsForUser, checkMatchingUser, urlDatabase, users};