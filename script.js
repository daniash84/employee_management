const fs = require('fs')
const inquirer = require('inquirer');

const questions = [
   
    {
    type: 'input',
    message: 'What is your GitHub username?',
    name: 'github',
},
]
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, err => {
        if (err) {
            return console.log(err);
        }
        console.log("Success!")
    });
}
// function init() {
//     inquirer
//         .prompt(questions)
//         .then(answers => writeToFile("README.md", generateREADME(answers))) 

//           }; 


// init();