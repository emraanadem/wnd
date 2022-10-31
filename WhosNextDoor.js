const axios = require("axios");
const fs = require('fs');

let list = []
let finallist = []
async function dowork(){
  let loc = JSON.parse(fs.readFileSync('city.json'))['city']
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
        list.push(response.data['props']);
    }).catch(function (error) {
      console.error(error);
    }).finally(function () {
        RestofCode()
    });}
  }
  function RestofCode(){
      let loc = JSON.parse(fs.readFileSync('city.json'))['city']
      let importantinfo = []
      importantinfo.push(loc)
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
  importantinfo = Unique(importantinfo);
      let data = JSON.stringify(importantinfo);
      fs.writeFileSync('data.json', data);
  }

function sleep(ms) {
  return new Promise((accept) => {
    setTimeout(() => {
      accept();
  }, ms)
});
}

dowork()

