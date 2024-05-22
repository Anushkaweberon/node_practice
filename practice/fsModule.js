const fs = require('fs');
const path = require('path');

function createDirectory(directoryName) {
    fs.mkdir(directoryName, (err) => {
        if (err) {
            console.error(`Error creating directory`);
            return;
        }
        console.log(`Directory '${directoryName}' created successfully.`);
    });
}

function createFile(fileName, content='') {
    fs.writeFile(fileName, content, (err) => {
        if (err) {
            console.error(`Error creating file`);
            return;
        }
        console.log(`File '${fileName}' created successfully.`);
    });
}

function listDirectoryContents(directory='.') {
    console.log(`Contents of directory '${directory}':`);
    fs.readdir(directory, {encoding:'utf-8'},(err, files) => {
        if (err) {
            console.error(`Error reading directory `);
            return;
        }
        files.forEach(file => {
            console.log(file);
        });
    });
}

function deleteFile(fileName) {
    fs.unlink(fileName, (err) => {
        if (err) {
            console.error(`Error deleting file `);
            return;
        }
        console.log(`File '${fileName}' deleted successfully.`);
    });
}


createDirectory("test_dir");
createFile("test_dir/test_file.txt", "Hi , I am Anushka Vishwari");
listDirectoryContents("test_dir");
deleteFile("test_dir/test_file.txt");
