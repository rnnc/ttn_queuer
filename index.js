require('dotenv').config();
// check if credentials exist
const {
  FILENAME, TTN_USER, TTN_PASS,
  YOUTUBE_API_KEY, VIMEO_API_ACCESS_TOKEN,
  VIMEO_API_CLIENT_ID, VIMEO_API_CLIENT_SECRETS
} = process.env;

if (
  !FILENAME || !TTN_USER || !TTN_PASS ||
  !YOUTUBE_API_KEY || !VIMEO_API_ACCESS_TOKEN ||
  !VIMEO_API_CLIENT_ID || !VIMEO_API_CLIENT_SECRETS 
) {
  console.log('Missing credentials, check .env file');
  process.exit();
}


const menu = require('./menu');
const Queue = require('./queue');
const bot = require('./bot');

Queue.initQueue();
menu();