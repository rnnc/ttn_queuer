require('dotenv').config();

//check validation
require('./validation').envVarValidation();

const ttn_bot = require('@ttn/bot');
const bot = ttn_bot.withAuth(ttn_bot.createBot)({ verbose: false });

const mongoose = require('mongoose');
const luxon = require('luxon');

const { DateTime, Duration } = luxon;
luxon.Settings.defaultLocal = 'America/Toronto';

const Queue = require('./queue');

const { TTN_USER, TTN_PASS, INTERVAL_DURATION } = process.env;

async function submitVideo(vidObject) {
  return bot.start()
    .then(() => bot.authenticate(TTN_USER, TTN_PASS))
    .then((user) => {
      console.log('bot : Authenticated');
      return bot.call('videos.submit', {
        ...vidObject, channel: 'ttn'
      });
    })
    .then(() => console.log('bot : Submitted Video'))
    .catch(err => console.log(err.message, err.code))
    .finally(() => bot.stop());
}

async function initBot() {

  const INTERVAL_TIME = (INTERVAL_DURATION) ? INTERVAL_DURATION : 130000;

  setInterval(async () => {

    if ((await Queue.getLength()) > 0) {

      const { name, url } = await Queue.pullFromQueue();
      await submitVideo({ name, url });

    } else console.log('[Queue Empty]');

    const next_dt = DateTime.local().plus({ seconds: 120 });

    console.log('\n__suspending__\nBe back @',
      next_dt.toFormat('dd-MM-yyyy | HH:mm:ss z'), "\n");

  }, INTERVAL_TIME);

}


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {

    console.log(` ~:: connected to database ::~ \n`);
    initBot();

  }).catch(error => console.log(error));
