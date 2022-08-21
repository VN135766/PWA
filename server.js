const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";
/*
1. Go to Mongo Atlas
2. Create the Mongo database for this activity
3. Get the connection string for that database
4. Go to project on Heroku
5. Go to Settings
6. Add a Config Var named MONGODB_URI
7. The value of that var is the connection string from #3 above
8. If you haven't needed to update the repo, just ReDeploy from Heroku
*/

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});