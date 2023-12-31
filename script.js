const fs = require('fs')
const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const Chalk = require("chalk");
prompt = inquirer.createPromptModule();
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: 'Jt2468da1!',
    database: 'employee_manage.db'
  },
  console.log(`Connected to the employee_manage.db database.`)
);

// Query database

prompt([
  {
    type: "list",
    message: `${Chalk.black.bgCyan(
      "Welcome to Employee Tracker. Select continue to begin."
    )}`,
    choices: ["Continue", "Quit"],
    name: "start",
  },
]).then((response) => {
  switch (response.start) {
    case "Continue":
      menu();
      break;
    case "Quit":
      return console.log("Restart the application and try again.");
  }
});

function menu() {
  prompt([
    {
      name: "choices",
      type: "list",
      message: `${Chalk.black.bgGreen(
        "Which action would you like to perform?"
      )}`,
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Update Employee Role",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Exit",
      ],
    },
  ]).then((answers) => {
    const { choices } = answers;
    if (choices === "View All Employees") {
      viewAllEmployees();
    }
    if (choices === "View All Roles") {
      viewAllRoles();
    }
    if (choices === "View All Departments") {
      viewAllDepartments();
    }
    if (choices === "Update Employee Role") {
      updateEmployeeRole();
    }
    if (choices === "Add Employee") {
      addEmployee();
    }
    if (choices === "Add Role") {
      addRole();
    }
    if (choices === "Add Department") {
      addDepartment();
    }
    if (choices === "Exit") {
      console.log("Thanks for using Employee Tracker. Until next time.");
      connection.end();
    }
  });
}

// VIEW actions...
const viewAllEmployees = () => {
  let sql = `SELECT employee.id, 
              employee.first_name, 
              employee.last_name, 
              role.title, 
              department.department_name AS 'department', 
              role.salary
              FROM employee, role, department 
              WHERE department.id = role.department_id 
              AND role.id = employee.role_id
              ORDER BY employee.id ASC`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(
      "------------------------------------------------------------------"
    );
    console.log(`${Chalk.greenBright("All Employees:\n")}`);
    console.table(response);
    console.log(
      "------------------------------------------------------------------"
    );
    menu();
  });
};

const viewAllRoles = () => {
  let sql = `SELECT role.id, role.title, department.department_name AS department
  FROM role
  INNER JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(
      "------------------------------------------------------------------"
    );
    console.log(`${Chalk.greenBright("List of Roles:\n")}`);
    response.forEach((role) => {
      console.log(role.title);
    });
    console.log(
      "------------------------------------------------------------------"
    );
    menu();
  });
};

const viewAllDepartments = () => {
  let sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(
      "------------------------------------------------------------------"
    );
    console.log(`${Chalk.greenBright("List of Departments:\n")}`);
    console.table(response);
    console.log(
      "------------------------------------------------------------------"
    );
    menu();
  });
};

// ADD actions...
const addEmployee = () => {
  prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
  ]).then((answer) => {
    const crit = [answer.firstName, answer.lastName];
    const roleSql = `SELECT role.id, role.title FROM role`;
    connection.query(roleSql, (error, data) => {
      if (error) throw error;
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      prompt([
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: roles,
        },
      ]).then((roleChoice) => {
        const role = roleChoice.role;
        crit.push(role);
        const managerSql = `SELECT * FROM employee`;
        connection.query(managerSql, (error, data) => {
          if (error) throw error;
          const managers = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
          }));
          prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is the employee's manager?",
              choices: managers,
            },
          ]).then((managerChoice) => {
            const manager = managerChoice.manager;
            crit.push(manager);
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
            connection.query(sql, crit, (error) => {
              if (error) throw error;
              console.log(
                "------------------------------------------------------------------"
              );
              console.log("Employee added successfully!");
              viewAllEmployees();
            });
          });
        });
      });
    });
  });
};

const addRole = () => {
  const sql = "SELECT * FROM department";
  connection.query(sql, (error, response) => {
    if (error) throw error;
    // Logic to add new dept for the new role...
    let deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(department.department_name);
    });
    deptNamesArray.push("Create Department");
    prompt([
      {
        name: "departmentName",
        type: "list",
        message: "Which department will you add this role to?",
        choices: deptNamesArray,
      },
    ]).then((answer) => {
      if (answer.departmentName === "Create Department") {
        this.addDepartment();
      } else {
        addRoleResume(answer);
      }
    });

    const addRoleResume = (departmentData) => {
      prompt([
        {
          name: "newRole",
          type: "input",
          message: "What is the name of your new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of this new role?",
        },
      ]).then((answer) => {
        let createdRole = answer.newRole;
        let departmentId;

        response.forEach((department) => {
          if (departmentData.departmentName === department.department_name) {
            departmentId = department.id;
          }
        });

        let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        let crit = [createdRole, answer.salary, departmentId];

        connection.query(sql, crit, (error) => {
          if (error) throw error;
          console.log(
            "------------------------------------------------------------------"
          );
          console.log("Role created successfully!");
          viewAllRoles();
        });
      });
    };
  });
};

const addDepartment = () => {
prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'Enter the name of the new department.'
      }
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(
          "------------------------------------------------------------------"
        );
        console.log(answer.newDepartment + " department added successfully!");
        viewAllDepartments();
      });
    });
};


// UPDATE action...
const updateEmployeeRole = () => {

  let employeesArray = []

  connection.query(
      `SELECT first_name, last_name FROM employee`,
      (err, res) => {
          if (err) throw err;
          prompt([
              {
                  type: "list",
                  name: "employee",
                  message: "Which employee has a new role?",
                  choices() {
                      res.forEach(employee => {
                          employeesArray.push(`${employee.first_name} ${employee.last_name}`);
                      });
                      return employeesArray;
                  }
              },
              {
                  type: "input",
                  name: "role",
                  message: `Enter the new role ID from the choices below.${Chalk.greenBright('\nDesigner: 1\nSenior Designer: 2\nPresident: 3\nIntern: 4\nConsultant: 5\nPress: 6\nTemp: 7\n' + Chalk.cyan('Your Answer: '))}`
              }
          ]).then( (answers) => {

              const updateEmployeeRole = answers.employee.split(' ');
              const updateEmployeeRoleFirstName = JSON.stringify(updateEmployeeRole[0]);
              const updateEmployeeRoleLastName = JSON.stringify(updateEmployeeRole[1]);

              connection.query(
                  `UPDATE employee
                  SET role_id = ${answers.role}
                  WHERE first_name = ${updateEmployeeRoleFirstName}
                  AND last_name = ${updateEmployeeRoleLastName}`,

                  (err, res) => {
                      if (err) throw err;
                      console.log(
                        "------------------------------------------------------------------"
                      );
                      console.log("Employee role updated successfully!");
                      viewAllEmployees();
                  }
              );
          });
      }
  );  
};