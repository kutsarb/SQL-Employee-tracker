const { prompt } = require("inquirer");
const db = require("./db/employee");
require("console.table");

mainPrompts()

async function mainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What's the move?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_ALL"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_BY_DEPARTMENT"
        },
        
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        // update
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE"
        },
        // roles
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        //departments
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        //quit
        {
          name: "Quit",
          value: "End"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_ALL":
      return viewALL();
    case "VIEW_BY_DEPARTMENT":
      return viewByDepartment();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "UPDATE_EMPLOYEE":
      return updateEmployee();
    case "VIEW_DEPARTMENTS":
      return ViewDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    default:
      return end();
  }
}

async function viewALL() {
  const all = await db.findAllEmployees();

  console.log("\n");
  console.table(all);
  mainPrompts();
}

async function viewByDepartment() {
  const departments = await db.findAllDepartments();

  const choices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Sort by which department?",
      choices: choices
    }
  ]);

  const all = await db.findAllByDepartment(departmentId);

  console.log("\n");
  console.table(all);

  mainPrompts();
}

//update 

async function updateEmployee() {
  const all = await db.findAllEmployees()
  const choices = all.map(function ({
    id,
    first_name,
    last_name
  }) {
    return ({
      name: `${first_name} ${last_name}`,
      value: id
    });
  });
  const {
    employeeId
  } = await prompt([{
    type: "list",
    name: "employeeId",
    message: "Which employee's role do you want to update?",
    choices: choices
  }]);
  const roles = await db.findAllRoles();
  const newRole = roles.map(({
    id,
    title
  }) => ({
    name: title,
    value: id
  }));
  const {
    roleId
  } = await prompt([{
    type: "list",
    name: "roleId",
    message: "Which role do you want to assign?",
    choices: newRole
  }]);
  await db.updateEmployeeRole(employeeId, roleId);
  console.log("Updated employee's role");
  mainPrompts();
};

//view roles

async function viewRoles() {
  const roles = await db.findAllRoles();
  console.log("\n");
  console.table(roles);
  mainPrompts();
}

//add roles

async function addRole() {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({
    id,
    name
  }) => ({
    name: name,
    value: id,
  }));
  const role = await prompt([{
      name: "title",
      message: "what is the name of the role?"
    },
    {
      name: "salary",
      message: "what is the salary of the role?"
    },
    {
      type: "list",
      name: "department_id",
      message: "which department does the role belong to?",
      choices: departmentChoices
    }
  ]);

  await db.createRole(role);
  console.log(`Added ${role.title} to the database`);
  mainPrompts();
}

//view departments

async function ViewDepartments() {
  const departments = await db.findAllDepartments();
  console.log("\n");
  console.table(departments);
  mainPrompts();
}
//add department

async function addDepartment() {
  const department = await prompt([{
    name: "name",
    message: "What is the name of the department?"
  }]);
  await db.createDepartment(department);
  console.log(`Added ${department.name} to the database`);
  mainPrompts();
}


//add employeee

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);
//role choices

  const roleChoices = roles.map(({
    id,
    title
  }) => ({
    name: title,
    value: id
  }));

  const {
    roleId
  } = await prompt({
    type: "list",
    name: "roleId",
    message: "what is the employee's role?",
    choices: roleChoices
  });

  employee.role_id = roleId;
//manager choices

  const managerChoices = employees.map(({
    id,
    first_name,
    last_name
  }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({
    name: "None",
    value: null
  });

  const {
    managerId
  } = await prompt({
    type: "list",
    name: "manager",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });
  employee.manager_id = managerId;
  await db.createEmployee(employee);
  console.log(`Added ${employee.first_name} ${employee.last_name} to the database`);
  mainPrompts();
}

//quit
function end() {
  console.log("Goodbye!");
  process.exit();
}