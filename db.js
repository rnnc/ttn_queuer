require('dotenv').config();

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
}, { timestamps: { createdAt: "date_added" } });

const Video = mongoose.model('video', videoSchema);

/** @returns {Number} */
module.exports.getLength = async () => (await Video.find({})).length;

/** @return {vidObject} */
module.exports.getQueue = async () => (await Video.find({}));

module.exports.pushToQueue = async ({ name, url }) => {
  const newVideo = new Video({ name, url });
  return await newVideo.save();
}

/** @return {vidObject} */
module.exports.pullFromQueue = async () =>
  (await Video.find({}).sort({ "date_added": 1 }).limit(1).exec());

/** @return {vidObject|Error} */
module.exports.removeFromQueue = async (id, name) => {
  if (id)
    return await Video.findByIdAndDelete(id);

  //backup, shouldn't be used normally
  if (name)
    return await Video.findOneAndDelete({ name });

  throw Error("Missing Parameters (Id / Name)");
}

module.exports.clearQueue = async () => (await Video.deleteMany({}));

/**
* @typedef vidObject
* @type {Object}
* @property {String} name
* @property {String} url
*/