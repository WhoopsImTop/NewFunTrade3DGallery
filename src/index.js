import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Card } from './classes/card/card.js'
const filePaths = require('../static/textures/imagePaths.json');

import * as dat from 'dat.gui'
const gui = new dat.GUI()
let selectedCard = null;

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
for(let i = 0; i < 10; i++) {
    const card = new Card(filePaths[i].front, filePaths[i].back)
    const geometry = card.createGeometry()
    //change the card position
    geometry.position.x = i * 10
    scene.add(geometry)
}
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// light
const areaLight = new THREE.AmbientLight(0xffffff, 20)
areaLight.position.set(0, 50, 10)
scene.add(areaLight)


// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.001,
  5000
)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 50
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.enableZoom = false
controls.enablePan = false
controls.dampingFactor = 0.05
controls.maxDistance = 1000
controls.minDistance = 30
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN,
}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x0ca5e6, 1)


const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
mouse.x = (sizes.width / 2) / sizes.width
mouse.y = -(sizes.height / 2) / sizes.height
raycaster.setFromCamera(mouse, camera)
const intersects = raycaster.intersectObjects(scene.children)

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //mesh.rotation.y += 0.01 * Math.sin(1)
  //mesh.rotation.y += 0.01 * Math.sin(1)

  //select card on mouseover#
  if (intersects.length > 0) {
    if (selectedCard !== intersects[0].object) {
      selectedCard = intersects[0].object
      selectedCard.material.color.set(0xffffff)
    }
  } else {
    if (selectedCard) {
      selectedCard.material.color.set(0xffffff)
      selectedCard = null
    }
  }

  //get selected Card and rotate it
  if(selectedCard) {
    selectedCard.rotation.y += 0.01 * Math.sin(1)
  }


  // Update controls
  controls.update()
  // Render
  renderer.render(scene, camera)



  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
