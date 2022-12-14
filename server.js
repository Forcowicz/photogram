const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASS);
mongoose.connect(DB, { useNewUrlParser: true }).then((conn) => {
  console.log("Database connection successful!");
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}...`);
});
