const express = require("express");
const path = require("path");
const http = require("http");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
require("dotenv").config();

const database = require("./config/database");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const apiChatRouter = require('./routes/api/chat.route');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Parse nested fields from forms (e.g. ticket_info[normal], map[lat])
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Support PUT/DELETE from HTML forms via _method
app.use(methodOverride('_method'));

// Minimal request logging for admin troubleshooting
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    if (req.originalUrl.startsWith('/admin')) {
      console.log(`[ADMIN] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    }
  });
  next();
});

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

// 404 - không khớp route nào
app.use((req, res) => {
  res.status(404).render('errors/404'); // views/errors/404.ejs
});

// 500 - error handler 4 tham số
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).render('errors/500', { error: err }); // views/errors/500.ejs
});

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

