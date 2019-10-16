const fs = require('fs');
const FILENAME = "queue_backup.json";

/** @type {[vidObject]} */
const Queue = [];

module.exports.initQueue = restoreQueue;

module.exports.length = () => Queue.length;

/** @returns {Array} */
module.exports.getQueue = () => Queue;

/** @param {[vidObject]} vidObjects*/
module.exports.pushToQueue = (vidObjects) => {
  Queue.push(...vidObjects);
  backupQueue();
}

/** @return {vidObject} */
module.exports.pullFromQueue = () => {
  const pulled_vid = Queue.shift();
  backupQueue();
  return pulled_vid;
};

/**
 * @param {Number} index 
 * @return {String}
*/
module.exports.removeFromQueue = (index) => {
  const rem_name = Queue.splice(index, 1)[0].name;
  backupQueue();
  return rem_name;
}

/** @return {Boolean}*/
module.exports.clearQueue = () => {
  Queue.length = 0;
  backupQueue();
  return (Queue.length === 0)
}

// Backs up queue to json in case
function backupQueue() {
  try {
    fs.writeFileSync(`./${FILENAME}`, JSON.stringify(Queue, null, 2));
    return true;
  } catch (e) { throw `Error backing up:: ${e}` }
}

// restores backedup queue
function restoreQueue() {
  const previous_data = JSON.parse(fs.readFileSync(FILENAME));
  Queue.push(...previous_data);
  return true;
}

/**
 * @typedef vidObject
 * @type {Object}
 * @property {String} name
 * @property {String} url
*/