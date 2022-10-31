const express = require("express");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const mongoose = require('mongoose')
const query = require("./modules/queries")
// require('dotenv').config()

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use(express.static("express/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });

module.exports = app;
module.exports.handler = serverless(app);