# TinyApp Project

TinyApp is a simple full stack web application built with Node and Express that allows users to shorten long URLs. Users can also edit and delete their newly created shortened links.

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- nodemon

## Updates
#### App has been updated to v1.0.1! See bug fixes/changes below.

## Installation

#### Use [NPM](https://www.npmjs.com/package/npm) to install Tinyapp.
```
npm install
```
### Note: 
On installation, you may face an issue with bcrypt. If you do so happen to encounter an issue, one known method to fix this is to:
```
step 1: npm uninstall bcrypt

step 2: npm install bcryptjs
```

## Getting Started
#### To begin using Tinyapp, start your server:
```
nodemon express_server.js
```

PORT is default set to 8080.

#### To run Tinyapp:
```
npm start
```

- Go to http://localhost:8080 to view this app and begin shortening your URLs!

## Bug Fixes/Changes
```
v1.0.1 (Updated 11-14-2020)

- Bugfix: localhost:8080 would not direct to homepage, now redirects properly.
- Change: Accessing links via clicking on shortURLs will now redirect on a new tab.
- Change: New URL inputs previously had a preexisting value. Changed so that now only has a placeholder.
- Change: Decluttered code by removing excessive/redundant comments.
- Change: Adjusted some variable names for better naming conventions.
- Change: Updated README.
```
## Final Product

!["Screenshot of urls page before registration/login"](https://github.com/Kevinli296/tinyapp/blob/master/docs/TinyApp-urls-before-login.jpg?raw=true)

!["Screenshot of urls home page after login"](https://github.com/Kevinli296/tinyapp/blob/master/docs/TinyApp-urls.jpg?raw=true)

!["Screenshot of specific URL info"](https://github.com/Kevinli296/tinyapp/blob/master/docs/TinyApp-url-info.jpg?raw=true)

## License
[MIT](https://choosealicense.com/licenses/mit/)