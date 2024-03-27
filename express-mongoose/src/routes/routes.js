const express = require("express");
const router = new express.Router();
const Student = require("../models/students");
const axios = require("axios");
const { exec } = require("child_process");
// function executeCommand(parsedCommand) {
//   return new Promise((resolve, reject) => {
//     exec(parsedCommand, (error, stdout, stderr) => {
//       if (error) {
//         console.error("Command execution error:", error);
//         reject(error);
//       } else {
//         console.log("Command executed successfully:", stdout);
//         resolve(stdout);
//       }
//     });
//   });
// } 

// function parseCommand(commandData) {
//   // Implement your command parsing logic here
//   // For example, extract the command string from commandData
//   const command = commandData;
//   // You may need to sanitize and validate the command before executing
//   return command;
// }

router.get("/students", async (req, res) => {
  try {
    const studentList = await Student.find();
    res.status(200).send(studentList);
  } catch (err) {
    res.status(400).send(`Failed to fetch student data as ${err}`);
  }
});

router.get("/student", async (req, res) => {
  try {
    const name = req.query.name;
    const email = req.query.email;
    const studentList = await Student.find({ name: name, email: email });
    res.status(200).send(studentList);
  } catch (err) {
    res.status(400).send(`Failed to fetch student data as ${err}`);
  }
});

// router.post("/exec", async (req, res) => {
//   try {
//     const command = String(req.body.data); // Convert data to string
//     // console.log(command); // Optional: Log the command for debugging
//     const parsedCommand = parseCommand(command);
//     executeCommand(parsedCommand)
//       .then((result) => {
//         res.json({result});
//       })
//       .catch((error) => {
//         res.send(`Error executing command: ${error}`);
//       });
//   } catch (err) {
//     res.status(400).send(`Error: ${err}`);
//   }
// });

// router.get("/testCoverage", async (req, res) => {
//   try {
//     const values = await generateFile(logPath);
//     console.log(values);
//     res.json({ values });
//   } catch (err) {
//     res.status(400).send(`error: ${err}`);
//   }
// });

router.get("/student/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const studentList = await Student.find({ name: name });
    res.status(200).send(studentList);
  } catch (err) {
    res.status(400).send(`Failed to fetch student data as ${err}`);
  }
});


router.post("/students", async (req, res) => {
  const stud = new Student(req.body);
  try {
    await stud.save();
    res.status(201).send("Student registration successful!");
  } catch (e) {
    res.status(400).send(`Failed to register Student as ${e}`);
  }

  // stud.save().then(() => {
  //     res.status(201).send("Student registration successful!");
  // }).catch((e) => {
  //     res.status(400).send(`Failed to register Student as ${e}`);
  // })
});

router.patch("/student/:id", async (req, res) => {
  try {
    const sid = req.params.id;
    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: sid },
      req.body,
      { new: true }
    );
    res.status(200).send(`Student detail updated to \n ${updatedStudent}`);
  } catch (err) {
    res.status(400).send(`Failed to update Student details as ${err}`);
  }
});

router.delete("/student/:id", async (req, res) => {
  try {
    const sid = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete({ _id: sid });
    res
      .status(200)
      .send(`Deleted student record successfully \n ${deletedStudent}`);
  } catch (err) {
    res.status(500).send(`Failed to delete Student details as ${err}`);
  }
});

router.post("/post", async (req, res) => {
  try {
    let data;
    await axios
      .post("https://reqres.in/api/users", {
        data: "new data",
      })
      .then((response) => {
        data = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(`Failed to post req data as ${err}`);
  }
});

router.get("/get", async (req, res) => {
  try {
    const axiosResponse = await axios.get("https://reqres.in/api/users");
    res.status(200).json(axiosResponse.data);
  } catch (err) {
    res.status(400).send(`Failed to fetch req details as ${err}`);
  }
});
module.exports = router;
