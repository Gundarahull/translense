require("dotenv").config();
const express = require("express");
const app = express();
const cors=require('cors');
const db = require("./dbConfig/dbConfig");


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json()) //convertig the request data into json
app.use(express.urlencoded({ extended: true })); //convertig the request data into url encoded


//integrating the routes
app.use('/business',require('./routes/businessInfo.routes'))
app.use('/owner',require('./routes/ownerInfo.route'))


//swagger Document


app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
