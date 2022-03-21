import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Card } from "./classes/card/card.js";
import onPointerMove from './modules/PointerEvents/onPointerMove.js'
const filePaths = require("../static/textures/imagePaths.json");
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

import * as dat from "dat.gui";
const gui = new dat.GUI();
let selected;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
for (let i = 0; i < 10; i++) {
    const card = new Card(filePaths[i].front, filePaths[i].back);
    const geometry = card.createGeometry();
    //change the card position
    geometry.position.x = Math.random() * 300 - 150;
    geometry.position.y = Math.random() * 200 - 100;
    geometry.position.z = Math.random() * 400 - 200;
    scene.add(geometry);
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// light
const areaLight = new THREE.AmbientLight(0xffffff, 20);
areaLight.position.set(0, 50, 10);
scene.add(areaLight);

// Base camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.001,
    5000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 50;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enableZoom = false
controls.enablePan = false;
controls.dampingFactor = 0.05;
controls.maxDistance = 1000;
controls.minDistance = 30;
controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
};
/**
 * Renderer
 */

let index = 0;

document.querySelector('.btn.minus').addEventListener('click', () => {
    index--
})

document.querySelector('.btn.plus').addEventListener('click', () => {
    index++
})

console.log(scene.children[index])

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});


renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0ca5e6, 1);

window.addEventListener("pointermove", (event) => {
    let move = onPointerMove(event);
    pointer.x = move.x;
    pointer.y = move.y;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    //mesh.rotation.y += 0.01 * Math.sin(1)
    //mesh.rotation.y += 0.01 * Math.sin(1)

    // update the picking ray with the camera and pointer position
    /* scene.children[index].position.copy(camera.position);
    scene.children[index].rotation.copy(camera.rotation);
    scene.children[index].updateMatrix();
    scene.children[index].translateZ(-50); */
    camera.position.copy(scene.children[index].position);
    camera.rotation.copy(scene.children[index].rotation);
    camera.updateMatrix();
    camera.translateZ(-50);
    scene.children[index].material[4].map.image.play();
    scene.children[index].material[5].map.image.play();
    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        if (selected != intersects[0].object) selected = intersects[0].object;

        selected.rotation.y += 0.01;
    } else {
        if (selected) {
            selected.rotation.y = 0;
            selected = null;
        }
    }

    // Update controls
    controls.update();
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();