require('dotenv').config();
// check if credentials exist
const {
  TTN_USER, TTN_PASS, MONGO_URI,
  YOUTUBE_API_KEY, VIMEO_API_ACCESS_TOKEN,
  VIMEO_API_CLIENT_ID, VIMEO_API_CLIENT_SECRET
} = process.env;

if (
  !TTN_USER || !TTN_PASS || !MONGO_URI ||
  !YOUTUBE_API_KEY || !VIMEO_API_ACCESS_TOKEN ||
  !VIMEO_API_CLIENT_ID || !VIMEO_API_CLIENT_SECRET
) {
  console.log(
    "\nTTN_USER:", TTN_USER,
    "\nTTN_PASS:", TTN_PASS,
    "\nMONGO_URI:", MONGO_URI,
    "\nYOUTUBE_API_KEY:", YOUTUBE_API_KEY,
    "\nVIMEO_API_ACCESS_TOKEN:", VIMEO_API_ACCESS_TOKEN,
    "\nVIMEO_API_CLIENT_ID:", VIMEO_API_CLIENT_ID,
    "\nVIMEO_API_CLIENT_SECRET:", VIMEO_API_CLIENT_SECRET
  );
  console.log('Missing credentials, check .env file');
  process.exit();
}

require('mongoose')
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(error => console.log(`MONGODB CONNECTION ERROR`));

require('./menu')();