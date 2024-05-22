// const { createServer } = require('node:http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// __dirname Global Variable
// console.log(__dirname);

// __filename Global Variable
// console.log(__filename);

// function sayHello(name){
//     console.log(`Hello ${name}`);
// }

// module.exports = sayHello


// **********************OS*****************

// const os = require('os')

// // os.uptime()
// const systemUptime = os.uptime();  //This function returns the number of seconds the system has been running since it was last rebooted.

// // os.userInfo()
// const userInfo = os.userInfo();  // Gives the info about the current user, its retuen obj

// // We will store some other information about my WindowsOS in this object:
// const otherInfo = {
//     name: os.type(),
//     release: os.release(),
//     totalMem: os.totalmem(),
//     freeMem: os.freemem(),
// }

// // Let's Check The Results:
// console.log(systemUptime);
// console.log(userInfo);
// console.log(otherInfo);

//*************************PATH********** */

// Import 'path' module using the 'require()' method:
// const path = require('path')

// Assigning a path to the myPath variable
// const myPath = '/home/bstadmin/node_practice/practice/server.js'

// const pathInfo = {
//     fileName: path.basename(myPath),
//     folderName: path.dirname(myPath),
//     fileExtension: path.extname(myPath),
//     absoluteOrNot: path.isAbsolute(myPath),
//     detailInfo: path.parse(myPath),
// }

// Let's See The Results:
// console.log(pathInfo);
//***************************fs asynchronously****************** */

const fs = require('fs');

// fs.mkdir('./myFolder', (err) => {
//     if(err){
//     	console.log(err);
//     } else{
//     	console.log('Folder Created Successfully');
//     }
// })


// const data = "Hi, I am Anushka";

// fs.writeFile('./myFolder/myFile.txt', data, {flag: 'a'}, (err)=> {
//     if(err){
//         console.log(err);
//         return;
//     } else {
//     	console.log('Writen to file successfully!');
//     }
// })

// fs.readFile('./myFolder/myFile.txt', {encoding: 'utf-8'}, (err, data) => {
//     if(err){
//     	console.log(err);
//         return;
//     } else {
//     	console.log('File read successfully! Here is the data');
//         console.log(data);
//     }
// })

//***************************fs synchronously****************** */

// try{
//     fs.writeFileSync('./myFolder/myFileSync.txt', 'myFileSync says Hi');
//     console.log('Write operation successful');
    
//     const fileData = fs.readFileSync('./myFolder/myFileSync.txt', 'utf-8');
//     console.log('Read operation successful. Here is the data:');
//     console.log(fileData);
    
// } catch(err){
//     console.log('Error occurred!');
//     console.log(err);
// }


fs.readdir('./myFolder', (err, files) => {
    if(err){
    	console.log(err);
        return;
    }
    console.log('Directory read successfully! Here are the files:');
    console.log(files);
})