const mySecret = process.env['API_KEY'] // Hidden API key is in environment
// const fs = require('fs')
const express = require('express'); // Express is needed to make API calls
const app = express(); // This activates Express
const port = process.env.PORT || 3000; // Hidden API key is in environment
const cors = require('cors'); // Using cors to allow the client to see the response and data
// const google = require('googleapis') // Later realized I may not need to use the google apis
// const https = require('https') // Later realized I won't be needed https
const request = require('request') // Using the request for the api call 
const main_volumes_url = "https://www.googleapis.com/books/v1/volumes?q=" //This is the main url for getting volumes of books

// console.log('Books' ,google) Import for research

function sendRequest(link) {
  return new Promise(function (resolve, reject){
    request(link,{ json: true }, function (error, res, body){
      if(!error && res.statusCode == 200) {
        resolve(body)
      } else {
        reject(error);
      }
    });
  });
}

app.use(cors()) // Activate CORS so the client can see the data


app.get('/', (req, res) => res.send('Hello World!')) //Just using this as a base to know when my server is activally running

app.get('/books/:search/:maxResults/:orderBy/:printType/:projection/:filterType/:filter/:filterPayLoad', async (req, res) => {
  let searchLink = main_volumes_url+req.params.search //The main url with the search parameter attached
    if (req.params.filter !='none') { 
    searchLink = searchLink+' '+ req.params.filter+ req.params.filterPayLoad;//checking wether a filter such as 'inauthor:' is activate to add to the search
    }
  searchLink = searchLink+'&maxResults='+req.params.maxResults+'&orderBy='+req.params.orderBy+'&printType='+req.params.printType+'&projection='+req.params.projection //added all default paramters such as printType, proejection, orderBy, and maxResults

  if (req.params.filterType !='none') {
    searchLink = searchLink+'&filterType='+ req.params.filterType; // if the filter for free e-books or
  }
  try{
  let requested_book = await sendRequest(searchLink+"&key="+mySecret) // Needed to use an await and async to have node js wait for the result proir to sending it out
  res.send({"data":requested_book}) // return all the data to the client
  } catch (error) {
    res.sendStatus(404);
  }
  // console.log('Line 831 ', requested_book)


}) 

app.listen(port); //Have my node js server run
