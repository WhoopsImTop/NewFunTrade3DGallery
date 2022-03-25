import { Card } from "../../classes/card/card.js";
const filePaths = require("../../../static/textures/imagePaths.json");

self.addEventListener("message", function(e) {
    let cardArray = [];
    for (let i = 0; i < filePaths.length;) {
        const card = new Card(filePaths[i].front, filePaths[i].back);
        const geometry = card.createGeometry();
        //change the card position
        geometry.position.x = Math.random() * 500 - 250;
        geometry.position.y = Math.random() * 200 - 100;
        geometry.position.z = Math.random() * 1000 - 500;
        geometry.on("click", () => {
            selected = geometry;
            updateCamera(geometry);
        });
        geometry.on("mouseover", () => {
            document.body.style.cursor = "pointer";
        });
        geometry.on("mouseout", () => {
            document.body.style.cursor = "default";
        });
        cards.push(geometry);
        i++;
    }
    self.postMessage(cardArray);
    self.close();
});