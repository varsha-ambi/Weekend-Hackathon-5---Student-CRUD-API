const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const studentArray = require("./InitialData.js");

var http = require("http");
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here
app.get("/api/student", (req, res) => {
  res.send(studentArray);
});

app.get("/api/student/:id", (req, res) => {
  const studentId = req.params.id;

  const student = studentArray.find((el) => el.id === parseInt(studentId));

  if (!student) {
    res.status(404).send();
    return;
  }
  res.send(student);
});

app.post("/api/student", (req, res) => {
  const student = {
    id: studentArray[studentArray.length - 1].id + 1,
    ...req.body,
    currentClass: parseInt(req.body.currentClass)
  };

  if (!student.name || !student.currentClass || !student.division) {
    //res.setHeader('{"content-type":"application/x-www-form-urlencoded"}');
    res.status(400).send();
    return;
  }

  studentArray.push(student);

  //res.setHeader(['{"content-type":"application/x-www-form-urlencoded"}']);
  let id = student.id;
  // res.json({"id" : +id});
  res.send({ id: id });
});

app.put("/api/student/:id", (req, res) => {
  const studentId = req.params.id;

  const student = studentArray.find((el) => el.id === parseInt(studentId));

  if (!student) {
    res.status(400).send();
    return;
  } else if (req.body.name) {
    if (req.body.name.length === 0) {
      res.status(400).send();
      return;
    }
  } else if (req.body.currentClass) {
    if (!Number.isInteger(req.body.currentClass)) {
      res.status(400).send();
      return;
    }
  } else if (req.body.division) {
    if (!req.body.division.length === 1 || !req.body.division.match(/[A-Z]/)) {
      res.status(400).send();
      return;
    }
  }

  const studentIndex = studentArray.findIndex(
    (el) => el.id === parseInt(studentId)
  );

  const newStudent = {
    id: studentId,
    ...student,
    ...req.body
  };

  let classStudent = Number(newStudent.currentClass);

  newStudent.currentClass = classStudent;

  studentArray.splice(studentIndex, 1, newStudent);

  //res.setHeader(['{"content-type":"application/x-www-form-urlencoded"}']);
  res.send(newStudent.name);
});

app.delete("/api/student/:id", (req, res) => {
  const studentId = req.params.id;
  const student = studentArray.find((el) => el.id === parseInt(studentId));
  const studentIndex = studentArray.findIndex(
    (el) => el.id === parseInt(studentId)
  );

  if (!student) {
    res.status(404).send();
    return;
  }

  studentArray.splice(studentIndex, 1);
  res.send(student);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
