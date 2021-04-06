const express = require('express')
const fetch = require('node-fetch');
const fs = require('fs');
const app = express();
const compress_images = require("compress-images");
const { features } = require('process');

const port = 3000
let url = 'https://www.tannoy.com/.rest/musictribe/v1/products/product-feature?brandName=tannoy&modelCode=P0C2C'

const input_path = 'public/image/*.png';
const outpath_path = 'public/compressed/';

async function compressImage(input_path, outpath_path) {
        compress_images(input_path, outpath_path, {compress_force: false, statistic: false, autoupdate: true}, false,
          {jpg: {engine: false, command: false}},
          {png: {engine: 'pngquant', command: ['--quality=40-60', '-o']}},
          {svg: {engine: false, command: false}},
          {gif: {engine: false, command: false}}, function(err, completed, statistic){
              if(err === null){
                fs.unlink(statistic.input, (err) => {
                  if (err) throw err;
                  console.log('successfully compressed and deleted '+statistic.input);
              });
      }
      });
}

async function downloadImg(image) {
    const response = await fetch(image);
    const buffer = await response.buffer();

    fs.writeFile(`./public/image/${Date.now()}.png`, buffer, (err) => {
      if (err) throw err;
    });
}

async function downloadDescrp(description) {
  fs.writeFile(`./public/text/description.txt`, description, (err)   => {
    if (err) throw err;
      console.log('Data written to file');
    });
}

async function downloadPfi(pfi) {
  fs.writeFile(`./public/text/pfi.txt`, pfi, (err)   => {
    if (err) throw err;
      console.log('Pfi written to file');
    });
}

async function downloadFeatures(features) {
  fs.writeFile(`./public/text/features.txt`, features, (err)   => {
    if (err) throw err;
      console.log('Pfi written to file');
    });
}

app.get('/', function(request, response){
  response.send(`HEllo`);
});
// images array
// features object
      //  description string
    //  pfi  array
// marketingCopies array
    // marketingText string
   // title string

app.get('/data', function(req, res) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    //console.log(data)
    // pl:
    const images = data.product.images.map(i => i.zoomUrl);
    const descriptions = data.marketingCopies.map(i => i.marketingText);
    const title = data.marketingCopies.map(i => i.title);
    const features = data.features.description;
    const pfi = data.features.pfi;

    /*downloadDescrp(descriptions);
    downloadPfi(pfi);
    downloadFeatures(features);*/

    images.forEach((image, index) => {
      //console.log(images);
      //downloadImg(image);
      /*const img = document.createElement('img')
      img.src = image;
      document.body.appendChild(img);*/
    });
  });
  compressImage(input_path, outpath_path)
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})