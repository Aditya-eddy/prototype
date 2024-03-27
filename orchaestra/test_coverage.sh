  #!/bin/bash

  # Set specific environment variables
  export XDG_SESSION_DESKTOP=Unity
  export PWD=/home/aditya/Desktop/samples-typescript/express-mongoose
  export HOME=/home/aditya
  export USER=aditya
  export PATH=/home/aditya/.nvm/versions/node/v21.5.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin:/usr/local/go/bin
  export GNOME_SHELL_SESSION_MODE=ubuntu
  export VTE_VERSION=6800
  export SHLVL=2

  # Define the path to the logfile
  LOGFILE_PATH="/home/aditya/Desktop/samples-typescript/express-mongoose/logfile.txt"
  JSON_FILE_PATH="/home/aditya/Desktop/samples-typescript/express-mongoose/data.json"
  JSON_TABLE_PATH="/home/aditya/Desktop/samples-typescript/express-mongoose/table.json"
  # Check if the logfile exists, create it if not
  if [ ! -f "$LOGFILE_PATH" ]; then
      touch "$LOGFILE_PATH"
  fi

  cd /home/aditya/Desktop/samples-typescript/express-mongoose/

  # Run the keploy test command and redirect the output to the logfile
  keploy test -c "npm run coverage" --delay 10 --coverage >> "$LOGFILE_PATH" 2>&1

  # Extract values from the logfile using Node.js
  NODE_PATH=/home/aditya/.nvm/versions/node/v21.5.0/bin/node
  "$NODE_PATH" -e "
    const fs = require('fs');
    const generateFile = filePath => {
      return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading the file:', err);
            reject(err);
            return;
          }

          const regex = /All files\s*\|\s*([\d.]+)/g;
          let matches = [];
          let match;
          while ((match = regex.exec(data)) !== null) {
            matches.push(parseFloat(match[1]));
          }

          if (matches.length > 0) {
            fs.writeFile('$JSON_FILE_PATH', JSON.stringify(matches), (err) => {
              if (err) {
                console.error('Error writing JSON file:', err);
                reject(err);
              } else {
                console.log('Values written to JSON file:', matches);
                resolve(matches);
              }
            });
          } else {
            console.log('Values not found in the text file.');
            reject('Values not found in the text file.');
          }
        });
      });
    };

    generateFile('$LOGFILE_PATH')
      .then(values => console.log(values.join(', ')))
      .catch(error => console.error(error));
  "

 rm "$LOGFILE_PATH"