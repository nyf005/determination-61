const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");

//Load Models
require('./models/Member');

//Load Keys
const keys = require("./config/keys");

//Handlebars Helpers
const { formatDate, dateFormat, select, equal, editIcon, deleteIcon } = require('./helpers/functions');


//Map global promises
mongoose.Promise = global.Promise;

//Mongoose Connect
mongoose
  .connect(
    keys.mongoURI,
    {
      useNewUrlParser: true
      // No more necessary
      //   useMongoClient: true
    }
  )
  .then(() => console.log("MongoDB Connecté"))
  .catch(err => console.log(err));

const app = express();

//Passport config
require('./config/passport')(passport);

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", "handlebars");

//Handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    formatDate: formatDate,
    dateFormat: dateFormat,
    select: select,
    equal: equal,
    editIcon: editIcon,
    deleteIcon: deleteIcon
  },
  defaultLayout: 'main'
}));

//Load Routes
const members = require("./routes/members");
const index = require("./routes/index");

//Static folder
app.use(express.static(path.join(__dirname, "public")));

// Method override middleware
app.use(methodOverride("_method"));

//cookie-parser middleware
app.use(cookieParser());

//express-session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

//Passport session middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash message middleware
app.use(flash());

//Set global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.errors_msg = req.flash("errors_msg");
  res.locals.error = req.flash("error");
  res.locals.member = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index/welcome");
});

//Use Routes
app.use("/members", members);
app.use("/index", index)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
