// Helper functions ------------------------------------
/**
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

const urlDatabase = {};

const users = {};

// Modules to be exported -------------------------------

module.exports = { getUserByEmail, generateRandomString, urlsForUser, urlDatabase, users };