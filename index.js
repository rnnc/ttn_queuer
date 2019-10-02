const inquirer = require('inquirer');
const readline = require('readline');

const main_menu_prompt = [
  {
    type: 'list',
    message: 'Main Menu',
    name: 'menu_choice',
    choices: [
      { name: 'Add To Queue', value: 1 },
      { name: 'Remove from Queue', value: 2 },
      new inquirer.Separator(),
      { name: 'Abort Application', value: 'x' }
    ]
  }
];


async function main() {

  setTimeout(() => { console.log('\n\nTimeout') }, 5000);

  while (true) {
    const { menu_choice } = await inquirer.prompt(main_menu_prompt);

    if (menu_choice === 'x')
      break;

    console.clear();
    
  }
}

main();