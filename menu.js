const inquirer = require('inquirer');

const Queue = require('./queue');
const videoApi = require('./videoApi');

module.exports = async () => {

  console.log(`\n { This is only terminal based menu }
 { Run bot.js in a seperate terminal }
  ------------------`);

  /* if conditional instead of switch case
  so I can break out of it to exit app */

  while (true) {

    console.log('\n');

    const { menu_choice } = await inquirer.prompt(main_menu_prompt);

    // Exit application
    if (menu_choice === 0)
      break;

    // Push to Queue
    if (menu_choice === 1) {
      const { push_url, push_name } = await inquirer.prompt(queue_push_prompt);
      if (push_name == "none")
        continue;
      else {
        console.log("\n +┌", push_name, "\n  └", push_url);
        Queue.pushToQueue([{ name: push_name, url: push_url }]);
      }
    }

    // Remove from Queue
    if (menu_choice === 2) {
      const { queue_remove } = await inquirer.prompt(queue_remove_prompt);

      if (queue_remove !== "x")
        console.log('Removed from Queue:', Queue.removeFromQueue(queue_remove));

    }

    // Show Queue
    if (menu_choice === 3) {
      const getQ = Queue.getQueue();

      console.log('\n');

      for (const vid of getQ)
        console.log(" * ", vid.name, ":", vid.url);

      if (getQ.length === 0)
        console.log(' [ Empty ] ');

    }

    if (menu_choice === 4) {

      const { queue_clear } = await inquirer.prompt(queue_clear_prompt);

      if (queue_clear) {
        if (Queue.length() === 0)
          console.log('[ Queue Empty ]');
        else {
          console.log(`\t...Cleared ${Queue.length()} items`);
          Queue.clearQueue();
        }
      } else
        console.log("< Queue not cleared >")

    }

  }
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
    validate: (input) => {

      if (input == "" || input == " ")
        return 'Input is empty';

      if (input == "none")
        return true;

      try {
        return videoApi.validateUrl(input);
      } catch (e) {
        return "Source not recognized"
      }
    }
  }, {
    type: 'input',
    message: 'Enter a name [hit enter for default]\n',
    name: 'push_name',
    default: async ({ push_url }) => {
      if (push_url == "none")
        return "";
      return await videoApi.getVideoName(push_url);
    }
  }
];

const queue_remove_prompt = [
  {
    type: 'list',
    name: 'queue_remove',
    message: 'Select video to remove',
    choices: () => {
      const getQ = Queue.getQueue().map((vid, i) =>
        ({ name: `*  ${vid.name} : ${vid.url}`, value: i }));
      getQ.unshift(new inquirer.Separator());
      getQ.push(new inquirer.Separator(), { name: "< Don't Remove >", value: "x" });
      return getQ;
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