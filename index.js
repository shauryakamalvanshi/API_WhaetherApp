const http = require('http');
const fs = require("fs");
const requests = require("requests");

const replaceVal = (tempVal, orgVal) => {
  const trep = orgVal.main.temp;
  const C = (trep - 273.15).toFixed(2);
  
  const Re = orgVal.main.feels_like;
  const R = (Re - 273.15).toFixed(2);

  let temperature = tempVal.replace("{%tempval%}", C);
  temperature = temperature.replace("{%loaction%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%humidity%}", orgVal.main.humidity);
  temperature = temperature.replace("{%windSpeed%}", orgVal.wind.speed);
  temperature = temperature.replace("{%pressure%}", orgVal.main.pressure);
  temperature = temperature.replace("{%feelLike%}", R);
  return temperature;
};

const homeFile = fs.readFileSync("home.html", "utf-8");

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests('https://api.openweathermap.org/data/2.5/weather?q=Noida&appid=59c6f8f6316df5a0ec6366dff1099cd6')
      .on('data', (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData);
      })
      .on('end', (err) => {
        if (err) {
          console.log('connection closed due to errors', err);
        }
        // Move res.end() here, outside the 'on('end')' event handler
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1");
