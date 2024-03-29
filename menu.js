const inquirer = require('inquirer');
const luxon = require('luxon');
luxon.Settings.defaultLocal = 'America/Toronto';
const { DateTime } = luxon;

const Queue = require('./queue');
const videoApi = require('./videoApi');

module.exports = async (mongoose) => {

  console.log(`\n { This is only terminal based menu }
 { Run bot.js in a seperate terminal }
  ------------------`);

  /* if conditional instead of switch case
  so I can break out of it to exit app */

  while (true) {

    console.log('\n');

    const { menu_choice } = await inquirer.prompt(main_menu_prompt);

    // 0. Exit application
    if (menu_choice === 0)
      break;

    // 1. Push to Queue
    if (menu_choice === 1) {
      const { push_url, push_name } = await inquirer.prompt(queue_push_prompt);

      if (push_name == "none" || push_name == "") {
        console.log('\n\t<<- Operation Aborted ->>');
        continue;
      }
      const pushed_vid = await Queue.pushToQueue({ name: push_name, url: push_url });
      const { name, url, date_added } = pushed_vid;
      printVideoObject({ name, url, date_added }, "+");
    }

    // 2. Remove from Queue
    if (menu_choice === 2) {
      // queue_remove is an id for videoObject
      const { queue_remove } = await inquirer.prompt(queue_remove_prompt);

      if (queue_remove !== 0) {
        const { name, url, date_added } = await Queue.removeFromQueue(queue_remove)
        printVideoObject({ name, url, date_added }, "~");
      }
    }

    // 3. Show Queue
    if (menu_choice === 3) {
      const curr_queue = await Queue.getQueue();

      for (const { name, url, date_added } of curr_queue)
        printVideoObject({ name, url, date_added }, "*");

      if (curr_queue.length === 0)
        console.log('\n\t<<- Empty ->> ');
    }

    // 4. Clear Queue
    if (menu_choice === 4) {

      const { queue_clear } = await inquirer.prompt(queue_clear_prompt);

      if (queue_clear) {
        if ((await Queue.getLength()) === 0)
          console.log(' [ Queue Empty ] ');
        else {
          const num_items = await Queue.clearQueue();
          console.log(`\n\t...Cleared ${num_items} items`);
        }
      } else
        console.log('\n\t<<- Operation Aborted ->>');
    }
  }
  console.clear();
  console.log('\n\t| Application Closed | \n')
  mongoose.connection.close();
}


const main_menu_prompt = [
  {
    type: 'list',
    message: 'Main Menu',
    name: 'menu_choice',
    choices: [
      { name: 'Add To Queue', value: 1 },
      { name: 'Remove from Queue', value: 2 },
      { name: 'Show current Queue', value: 3 },
      { name: 'Clear Queue', value: 4 },
      new inquirer.Separator(),
      { name: 'Exit Application', value: 0 }
    ]
  }
];

const queue_push_prompt = [
  {
    type: 'input',
    message: 'Enter video url [Supported: Youtube, Dailymotion, Vimeo, Google Drive] \n',
    name: 'push_url',
    validate: async (input) => {

      if (input == "" || input == " ")
        return 'Input is empty';

      if (input == "none")
        return true;
      
      try {
        return (await videoApi.validateUrl(input));
      } catch (e) {
        console.log(e);
        return "Source not recognized"
      }
    }
  }, {
    type: 'input',
    message: 'Enter a name [hit enter for default]\n',
    name: 'push_name',
    default: async ({ push_url }) => {
      if (push_url == "none")
        return "none";
      return await videoApi.getVideoName(push_url);
    }
  }
];

const queue_remove_prompt = [
  {
    type: 'list',
    name: 'queue_remove',
    message: 'Select video to remove',
    choices: async () => {
      const curr_queue = (await Queue.getQueue())
        .map(vid =>
          ({ name: `*  ${vid.name} : ${vid.url}`, value: vid.id }));
      curr_queue.unshift(new inquirer.Separator());
      curr_queue.push(new inquirer.Separator(), { name: "< Don't Remove >", value: 0 });
      return curr_queue;
    }
  }
];

const queue_clear_prompt = [
  {
    type: 'confirm',
    name: 'queue_clear',
    message: 'Action is irreversable, Are you sure?',
    default: false
  }
]

function printVideoObject({ name, url, date_added }, operator = "#") {
  console.log(
    `\n  ${operator}┌`, name,
    "\n   ├", url,
    "\n   └", DateTime.fromJSDate(date_added).toFormat('dd-MM-yyyy | HH:mm:ss z')
  );
}