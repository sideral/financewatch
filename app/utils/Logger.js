const fs  = require("fs");

class Logger {
  constructor(filePath){
    this.file = fs.openSync(filePath, 'a');
  }

  log(path, status, message = ''){
    const date = Logger.formatDate();
    fs.appendFile(this.file, `${date} ${status} ${path} ${message}\n`, (err) => {
      //Non-critical. Log to console.
      if(err) console.error(err);
    });
  }

  static formatDate(){
    const now = new Date();
    let dateParts = [
      now.getMonth() + 1,
      now.getDate(),
      now.getFullYear() % 100,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    ];
    dateParts = dateParts.map(num => num.toString().padStart(2, '0'));
    const date = dateParts.slice(0,3).join('/');
    const time = dateParts.slice(3).join(':');
    return `${date} ${time}`;
  }
}

module.exports = Logger;