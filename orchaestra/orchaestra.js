const { exec } = require('child_process');

// Function to execute shell script with sudo privileges
function executeScriptWithSudo(scriptPath) {
  const command = `sudo ${scriptPath}`;
  const myShellScript = exec(command);

  myShellScript.stdout.on('data', (data) => {
    console.log(data.toString());
    // Handle stdout data
  });

  myShellScript.stderr.on('data', (data) => {
    console.error(data.toString());
    // Handle stderr data
  });

  myShellScript.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
}

module.exports = executeScriptWithSudo;
