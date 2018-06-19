const mongoose = require("mongoose");
const User = require("../models/user");

const dbName = "lab-passport-roles";
mongoose.connect(`mongodb://localhost/${dbName}`);

const boss = [
  {
    username: "boss",
    password: "boss",
    role: "boss"
  }
];

User.deleteMany()
  .then(() => User.create(boss))
  .then(boss => {
    console.log(`close connection boss: `, boss);
    mongoose.connection.close();
  })
  .catch(err => {
    throw err;
  });
