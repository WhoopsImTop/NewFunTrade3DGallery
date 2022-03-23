import * as THREE from "three";

export class Card {
    constructor(frontVideo, backVideo) {
        this.frontVideo = frontVideo;
        this.backVideo = backVideo;
    }

    createGeometry() {
        const geometry = new THREE.BoxGeometry(9, 16, 0.1);
        const circleGeometry = new THREE.CylinderBufferGeometry(
            6,
            6,
            6,
            50,
            1,
            true
        );
        geometry.uvsNeedUpdate = true;
        const material = [
            new THREE.MeshToonMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                transparent: true,
                wireframeLinewidth: 5,
            }),
            new THREE.MeshToonMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                transparent: true,
                wireframeLinewidth: 5,
            }),
            new THREE.MeshToonMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                transparent: true,
                wireframeLinewidth: 5,
            }),
            new THREE.MeshToonMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                transparent: true,
                wireframeLinewidth: 5,
            }),
            new THREE.MeshToonMaterial({
                map: new THREE.VideoTexture(this.createVideoElement(this.frontVideo)),
                side: THREE.FrontSide,
                transparent: true,
            }),
            new THREE.MeshToonMaterial({
                map: new THREE.VideoTexture(this.createVideoElement(this.backVideo)),
                side: THREE.FrontSide,
                transparent: true,
            }),
        ];
        const image = new THREE.TextureLoader();
        const circleMat = new THREE.MeshBasicMaterial({
            map: image.load('textures/gradient.png'),
            transparent: true,
            visible: false,
            opacity: 0.0
        });

        const circle = new THREE.Mesh(circleGeometry, circleMat);
        circle.position.set(0, -6, 0);
        circle.renderOrder = 1;
        const card = new THREE.Mesh(geometry, material);
        card.position.set(0, 0, 0);
        card.renderOrder = 0;
        card.add(circle);
        return card;
    }

    createVideoElement(video) {
        const videoElement = document.createElement("video");
        videoElement.src = video;
        videoElement.setAttribute("crossorigin", "anonymous");
        videoElement.setAttribute("webkit-playsinline", "webkit-playsinline");
        videoElement.setAttribute("playsinline", "playsinline");
        videoElement.setAttribute("muted", "muted");
        videoElement.setAttribute("loop", "loop");
        videoElement.setAttribute("preload", "auto");

        return videoElement;
    }
}