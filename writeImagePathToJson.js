let fs = require('fs');

function writeImagePathToJSONFile() {
    let dir = 'static/textures/catchyTuneRadio/';
    let file = 'imagePaths.json';
    
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            let imagePaths = [];
            files.forEach(file => {
                imagePaths.push({
                    front: 'textures/catchyTuneRadio/' + file,
                    back: 'textures/catchyTuneRadio/' + '_backside-cover-catchy-tune-radio-ctr-as-01-nft(1).mp4'
                });
            });
            fs.writeFile(file, JSON.stringify(imagePaths, null, 2), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('File written successfully');
                }
            });
        }
    });
}
writeImagePathToJSONFile();