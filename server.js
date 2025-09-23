const express = require("express");
const path = require("path");
const http = require("http");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const database = require("./config/database");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const apiChatRouter = require('./routes/api/chat.route');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'tourism-hanoi-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Remove duplicate session config from admin routes

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

database.connect();

route(app);
app.use('/admin', routeAdmin);
app.use('/api', apiChatRouter);

// app.get("*", (req, res) => {
//   res.status(404).render("client/pages/errors/404", { pageTitle: "404 Not Found" });
// });

const server = http.createServer(app);
(async () => {
  try {
    await database.connect();
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect DB, server not started:', error);
  }
})();

