require('dotenv').config();

const inquirer = require('inquirer');

const Queue = require('./queue');
//const menu = require('./menu');
const videoApi = require('./videoApi');

const main_menu_prompt = [
  {
    type: 'list',
    message: 'Main Menu',
    name: 'menu_choice',
    choices: [
      { name: 'Add To Queue', value: 1 },
      { name: 'Remove from Queue', value: 2 },
      { name: 'Show current Queue', value: 3 },
      new inquirer.Separator(),
      { name: 'Abort Application', value: 0 }
    ]
  }
];

const queue_push_prompt = [
  {
    type: 'input',
    message: 'Enter a youtube link\n',
    name: 'push_link',
    validate: (input) =>
      (input == "" || input == " ")
        ? 'Input is empty'
        : true
  }, {
    type: 'input',
    message: 'Enter a name\n',
    name: 'push_name',
    default: async ({ push_link }) => {
      return await videoApi.getVideoName(push_link)
    }
  }
]

const queue_remove_prompt = [
  {
    type: 'list',
    name: 'queue_remove',
    message: 'What link do you want to remove?',
    choices: () => {
      const getQ = Queue.getQueue().map((vid, i) => ({ name: vid.name, value: i }))
      getQ.push(new inquirer.Separator(), { name: "--Don't Remove--", value: "x" });
      return getQ;
    }
  }
]


async function main() {

  //setTimeout(() => { console.log('\n\nTimeout') }, 5000);

  //testing
  Queue.pushToQueue([
    { name: 'vid1', url: 'link1' },
    { name: 'vid2', url: 'link2' },
    { name: 'vid3', url: 'link3' },
    { name: 'vid4', url: 'link4' }
  ]);

  while (true) {
    const { menu_choice } = await inquirer.prompt(main_menu_prompt);

    // Exit application
    if (menu_choice === 0)
      break;

    // Push to Queue
    if (menu_choice === 1) {
      const { push_link, push_name } = await inquirer.prompt(queue_push_prompt);
      console.log({ push_link, push_name });
      Queue.pushToQueue([{ name: push_name, link: push_link }]);
    }

    // Remove from Queue
    if (menu_choice === 2) {
      const { queue_remove } = await inquirer.prompt(queue_remove_prompt);

      if (queue_remove === "x") {
        console.log('Nothing Removed');
        continue;
      } else {
        //console.log(queue_remove, Queue.getQueue()[queue_remove]);
        console.log('Removed from Queue:', Queue.removeFromQueue(queue_remove));
      }
    }

    if (menu_choice === 3) {
      console.log(Queue.getQueue());
    }

  }
}

main();