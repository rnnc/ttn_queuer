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

}

// restores backedup queue
function restoreQueue() {

}

/**
 * @typedef vidObject
 * @type {Object}
 * @property {String} name
 * @property {String} url
*/