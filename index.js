require('dotenv').config();
const Queue = require('./queue');

Queue.initQueue();

/* Queue.pushToQueue([
  {name: "v1", url:"l1"},
  {name: "v2", url:"l2"},
  {name: "v3", url:"l3"},
  {name: "v4", url:"l4"}
]) */

const menu = require('./menu');

menu();