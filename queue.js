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