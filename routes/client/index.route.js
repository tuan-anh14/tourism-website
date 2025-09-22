const homeRoutes = require("./home.route");
const attractionRoutes = require("./attraction.route");
const accommodationRoutes = require("./accommodation.route");
const cuisineRoutes = require("./cuisine.route");
const entertainmentRoutes = require("./entertainment.route");
const transportationRoutes = require("./transportation.route");

module.exports = (app) => {
  app.use("/", homeRoutes);
  app.use("/attraction", attractionRoutes); 
  app.use("/accommodation", accommodationRoutes);
  app.use("/cuisine", cuisineRoutes);
  app.use("/entertainment", entertainmentRoutes);
  app.use("/transportation", transportationRoutes);
};