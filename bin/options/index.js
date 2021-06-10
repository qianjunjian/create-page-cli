var inquirer = require("inquirer");
var pageName = require("./questions/pageName");

module.exports = async () => {
    const answers = await inquirer.prompt([
        pageName()
    ]);
  
    return answers;
};