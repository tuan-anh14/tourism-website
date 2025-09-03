const express = require("express");
const path = require("path");
const http = require("http");
require("dotenv").config();

const database = require("./config/database");
// const route = require("./routes/client/index.route");
// const routeAdmin = require("./routes/admin/index.route");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

database.connect();

// route(app);
// routeAdmin(app);

// app.get("*", (req, res) => {
//   res.status(404).render("client/pages/errors/404", { pageTitle: "404 Not Found" });
// });

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
