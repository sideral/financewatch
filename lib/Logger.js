const fs  = require("fs");

class Logger {
  constructor(filePath){
    this.file = fs.openSync(filePath, 'a');
  }

  log(path, status, message){
    message = message? message : '';
    const date = Logger.formatDate();
    fs.appendFile(this.file, `${date} ${status} ${path} ${message}\n`, (err) => {
      //Ignore error.
    });
  }

  static formatDate(){
    const now = new Date();
    const month = now.getMonth().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = (now.getFullYear() % 100).toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  }
}

module.exports = Logger;