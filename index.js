const http = require('http');
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
  };
  


  const server = http.createServer((req, res) => {
    if (req.url === "/") {
      requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=59c6f8f6316df5a0ec6366dff1099cd6')
        .on('data', (chunk) => {
          const objdata = JSON.parse(chunk);
          const arrData = [objdata];
          const realTimeData = arrData.map((val) => {
            return replaceVal(homeFile, val);
          });
          res.write(realTimeData[0]);
          res.end();
        })
        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);
        });
    }
  });
  

server.listen(8000, "127.0.0.1");
