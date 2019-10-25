require('dotenv').config();

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
}, { timestamps: { createdAt: "date_added" } });

const Video = mongoose.model('video', videoSchema);

/** @returns {Number} */
module.exports.getLength = async () => (await Video.find({})).length;

/** @returns {Promise<vidObject>} */
module.exports.getQueue = async () => {
  const userList = (await Video.find({}));
  return userList;
};

module.exports.pushToQueue = async ({ name, url }) => {
  const newVideo = new Video({ name, url });
  return await newVideo.save();
}

/** @return {vidObject} */
module.exports.pullFromQueue = async () => {
  const pulled_vid = (await Video.find({}).sort({ "date_added": 1 }).limit(1))[0];
  await Video.findByIdAndDelete(pulled_vid.id);
  return pulled_vid;
}
/** @return {vidObject|Error} */
module.exports.removeFromQueue = async (id, name) => {
  if (id)
    return await Video.findByIdAndDelete(id);

  //backup, shouldn't be used normally
  if (name)
    return await Video.findOneAndDelete({ name });

  throw Error("Missing Parameters (Id / Name)");
}

/** @return {Promise<Number>} */
module.exports.clearQueue = async () => (await Video.deleteMany({})).deletedCount;

/**
* @typedef vidObject
* @type {Object}
* @property {String} name
* @property {String} url
*/