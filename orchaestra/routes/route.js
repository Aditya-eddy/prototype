const express = require("express");
const router = new express.Router();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const {generateDirectoryStructure,generateFile} = require("../files/file")
const scriptPath =
  "/home/aditya/Desktop/codeEditor/orchaestra/run_with_sudo.sh";

const stopScriptPath =
  "/home/aditya/Desktop/codeEditor/orchaestra/stop_sudo.sh";
const testScriptPath =
  "/home/aditya/Desktop/codeEditor/orchaestra/test_coverage.sh";
const dirPath =
  "/home/aditya/Desktop/samples-typescript/express-mongoose";

router.post("/start", async (req, res) => {
  try {
    var outPutData = "";
    function executeScript(scriptPath) {
      const command = `sudo ${scriptPath}`;
      const myShellScript = exec(command);

      myShellScript.stdout.on("data", (data) => {
        outPutData = data.toString();
        console.log(data.toString());
        // Handle stdout data
      });

      myShellScript.stderr.on("data", (data) => {
        console.error(data.toString());
        // Handle stderr data
      });

      myShellScript.on("exit", (code) => {
        console.log(`Child process exited with code ${code}`);
      });
    }
    executeScript(scriptPath);
    res.json({ data: { outPutData } });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
router.post("/stop", async (req, res) => {
  try {
    var outPutData = "";
    function executeScriptStop(stopScriptPath) {
      const command = `sudo ${stopScriptPath}`;
      const myShellScript = exec(command);

      myShellScript.stdout.on("data", (data) => {
        outPutData = data.toString();
        console.log(data.toString());
        // Handle stdout data
      });

      myShellScript.stderr.on("data", (data) => {
        console.error(data.toString());
        // Handle stderr data
      });

      myShellScript.on("exit", (code) => {
        console.log(`Child process exited with code ${code}`);
      });
    }
    const realData = "done";
    executeScriptStop(stopScriptPath);
    res.json({ data: { realData } });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

router.post("/testCoverage", async (req, res) => {
  try {
    let outPutData = "";

    function executeScriptStop(testScriptPath) {
      return new Promise((resolve, reject) => {
        const command = `sudo ${testScriptPath}`;
        const myShellScript = exec(command);

        myShellScript.stdout.on("data", (data) => {
          outPutData = data.toString();
          console.log(data.toString());
          // Handle stdout data if needed
        });

        myShellScript.stderr.on("data", (data) => {
          console.error(data.toString());
          // Handle stderr data if needed`
        });

        myShellScript.on("exit", (code) => {
          console.log(`Child process exited with code ${code}`);
          if (code === 0) {
            resolve(outPutData); // Resolve with output data if the process exits successfully
          } else {
            reject(new Error(`Child process exited with code ${code}`));
          }
        });
      });
    }
    var Jsondata="";
    await executeScriptStop(testScriptPath).then(()=>
    Jsondata = require("/home/aditya/Desktop/samples-typescript/express-mongoose/data.json")
    );
    const stringifiedData = Jsondata.map((num) => num.toString());
    console.log({ stringifiedData });
    res.json({ stringifiedData });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

router.get("/files", async (req, res) => {
  try {
    const rootDir = generateDirectoryStructure(dirPath); // Call the rootDir function to get updated data
    res.status(200).json({ data: rootDir });
  } catch (err) {
    res.status(400).send(`Failed to fetch directory structure as ${err}`);
  }
});

module.exports = router;
