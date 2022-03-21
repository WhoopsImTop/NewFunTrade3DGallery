import * as THREE from 'three';

export class Card {
    constructor(frontVideo, backVideo) {
        this.frontVideo = frontVideo;
        this.backVideo = backVideo;
    }

    createGeometry() {
        const geometry = new THREE.BoxGeometry(9, 16, 0.1);
        geometry.uvsNeedUpdate = true
        const material = [
            new THREE.MeshBasicMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                transparent: true,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                transparent: true,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                transparent: true,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                transparent: true,
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.VideoTexture(this.createVideoElement(this.frontVideo)),
                side: THREE.FrontSide,
                transparent: true,
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.VideoTexture(this.createVideoElement(this.backVideo)),
                side: THREE.FrontSide,
                transparent: true
            }),
        ];
        const card = new THREE.Mesh(geometry, material);
        card.position.set(0, 0, 0);
        return card;
    }

    createVideoElement(video) {
        const videoElement = document.createElement('video');
        videoElement.src = video;
        videoElement.setAttribute('crossorigin', 'anonymous');
        videoElement.setAttribute('webkit-playsinline', 'webkit-playsinline');
        videoElement.setAttribute('playsinline', 'playsinline');
        videoElement.setAttribute('muted', 'muted');
        videoElement.setAttribute('loop', 'loop');
        videoElement.setAttribute('preload', 'auto');

        return videoElement;
    }
}