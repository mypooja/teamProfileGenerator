const fs = require('fs'); 
const inquirer = require('inquirer');
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern'); 
const generateHTML = require('./src/generateHTML');

const teamArray = []; 

const addManager = () => {
    return inquirer
    .prompt([
      {
        type: 'input',
        name: 'managerName',
        message: 'Enter manager name',
      },
      {
        type: 'input',
        name: 'managerEmployeeId',
        message: 'Enter manager Id',
      },
      {
        type: 'input',
        name: 'managerEmailAddress',
        message: 'Enter manager email address',
      },
      {
        type: 'input',
        name: 'managerOfficeNumber',
        message: 'Enter manager office number',
      }
    ])
    .then(function (answers) {
        const manager = new Manager(answers.managerName, answers.managerEmployeeId,
        answers.managerEmailAddress, answers.managerOfficeNumber);
        teamArray.push(manager); 
    })
};

const addEmployee = () => {
    return inquirer
    .prompt([
      {
        type: 'list',
        name: 'role',
        message: "Please choose your employee's role",
        choices: ['Engineer', 'Intern']
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter employee name',
      },
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter employee Id',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter employee email address',
      },
      {
        type: 'input',
        name: 'github',
        when: (input) => input.role === "Engineer",
        message: 'Enter Engineer github username',
      },
      {
        type: 'input',
        name: 'school',
        when: (input) => input.role === "Intern",
        message: 'Enter intern school',
      },
      {
        type: 'confirm',
        name: 'addMoreEmployee',
        message: 'Do you want to add more employee',
        default: false
      }
    ])
    .then(function (employeeAnswers) {
        let employee;
        if (employeeAnswers.role === "Engineer") {
            employee = new Engineer(employeeAnswers.name, employeeAnswers.employeeId,
                employeeAnswers.email, employeeAnswers.github);
        } else {
            employee = new Intern(employeeAnswers.name, employeeAnswers.employeeId,
                employeeAnswers.email, employeeAnswers.school);
        }

        teamArray.push(employee);
        
        if (employeeAnswers.addMoreEmployee) {
            return addEmployee(teamArray); 
        } else {
            return teamArray;
        }
    })
};

function generateHtmlFile(htmlContent) {
    fs.writeFile('./dist/index.html', htmlContent, (err) =>
        err ? console.log(err) : console.log('Successfully created HTML file!')
    );
}

addManager()
  .then(addEmployee)
  .then(teamArray => {
    return generateHTML(teamArray);
  })
  .then(htmlContent => {
    return generateHtmlFile(htmlContent);
  })
  .catch(err => {
    console.log(err);
  });