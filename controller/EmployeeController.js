const Employee = require("../models/Employee");
// show the list of employee
const index = (req, res, next) => {
  Employee.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      res.json({
        message: "An error occured!",
      });
    });
};

// Show single employee
const show = (req, res, next) => {
  let employeeID = req.body.employeeID;
  Employee.findById(employeeID)
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({
        message: "An error occured",
      });
    });
};

// add employee to database

const store = (req, res, next) => {
  let employee = new Employee({
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
  });
  // for single upload
  // if (req.file) {
  //   employee.avatar = req.file.path;
  // }

  // for multiple uploads
  if (req.files) {
    let path = " ";
    req.files.forEach(function (files, index, arr) {
      path = path + files.path + ",";
    });
    path = path.substring(0, path.lastIndexOf(","));
    employee.avatar = path;
  }

  employee
    .save()
    .then((response) => {
      res.json({
        message: "Employee added successfully",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error occur while adding employee",
      });
    });
};

// update an employee by employee ID

const update = (req, res, next) => {
  let employeeID = req.body.employeeID;
  let updateData = {
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
  };

  Employee.findByIdAndUpdate(employeeID, { $set: updateData })
    .then((response) => {
      res.json({
        message: "Employeee data updated successfully!",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error occured while updating the data",
      });
    });
};

// delete an employee
const destroy = (req, res, next) => {
  let employeeID = req.body.employeeID;
  Employee.findByIdAndDelete(employeeID)
    .then((response) => {
      res.json({
        message: "Employee Deleted Successfully!",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error occured while deleting Id",
      });
    });
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
