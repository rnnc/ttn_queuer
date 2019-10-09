const fs = require('fs');

/** @type {[vidObject]} */
const Queue = [];

/** @returns {Array} */
module.exports.getQueue = () => Queue;

/** @param {[vidObject]} vidObjects*/
module.exports.pushToQueue = (vidObjects) => {

  Queue.push(...vidObjects);

}

/** @return {vidObject} */
module.exports.pullFromQueue = () => Queue.unshift();

module.exports.removeFromQueue = (index) => {
  return Queue.splice(index, 1)[0].name;
}

// Backs up queue to json in case
function backupQueue() {
  try {
    fs.writeFileSync('./backup,json', JSON.stringify(Queue, null, 2));
    return true;
  } catch (e) { throw `Error backing up: ${e}` }
}

// restores backedup queue
function restoreQueue() {
  return JSON.parse(fs.readFileSync('./backup.json'));
}

/**
 * @typedef vidObject
 * @type {Object}
 * @property {String} name
 * @property {String} url
*/