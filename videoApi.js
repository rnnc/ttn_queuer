const axios = require('axios');
const Vimeo = require('vimeo').Vimeo;

const YOUTUBE_REGEX_VIDEO = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
const GOOGLEDRIVE_REGEX = /(?:.*)(?:drive\.google\.com\/file\/d\/|open\?id=|docs.google.com\/file\/d\/)([-\w]{25,})(?:.*)/;
const DAILYMOTION_REGEX = /^.*(dailymotion.com\/video\/|dai\.ly\/)([^_]+).*/;
const VIMEO_REGEX = /^.*(?:vimeo.com)\/(?:channels\/|channels\/\w+\/|groups\/[^\‌​/]*\/videos\/|album\‌​\d+\/video\/|video\‌​|)(\d+)(?:$|\/|\?)/;

const {
  YOUTUBE_API_KEY,
  VIMEO_API_CLIENT_ID, VIMEO_API_CLIENT_SECRET,
  VIMEO_API_ACCESS_TOKEN
} = process.env;

/** @returns {Promise<String>} */
module.exports.getVideoName = async (url) => {

  const vidSource = detectSource(url);
  try {
    switch (vidSource) {
      case "youtube":
        return getVideoNameYoutube(url);

      case "dailymotion":
        return getVideoNameDailymotion(url);

      case "vimeo":
        return getVideoNameVimeo(url);

      case "drive":
        return getVideoNameDrive(url);

      case "error":
        throw "Video source unrecognized";

      default:
        throw "Switch conditional error"
    }
  } catch (e) { throw `${e} (videoApi)` }
}

/**
 * @param {String} url
 * @return {Boolean}
 */
module.exports.validateUrl = (url) => {

  const vid_src = detectSource(url);
  const video_id = getVideoId(url, vid_src);

  if (vid_src === "youtube") {
    if (video_id.length === 11)
      return true;
    return false;
  }

  if (vid_src === "vimeo") {
    if (video_id.length > 6 && video_id.length <= 9)
      return true;
    return false;
  }

  if (vid_src === "dailymotion") {
    if (video_id.length === 7)
      return true;
    return false;
  }

  if (vid_src === "drive") {
    if (video_id.length >= 32)
      return true;
    return false;
  }

  throw "Source not found";

}

/**
 * @param {String} url
 * @return {String|Boolean}
*/
function detectSource(url) {

  if (url.includes("youtu"))
    return "youtube"
  if (url.includes("dailymotion") || url.includes("dai.ly"))
    return "dailymotion"
  if (url.includes("vimeo"))
    return "vimeo"
  if (url.includes("google"))
    return "drive"

  return "error";
}

/**
 * @param {String} url
 * @param {String} source
 * @return {String|Error}
 */
function getVideoId(url, source) {
  if (!source)
    throw "source required";

  if (source == "youtube") {
    const videoId = YOUTUBE_REGEX_VIDEO.exec(url)[2];
    if (!videoId)
      throw "Video link parsing error - Youtube";
    return videoId;
  }

  if (source == "vimeo") {
    const videoId = VIMEO_REGEX.exec(url)[1];
    if (!videoId)
      throw "Video link parsing error - Vimeo";
    return videoId;
  }

  if (source == "dailymotion") {
    const videoId = DAILYMOTION_REGEX.exec(url)[2];
    if (!videoId)
      throw "Video link parsing error - Dailymotion";
    return videoId;
  }

  if (source == "drive") {
    const videoId = GOOGLEDRIVE_REGEX.exec(url)[1];
    if (!videoId)
      throw "Video link parsing error - Google Drive";
    return videoId;
  }

  throw "Invalid video source";
}

/** @returns {Promise<String>} */
async function getVideoNameYoutube(url) {

  const videoId = getVideoId(url, "youtube");

  const reqUrl = "https://www.googleapis.com/youtube/v3/videos?"
    + `part=snippet&fields=items(snippet(title))&id=${videoId}`
    + `&key=${YOUTUBE_API_KEY}`;

  return (await axios.get(reqUrl)).data.items[0].snippet.title;
}

/** @returns {Promise<String>} */
function getVideoNameVimeo(url) {

  const videoId = getVideoId(url, "vimeo");
  const vimeo_api = new Vimeo(VIMEO_API_CLIENT_ID, VIMEO_API_CLIENT_SECRET, VIMEO_API_ACCESS_TOKEN)

  return new Promise((resolve, reject) => {
    vimeo_api.request({ path: `/videos/${videoId}` },
      (error, body) => {
        if (error) reject(JSON.parse(error.message))
        resolve(body.name)
      })
  })
}

/** @returns {Promise<String>} */
async function getVideoNameDailymotion(url) {

  const videoId = getVideoId(url, "dailymotion");

  const reqUrl = `https://api.dailymotion.com/video/${videoId}?fields=title`;

  return (await axios.get(reqUrl)).data.title;
}

/** @returns {Promise<String>} */
async function getVideoNameDrive(url) {

  const videoId = getVideoId(url, "drive");

  const reqUrl = `https://www.googleapis.com/drive/v3/`
    + `files/${videoId}?fields=name&key=${YOUTUBE_API_KEY}`;

  return (await axios.get(reqUrl)).data.name;
}