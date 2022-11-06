const axios = require("axios");
const fs = require('fs');
const NodeGeocoder = require('node-geocoder');



let locc = JSON.parse(fs.readFileSync('location.json'))

const options = {
  provider: 'google',
  apiKey: 'AIzaSyAcbzRAiaNGNy3SLnb17EWS0a-uXSitG6o'
};

async function tester(){
  const geocoder = NodeGeocoder(options);
  const ress = await geocoder.geocode(locc);
  return ([ress[0]['latitude'], ress[0]['longitude']])
}

tester().then(function(result) {
  let coord = {}
  coord['loc'] = locc
  coord['latitude'] = result[0]
  coord['longitude'] = result[1]
  fs.writeFileSync('coordinates.json', JSON.stringify(coord))
})

/** 
let list = []
let finallist = []
let datass = {}
let importantinfo = new Array();
async function dowork(loc){
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
        RestofCode(loc)
    });}
  }
  function RestofCode(loc){
      importantinfo = []
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
    dowork(key)
    await sleep(10000)
}}

runner()

const express = require("express");
const app = express();
app.get("/", function (req, res) {
    res.end(JSON.stringify(datass));
});
app.listen(3005, function () {
    console.log("Server is running on www.localhost:3001");
});

*/
// defining an array to work as the database (temporary solution)

/**2Go5v6wqFqscSVuoRbbXM3tjwbC_3VBVaDJ1rcejbZB5764J8 */