const axios = require('axios');
const Vimeo = require('vimeo').Vimeo;

//testing
require('dotenv').config();

const YOUTUBE_REGEX_VIDEO = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
const GOOGLEDRIVE_REGEX = /(?:.*)(?:drive\.google\.com\/file\/d\/|open\?id=|docs.google.com\/file\/d\/)([-\w]{25,})(?:.*)/;
const DAILYMOTION_REGEX = /^.*(dailymotion.com\/video\/|dai\.ly\/)([^_]+).*/;
const VIMEO_REGEX = /^.*(?:vimeo.com)\/(?:channels\/|channels\/\w+\/|groups\/[^\‌​/]*\/videos\/|album\‌​\d+\/video\/|video\‌​|)(\d+)(?:$|\/|\?)/;

const {
  YOUTUBE_API_KEY,
  VIMEO_API_CLIENT_ID, VIMEO_API_CLIENT_SECRET,
  VIMEO_API_ACCESS_TOKEN
} = process.env;

module.exports.getVideoName = async (url) => {

  const vidSource = detectSource(url);
  try {
    switch (vidSource) {
      case "youtube":
        return getVideoNameYoutube(url)
        break;

      case "dailymotion":
        return getVideoNameDailymotion(url)
        break;

      case "vimeo":
        return getVideoNameVimeo(url)
        break;

      case "drive":
        return getVideoNameDrive(url)
        break;

      case false:
        throw "Video source unrecognized";
        break;

      default:
        break;
    }
  } catch (e) {

  }
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

async function getVideoNameYoutube(url) {

  const videoId = YOUTUBE_REGEX_VIDEO.exec(url)[2];
  if (!videoId) throw "Video link parsing error - Youtube";

  const reqUrl = "https://www.googleapis.com/youtube/v3/videos?"
    + `part=snippet&fields=items(snippet(title))&id=${videoId}`
    + `&key=${YOUTUBE_API_KEY}`;

  return (await axios.get(reqUrl)).data.items[0].snippet.title;

}

function getVideoNameVimeo(url) {

  const videoId = VIMEO_REGEX.exec(url)[1];
  if (!videoId) throw "Video link parsing error - Vimeo";

  const vimeo_api = new Vimeo(VIMEO_API_CLIENT_ID, VIMEO_API_CLIENT_SECRET, VIMEO_API_ACCESS_TOKEN)

  return new Promise((resolve, reject) => {
    vimeo_api.request({ path: `/videos/${videoId}` },
      (error, body) => {
        if (error) reject(JSON.parse(error.message))
        resolve(body.name)
      })
  })

}

async function getVideoNameDailymotion(url) {

  const videoId = DAILYMOTION_REGEX.exec(url)[2];

  const reqUrl = `https://api.dailymotion.com/video/${videoId}?fields=title,url`;

  return (await axios.get(reqUrl)).data.title;

}

async function getVideoNameDrive(url) {

  const videoId = GOOGLEDRIVE_REGEX.exec(url)[1];

  const reqUrl = `https://www.googleapis.com/drive/v3/files/${videoId}?fields=name`
    + `&key=${YOUTUBE_API_KEY}`;

  return (await axios.get(reqUrl)).data.name;

}