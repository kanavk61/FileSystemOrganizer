let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
/* The above line is taking the user supplied arguements and 
putting them into an array 

Uses slice() method to create a new array after the 1st index incluseive 2. */

console.log(inputArr);
let command = inputArr[0]; //We will take the first arguement as the command which we want to perform
//Will use switch statement to select which function to execute
let types = {
  media: ["mp4", "mkv", "jpg", "jpeg"],
  archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
  documents: [
    "docx",
    "doc",
    "pdf",
    "xlsx",
    "xls",
    "odt",
    "ods",
    "odp",
    "odg",
    "odf",
    "txt",
    "ps",
  ],
  app: ["exe", "dmg", "pkg", "deb"],
};
switch (command) {
  case "tree":
    treeFn(inputArr[1]);
    break;
  case "organize":
    organizeFn(inputArr[1]);
    break;
  case "help":
    helpFn(inputArr[1]);
    break;
  default:
    console.log("Please input right command");
    break;
}

function treeFn(dirPath) {
  if (dirPath == undefined) {
    console.log("Kindly enter the path");
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
      treeHelper(dirPath);
    } else {
      console.log("Kindly enter the correct path");
      return;
    }
  }
}

function organizeFn(dirPath) {
  //1. input -> directory path given
  //2. create -> organized_files -> directory
  //3. check all files and identify categories of all the files present in that input directorie
  //4. copy / cut files to that organized directory
  let destPath;
  if (dirPath == undefined) {
    console.log("Kindly enter the path");
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    //fs.existsSync() -> returns boolean value, true if dirPath exists otherwise false.

    if (doesExist) {
      //2
      destPath = path.join(dirPath, "organized_files");
      if (fs.existsSync(destPath) == false) {
        fs.mkdirSync(destPath);
      }
    } else {
      console.log("Kindly enter the correct path");
      //Incase the path doesn't exist
    }
  }
  organizeHelper(dirPath, destPath);
}

function organizeHelper(src, dest) {
  //3
  let childNames = fs.readdirSync(src);
  //console.log(childNames);
  for (let i = 0; i < childNames.length; i++) {
    let childAddress = path.join(src, childNames[i]);
    let isFile = fs.lstatSync(childAddress).isFile();
    if (isFile) {
      //console.log(childNames[i]);
      //4
      let category = getCategory(childNames[i]);
      console.log(childNames[i] + " belongs to ->> " + category);
      //4. Copy/cut files to that organized directory inside of any category folder
      sendFiles(childAddress, dest, category);
    }
  }
}

function helpFn(dirPath) {
  console.log(`
  List of all commands:
                  node main.js tree "directoryPath"
                  node main.js organize "directoryPath"
                  node main.js help
  `);
  //We have used template string using backticks otherwise we can put strings in single line only
}

function getCategory(name) {
  let ext = path.extname(name);
  ext = ext.slice(1);

  for (let type in types) {
    let cTypeArray = types[type];

    for (let i = 0; i < cTypeArray.length; i++) {
      if (ext == cTypeArray[i]) {
        return type;
      }
    }
  }

  return "others";
}

function sendFiles(srcFilePath, dest, category) {
  let categoryPath = path.join(dest, category);
  if (fs.existsSync(categoryPath) == false) {
    fs.mkdirSync(categoryPath);
  }

  let fileName = path.basename(srcFilePath);
  let destFilePath = path.join(categoryPath, fileName);
  fs.copyFileSync(srcFilePath, destFilePath);
  fs.unlinkSync(srcFilePath);
  //The empty file is first created at the destination and then the data is copied to the empty file
  console.log(fileName, " copied to ", category);
}

function treeHelper(dirPath, indent) {
  //is File or Folder
  let isFile = fs.lstatSync(dirPath).isFile();
  if (isFile == true) {
    let fileName = path.basename(dirPath);
    console.log(indent + "------" + fileName);
  } else {
    let dirName = path.basename(dirPath);
    console.log(indent + "------" + dirName);
    let childrens = fs.readdirSync(dirPath);
    for (let i = 0; i < childrens.length; i++) {
      let childPath = path.join(dirPath, childrens[i]);
      treeHelper(childPath, indent + "\t");
    }
  }
}
