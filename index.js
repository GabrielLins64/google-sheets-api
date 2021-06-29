const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var routes = require('./routes');

routes(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
