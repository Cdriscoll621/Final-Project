
// Dependencies

// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies

// =============================================================
var express = require("express");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

// Sets up the Express App
// =============================================================
var app = express();

var PORT = process.env.PORT || 3000;

// Requiring our models for syncing
var db = require("./models");

require('./config/passport')(passport);

// Sets up all dependecies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(session({secret: 'anystringoftext',
                 saveUninitialized: true,
                 resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Static directory
app.use(express.static("public"));

//View Engine
app.set('view engine', 'ejs')
// Routes
// =============================================================
require("./routes/api-routes.js")(app, passport);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
