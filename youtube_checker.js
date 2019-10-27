require('dotenv').config();

require('./validation').envVarValidation();

const axios = require('axios');
const mongoose = require('mongoose');
const { DateTime, Duration } = require('luxon');

const { isObjectEmpty } = require('./util');
const { pushToQueue, Channel } = require('./queue');

const DT_FORMAT = 'HH:mm:ss z | dd-MM-yyyy';
const { YOUTUBE_API_KEY, MONGO_URI } = process.env;
const INTERVAL = Duration.fromObject({ minutes: 15 });

async function initChecker() {
  await checkLoop();
  setInterval(async () => { await checkLoop() }, INTERVAL);
}

async function checkLoop() {

  console.log("\n:: Check Started [",
    DateTime.local().toFormat(DT_FORMAT), "] ::\n");

  let submitted = false;

  const channels = await Channel.find({});

  for (const channel of channels) {
    const { channelId, videoCache } = channel;
    const vid_obj = await getLatestVideo(channelId);

    if (isObjectEmpty(videoCache) ||
      (new Date(vid_obj.publishedAt)) > (new Date(videoCache.publishedAt))) {

      console.log("\t... Pushing Video");
      const pushed = await pushToQueue({ name: vid_obj.name, url: vid_obj.url });
      console.log("\t~ Pushed Video:", pushed.name, "\n id:", pushed._id);
      submitted = true;

    }

    await Channel.updateOne({ _id: channel._id }, {
      $set: {
        videoCache: {
          name: vid_obj.name, url: vid_obj.url, publishedAt: vid_obj.publishedAt
        }
      }
    });
  }

  if (!submitted)
    console.log('~   Nothing to push');

  console.log("\n:: Next check @  [",
    DateTime.local().plus(Duration.fromObject({ minutes: 15 })).toFormat(DT_FORMAT),
    "] ::\n\t______________________\n");
}

/**
 * @param { String } channelId
 * @returns { Promise<Object> } 
 */
async function getLatestVideo(channelId) {

  const channel_uploads_url =
    `https://www.googleapis.com/youtube/v3/channels`
    + `?part=contentDetails&id=${channelId}`
    + `&key=${YOUTUBE_API_KEY}`;

  const req_data = (await axios.get(channel_uploads_url)).data.items[0];
  const upload_playlist_id = req_data.contentDetails.relatedPlaylists.uploads;

  const upload_video_url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=snippet%2CcontentDetails&maxResults=1&fields=items(contentDetails%2FvideoId%2Csnippet(publishedAt%2Ctitle))` +
    `&playlistId=${upload_playlist_id}&key=${YOUTUBE_API_KEY}`;

  const { snippet, contentDetails } = (await axios.get(upload_video_url)).data.items[0];

  return ({
    name: snippet.title,
    url: `https://www.youtube.com/watch?v=${contentDetails.videoId}`,
    publishedAt: snippet.publishedAt
  });

}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (instance) => {
    initChecker();
  })
  .catch(error => console.log(error));