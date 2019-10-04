const inquirer = require('inquirer');

const Queue = require('./queue');
//const menu = require('./menu');

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
      { name: 'Abort Application', value: 'x' }
    ]
  }
];

const queue_push_prompt = [
  {
    type: 'input',
    message: 'Enter a youtube link\n',
    name: 'push_link',
    validate: (input) => {

      if (input == "" || input == " ")
        return 'Input is empty';

      return true;

    }
  }, {
    type: 'input',
    message: 'Enter a name\n',
    name: 'push_name'
  }
]

const queue_remove_prompt = [
  {
    type: 'list',
    name: 'queue_remove',
    message: 'What link do you want to remove?',
    choices: () => {
      return Queue.getQueue().map((vid, i) =>
        ({ name: vid.name, value: i }))
    }
  }
]


async function main() {

  //setTimeout(() => { console.log('\n\nTimeout') }, 5000);

  while (true) {
    const { menu_choice } = await inquirer.prompt(main_menu_prompt);

    if (menu_choice === 'x')
      break;

    if (menu_choice === 1) {
      const { push_link, push_name } = await inquirer.prompt(queue_push_prompt);
      console.log({ push_link, push_name });
      Queue.pushToQueue([{ name: push_name, link: push_link }]);
    }

    if (menu_choice === 2) {
      const { queue_remove } = await inquirer.prompt(queue_remove_prompt);
      console.log(queue_remove, Queue.getQueue()[queue_remove]);
    }

    if (menu_choice === 3) {
      console.log(Queue.getQueue());
    }

  }
}

main();