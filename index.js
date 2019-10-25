require('dotenv').config();

// check if credentials exist
require('./validation').envVarValidation();

const mongoose = require('mongoose');
const menu = require('./menu');

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (instance) => {
    //pass mongoose instance to close connection at app exit
    menu(instance);
  })
  .catch(error => console.log(`MONGODB CONNECTION ERROR`));