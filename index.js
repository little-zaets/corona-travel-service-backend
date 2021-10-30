import express from 'express';
import { readdirSync } from 'fs';
import cors from 'cors';
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
require('dotenv').config();

const app = express();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true })); //parse url data of type encoded
app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
	res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.ALLOW_URL
  );
	console.log('here')
  console.log(res);
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Origin"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//serve static files to public
app.use(express.static(__dirname + '/public'));

//route middleware
//get each 'route' file and apply as middleware
readdirSync("./routes").map((r) => {
  app.use("/", require(`./routes/${r}`)); //r is filename
});

//access .env variables
console.log("Database_URL", process.env.DATABASE_URL);
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));   