require('dotenv').config();

//check validation
require('./validation').envVarValidation();

const ttn_bot = require('@ttn/bot');
const bot = ttn_bot.withAuth(ttn_bot.createBot)({ verbose: false });

const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Queue = require('./queue');

const { TTN_USER, TTN_PASS, INTERVAL_DURATION } = process.env;

const DT_FORMAT = 'HH:mm:ss (z) | dd-MM-yyyy';

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
    .catch(err => { throw err })
    .finally(() => bot.stop());
}

async function initBot() {

  const INTERVAL_TIME = (INTERVAL_DURATION) ? INTERVAL_DURATION : 130000;

  setInterval(async () => {
    const start_dt = DateTime.local().setZone("America/Toronto").toFormat(DT_FORMAT);
    console.log("\n :: Started Check [", start_dt, "] ::\n");

    if ((await Queue.getLength()) > 0) {

      const { _id, name, url } = await Queue.pullFromQueue();
      try {
        await submitVideo({ name, url });
        await Queue.removeFromQueue(_id);
        console.log("   -  ", name);
      } catch (error) {
        console.log("  [x] Failed to submit video\n   -  ERROR:", error.message)
      };

    } else console.log('[Queue Empty]');

    const next_dt = DateTime.local().setZone("America/Toronto")
      .plus({ seconds: 130 }).toFormat(DT_FORMAT);
    console.log('\n ::    Be Back by [', next_dt, "] ::\n\t________________\n");


  }, INTERVAL_TIME);

}


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {

    console.log(` ~:: connected to database ::~ \n`);
    initBot();

  }).catch(error => console.log(error));
