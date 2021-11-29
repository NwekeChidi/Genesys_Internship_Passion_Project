// Get all packages
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const express = require("express");
const download = require('image-downloader');
const path = require("path");

// Initializing express
const app = express();

// Get data from web using the url 
//const url = "https://www.pinterest.com/ohjoy/clothing/"
const url = "https://www.pinterest.com/aniya333/a-t-t-i-r-e/"

// catch unhandled Rejections
process.on('unhandledRejection', err => {
    console.log('unhandledRejection', err.message)
});

puppeteer.launch()
    .then(browser => browser.newPage())
        .then(page => {
            return page.goto(url).then( () => {
                return page.content();
            });
        }).then(html => {

            const $ = cheerio.load(html);
            const resData = JSON.parse($("#__PWS_DATA__")[0]["children"][0]["data"])
            const imgUrls = [];


            const trimmedData = resData.props.initialReduxState.pins
            Object.keys(trimmedData).forEach(key => {
                let imgObj = trimmedData[key].images;
                Object.keys(imgObj).forEach(currImg => {
                    imgUrls.push(imgObj[currImg].url)
                })
            })
            console.log(imgUrls);
            console.log("Size :", imgUrls.length)

            // test out
            // //uncomment line below
            // let imageUrls = [], idxS = [0, 3, 9, 15, 21];
            // idxS.forEach(idx => imageUrls.push(imgUrls[idx]));

            // Download the images from the links
            // change imgUrls below to imageUrl to test
            imgUrls.forEach(imgUrl => {

                const options = {
                    dest : path.join(__dirname, "/../Web_Scrapper_NodeJS/scrapped_Images/")
                }

                const resolution = '474x'
                // Select images to save.
                options.url = imgUrl.indexOf(resolution) > -1 || imgUrl.indexOf('originals') > -1 ? imgUrl : 0;

                if (options.url !== 0){
                    download.image(options)
                        .then(({ filename }) => {
                            console.log('Saved to', filename)
                        })
                        .catch( (err) => {
                            console.error(err)
                        })
                }
            })
        })
        .catch( (err) => {
            console.error(err)
        })

// Listen to port
const PORT = 8080;
app.listen(PORT, () => {
    console.log("Server is live on port: ", PORT)
})