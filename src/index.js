import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Card } from "./classes/card/card.js";
import gsap from "gsap";
import { Interaction } from "three.interaction";
import Stats from 'stats.js'

//Monitoring
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const filePaths = require("../static/textures/imagePaths.json");
let selected;
let cards = [];
let progressbar = document.getElementById("progressbar");

document.getElementById("preloadButton").addEventListener("click", () => {
    for (let i = 0; i < filePaths.length;) {
        const card = new Card(filePaths[i].front, filePaths[i].back);
        const geometry = card.createGeometry();
        //change the card position
        geometry.position.x = Math.random() * 500 - 250;
        geometry.position.y = Math.random() * 200 - 100;
        geometry.position.z = Math.random() * 1000 - 500;
        cards.push(geometry);
        i++;
    }
    setTimeout(() => {
        progressbar.value = 30;
    }, 1000);
    setTimeout(() => {
        progressbar.value = 80;
    }, 2000);
    setTimeout(() => {
        progressbar.value = 100;
        runThreeJS();
    }, 5000);
});

function runThreeJS() {
    document.querySelector('.textContianer').innerHTML = "";
    document.querySelector(".action-container").style.display = "flex";
    // generate HTML Canvas
    let htmlCanvas = document.createElement("canvas");
    htmlCanvas.classList.add("webgl");
    let body = document.querySelector("body");
    body.appendChild(htmlCanvas);
    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // Scene
    const scene = new THREE.Scene();

    /**
     * Object
     */
    for (let i = 0; i < cards.length; i++) {
        cards[i].on("click", () => {
            selected = cards[i];
            updateCamera(cards[i]);
        });
        cards[i].on("mouseover", () => {
            document.body.style.cursor = "pointer";
        });
        cards[i].on("mouseout", () => {
            document.body.style.cursor = "default";
        });
        scene.add(cards[i]);
    }
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    // light
    const areaLight = new THREE.AmbientLight(0xffffff, 1);
    areaLight.position.set(0, 50, 10);
    scene.add(areaLight);

    // Base camera
    const camera = new THREE.PerspectiveCamera(
        35,
        sizes.width / sizes.height,
        0.001,
        200
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = true;
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

    document.querySelector(".btn.minus").addEventListener("click", () => {
        index--;
        if (index < 0) {
            index = filePaths.length;
        }
        selected = scene.children[index];
        updateCamera(selected);
    });

    document.querySelector(".btn.plus").addEventListener("click", () => {
        index++;
        if (index == filePaths.length) {
            index = 0;
        }
        selected = scene.children[index];
        updateCamera(selected);
    });

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0ca5e6, 1); //0x0ca5e6

    const interaction = new Interaction(renderer, scene, camera);

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    const tick = () => {
        stats.begin()
        const elapsedTime = clock.getElapsedTime();

        if (selected) {
            selected.rotation.y += 0.002;
            selected.position.y += Math.cos(elapsedTime) * 0.01;
            if (selected.children[0].material.opacity < 0.9) {
                selected.children[0].material.opacity += 0.01;
            }
        }
        // Update controls
        controls.update();
        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
        stats.end()
    };

    tick();

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

    function updateCamera(selected) {
        gsap.to(controls.target, {
            x: selected.position.x,
            y: selected.position.y,
            z: selected.position.z,
        });
        gsap.to(camera.position, {
            duration: 2,
            delay: 0,
            x: selected.position.x,
            y: selected.position.y,
            z: selected.position.z + 50,
            ease: "power4.easeOut",
        });

        camera.lookAt(selected.position);

        for (let i = 0; i < filePaths.length; i++) {
            scene.children[i].material[4].map.image.pause();
            scene.children[i].material[5].map.image.pause();
            scene.children[i].children[0].material.visible = false;
        }
        selected.material[4].map.image.play();
        selected.material[5].map.image.play();
        selected.children[0].material.visible = true;
    }
}