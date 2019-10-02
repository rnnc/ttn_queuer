const ttn_bot = require('@ttn/bot');
const bot = ttn_bot.withAuth(ttn_bot.createBot)({ verbose: true });

const { TTN_USER, TTN_PASS } = process.env;

module.exports.submitVideo = (vidObject) => {

  bot.start()
    .then(() => bot.authenticate(TTN_USER, TTN_PASS))
    .then((user) => {
      console.log('bot : Authenticated');
      return bot.call('videos.submit', { ...vidObject, channel: 'ttn' });
    })
    .then(() => console.log('bot: Submitted Video'))
    .catch(err => console.log(err.message, err.code))
    .finally(() => bot.stop());
}
