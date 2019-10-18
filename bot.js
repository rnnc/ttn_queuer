require('dotenv').config();
const fs = require('fs');

const ttn_bot = require('@ttn/bot');
const bot = ttn_bot.withAuth(ttn_bot.createBot)({ verbose: true });

const timer = require('./timer');

const { FILENAME, TTN_USER, TTN_PASS } = process.env;

function getQueue() {
  const queue = JSON.parse(fs.readFileSync(`./${FILENAME}`));
  return queue;
}

function writeQueue(queue) {
  fs.writeFileSync(`./${FILENAME}`, JSON.stringify(queue, null, 2))
}

function pullFromQueue(queue) {
  const pulled_vid = queue.shift();
  writeQueue(queue);
  return pulled_vid;
}

module.exports.initBot = (INTERVAL=120000) => {

  setInterval(() => {
    const queue = getQueue();
    const d = new Date();
    console.log(`[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`);
    if (queue.length == 0) {
      console.log(" || Checked :: Queue Empty ||\n");
    } else {
      const pulled_vid = pullFromQueue(queue);
      submitVideo(pulled_vid);
      writeQueue(queue);
    }
  }, INTERVAL);

}

function submitVideo(vidObject) {
  bot.start()
    .then(() => bot.authenticate(TTN_USER, TTN_PASS))
    .then((user) => {
      console.log('bot : Authenticated');
      return bot.call('videos.submit', {
        ...vidObject, channel: 'ttn'
      });
    })
    .then(() => {
      console.log('bot: Submitted Video');
      console.log(`removing "${vidObject.name}" from queue`);
    })
    .catch(err => console.log(err.message, err.code))
    .finally(() => bot.stop());
}

function testSubmit(vidObject) {

  const { name, url } = vidObject;
  const d = new Date();
  console.log('\n[test submit]\n-------------');
  console.log('name:', name, '\nurl:', url,'\n');
}