const axios = require("axios");
const fs = require('fs');

let list = []
let finallist = []
let datass = {}
let importantinfo = new Array();
async function dowork(){
  let loc = JSON.parse(fs.readFileSync('city.json'))
  for(let x = 1; x < 11; x++){
    const options = {
      method: 'GET',
      url: 'https://zillow-com1.p.rapidapi.com/propertyExtendedSearch',
      params: {location: loc, status_type: 'ForRent', page: String(x)},
      headers: {
        'X-RapidAPI-Key': '77584fabd8mshd80c98caeae0bcep1cbf38jsn5309b9cb654e',
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      }
    };
    await sleep(700)
      axios.request(options).then(function (response) {
        list = []
        list.push(response.data['props']);
    }).catch(function (error) {
      console.error(error);
    }).finally(function () {
        RestofCode()
    });}
  }
  function RestofCode(){
      importantinfo = []
      let loc = JSON.parse(fs.readFileSync('city.json'))
      if(fs.existsSync('data.json')){
        if(JSON.parse(fs.readFileSync('data.json'))[loc] != undefined){
          importantinfo = JSON.parse(fs.readFileSync('data.json'))[loc]}}
        else{
          importantinfo.push(loc)}
      list.forEach(element => {
        for(let i = 0; i < element.length; i++){
          let zpid = element[i]['zpid']
          let link = 'https://www.zillow.com/homes/'+ String(zpid) + '_zpid/'
          importantinfo.push([element[i]['address'], element[i]['latitude'], element[i]['longitude'], element[i]['price'],
          ["Price: $" + element[i]['price'] + "\nBedrooms: " +element[i]['bedrooms']], element[i]['bedrooms'], link])
        }});
    function Unique(arr) {
      var uniques = [];
      var itemsFound = {};
      for(var i = 0, l = arr.length; i < l; i++) {
          var stringified = JSON.stringify(arr[i]);
          if(itemsFound[stringified]) { continue; }
          uniques.push(arr[i]);
          itemsFound[stringified] = true;
      }
      return uniques;
  }
  let key = JSON.parse(fs.readFileSync('city.json'))
  datass[key] = Unique(importantinfo);
      let data = JSON.stringify(datass);
      fs.writeFileSync('data.json', data);
  }

function sleep(ms) {
  return new Promise((accept) => {
    setTimeout(() => {
      accept();
  }, ms)
});
}
let lists = ['Atlanta, GA', 'Cambridge, MA', 'College Hill, Providence, RI', 'Providence, RI', 'Manhattan, New York', 'San Francisco, CA', 'Boston, MA', 'Baltimore, MD', 
            'Philadelphia, PA']
async function runner(){
  for(const key of lists){
    fs.writeFileSync('city.json', JSON.stringify(key))
    dowork()
    await sleep(10000)
}}

runner()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http')

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(datass);
});   
const hostname = '127.0.0.1';  
const port = 3000;  
const server = http.createServer((req, res) => {  
  res.writeHead(200);
  res.end(JSON.stringify(datass))
});  
server.listen(port, hostname, () => {  
  console.log(`Server running at http://${hostname}:${port}/`);  
});

/**2Go5v6wqFqscSVuoRbbXM3tjwbC_3VBVaDJ1rcejbZB5764J8 */