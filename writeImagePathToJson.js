let fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const { serialize } = require('v8')

async function writeImagePathToJSONFile() {
  let dir = 'static/textures/catchyTuneRadio/'
  let file = 'imagePaths.json'

  await fs.readdir(dir, (err, files) => {
    if (err) {
      console.log(err)
    } else {
      let imagePaths = []
      files.forEach(async (file) => {
        let searchParam = file.split('-')[0].replace(/[aeiouAEIOZ]/g, '_')
        if (searchParam != '__') {
          let link =
            'https://opensea.io/NewFunTradeGallery?search[sortBy]=LISTING_DATE&search[query]=' +
            searchParam
          imagePaths.push({
            link: link,
          })
        }
        file++
      })
      fs.writeFile(file, JSON.stringify(imagePaths, null, 2), (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('File written successfully')
        }
      })
    }
  })
}
writeImagePathToJSONFile()
