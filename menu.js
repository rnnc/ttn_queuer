const inquirer = require('inquirer');

const Queue = require('./queue');
const videoApi = require('./videoApi');

const sep_char = "____________________\n"

module.exports = async () => {

  //testing

  while (true) {
    const { menu_choice } = await inquirer.prompt(main_menu_prompt);

    // Exit application
    if (menu_choice === 0)
      break;

    // Push to Queue
    if (menu_choice === 1) {
      const { push_url, push_name } = await inquirer.prompt(queue_push_prompt);
      console.log(" * ", push_name, ":", push_url);
      Queue.pushToQueue([{ name: push_name, url: push_url }]);
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

      for (const vid of getQ)
        console.log(" * ", vid.name, ":", vid.url);

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
      new inquirer.Separator(sep_char),
      { name: 'Exit Application', value: 0 }
    ]
  }
];

const queue_push_prompt = [
  {
    type: 'input',
    message: 'Enter video url (Youtube, Dailymotion, Vimeo, Google Drive) \n',
    name: 'push_url',
    validate: (input) => (input == "" || input == " ") ? 'Input is empty' : true
  }, {
    type: 'input',
    message: 'Enter a name (hit enter for default)\n',
    name: 'push_name',
    default: async ({ push_url }) => await videoApi.getVideoName(push_url)
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
      getQ.push(new inquirer.Separator(), { name: "--Don't Remove--", value: "x" });
      return getQ;
    }
  }
];