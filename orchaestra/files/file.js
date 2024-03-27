const fs = require('fs');
const path = require('path');

// Function to recursively generate a directory structure based on the given path
function generateDirectoryStructure(dirPath, parentId = null, depth = 0) {
  const dirStat = fs.statSync(dirPath);
  if (!dirStat.isDirectory()) {
    throw new Error('Provided path is not a directory');
  }

  const rootDir = {
    id: `${Math.random().toString(36).substr(2, 9)}`, // Random ID for demo purposes
    name: path.basename(dirPath),
    type: "DIRECTORY",
    parentId,
    depth,
    dirs: [],
    files: []
  };

  const contents = fs.readdirSync(dirPath, { withFileTypes: true });

  contents.forEach(item => {

    const itemPath = path.join(dirPath, item.name);
    const itemStat = fs.statSync(itemPath);

    if (itemStat.isDirectory()) {
      const subDir = generateDirectoryStructure(itemPath, rootDir.id, depth + 1);
      rootDir.dirs.push(subDir);
    } else if (itemStat.isFile()) {
      const file = {
        id: `${Math.random().toString(36).substr(2, 9)}`, // Random ID for demo purposes
        name: item.name,
        type: "FILE",
        parentId: rootDir.id,
        depth: depth + 1,
        content: fs.readFileSync(itemPath, 'utf8')
      };
      rootDir.files.push(file);
    }
  });
  return rootDir;
}

function generateFile(filePath) {
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
        resolve(matches);
      } else {
        console.log('Values not found in the text file.');
        reject('Values not found in the text file.');
      }
    });
  });
}

// Example usage: Generate directory structure for /home/aditya/Desktop/testingFiles
module.exports = {generateDirectoryStructure,generateFile};

