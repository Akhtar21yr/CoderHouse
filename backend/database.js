const mongoose = require("mongoose");
function DbConnect() {
  const DB_URL = process.env.DB_URL;

  try {
    mongoose.connect(DB_URL);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("DB connected...");
    });
  } catch (error) {
    console.log('not connect to db',error)
  }
}

module.exports = DbConnect;
