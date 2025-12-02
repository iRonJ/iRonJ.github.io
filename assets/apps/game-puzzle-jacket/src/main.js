import * as THREE from 'three';
import './style.css';
import { STATE } from './game/state.js';
import { sfx } from './game/audio.js';
import { setupInput, input } from './game/interaction.js';
import { buildRoom, spawnItems, interactables, drawers, obstacles, globalUniforms, chkCol } from './game/world.js';
import { modalOverlay } from './game/ui.js';

// --- SCENE ---
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x111111, 0.05);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x404040, 1.5));
const pl = new THREE.PointLight(0xffaa00, 1, 20); pl.position.set(2, 3, 2); pl.castShadow = true; scene.add(pl);
const winLight = new THREE.PointLight(0xddeeff, 2, 8); winLight.position.set(0, 2.2, -4.5); scene.add(winLight);

const cameraGroup = new THREE.Group(); cameraGroup.position.set(0, 1.0, 3); cameraGroup.add(camera); scene.add(cameraGroup);
const raycaster = new THREE.Raycaster();

// --- INIT & LOOP ---
document.getElementById('start-btn').addEventListener('click', () => {
    try {
        sfx.init();
        document.getElementById('start-screen').style.display = 'none';
        STATE.startTime = Date.now();
        buildRoom(scene); spawnItems(scene);
        STATE.wakingUp = true; STATE.ready = true;
    } catch (e) { alert('Error: ' + e.message); }
});

setupInput(cameraGroup, camera, renderer, raycaster, interactables, modalOverlay);

const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
    if (!STATE.ready) return;
    const dt = clock.getDelta(); globalUniforms.u_time.value += dt;
    if (STATE.wakingUp) { cameraGroup.position.y += dt * 0.6; if (cameraGroup.position.y >= 2.2) { cameraGroup.position.y = 2.2; STATE.wakingUp = false; } }
    if (modalOverlay.style.display === 'flex') { renderer.render(scene, camera); return; }

    // Animate Drawers
    drawers.forEach(d => {
        if (!d || d.children.length === 0) return;
        const dMesh = d.children[0];
        const isOpen = dMesh.userData.isOpen;
        const baseZ = -3.9;
        const targetZ = isOpen ? (baseZ + 1.2) : baseZ;
        d.position.z += (targetZ - d.position.z) * 0.1;
    });

    const y = cameraGroup.rotation.y, f = input.moveVector.y + (input.keys.w ? 1 : 0) - (input.keys.s ? 1 : 0), s = input.moveVector.x - (input.keys.a ? 1 : 0) + (input.keys.d ? 1 : 0);
    if (f || s) {
        const dx = Math.sin(y) * -f + Math.cos(y) * s, dz = Math.cos(y) * -f + Math.sin(y) * -s;
        const px = cameraGroup.position.x + dx * 0.08, pz = cameraGroup.position.z + dz * 0.08;
        if (!chkCol({ x: px, z: cameraGroup.position.z })) cameraGroup.position.x = px;
        if (!chkCol({ x: cameraGroup.position.x, z: pz })) cameraGroup.position.z = pz;
    }
    renderer.render(scene, camera);
});

window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
