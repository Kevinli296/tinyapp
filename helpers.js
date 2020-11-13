// Helper functions ------------------------------------
/**
 * Gets a user based on an email and database input.
 *
 * @param email an email input value to check for.
 * @param db a user database that we search through.
 * @return a user that corresponds to the email input.
 */

const getUserByEmail = (email, database) => {
  let user;
  for (const key in database) {
    if (database[key].email === email) {
      user = key;
    }
  }
  return user;
};

/**
 * Generates a unique alphanumerical ID to be assigned to new users and short URLs.
 * @return a unique 6 character alphanumerical string.
 */

const generateRandomString = () => {
  let result = '';
  let alphanumeric = 'ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

  for (let i = 0; i < 6; i++) {
    let random = (Math.round(Math.random() * (alphanumeric.length - 1)));
    result += alphanumeric[random];
  }
  return result;
};

/**
*
* Generates a URLs object for the corresponding user ID to be displayed/modified on login.
* @param id a userID to check for within urlDatabase.
* @return a URLs object containing the URLs that correspond to the matching userID.
*/

const urlsForUser = (id) => {
  let URLs = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      URLs[url] = { longURL: urlDatabase[url].longURL, userID: id };
    }
  }
  return URLs;
};

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

// Modules to be exported -------------------------------

module.exports = { getUserByEmail, generateRandomString, urlsForUser, urlDatabase, users };