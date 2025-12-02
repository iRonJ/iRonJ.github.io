import * as THREE from 'three';

export class Interactable {
    constructor(geo, mat, name, cb) {
        this.mesh = new THREE.Mesh(geo, mat);
        this.name = name;
        this.onInteract = cb;
        this.mesh.userData = { parent: this };
    }
}

export const input = {
    moveVector: new THREE.Vector2(0, 0),
    looking: false,
    keys: { w: false, a: false, s: false, d: false }
};

export function setupInput(cameraGroup, camera, renderer, raycaster, interactables, modalOverlay) {
    document.addEventListener('keydown', e => { if (input.keys[e.key.toLowerCase()] !== undefined) input.keys[e.key.toLowerCase()] = true; });
    document.addEventListener('keyup', e => { if (input.keys[e.key.toLowerCase()] !== undefined) input.keys[e.key.toLowerCase()] = false; });

    const jz = document.getElementById('joystick-zone');
    const jk = document.getElementById('joystick-knob');
    let jId = null, jc = { x: 0, y: 0 };

    const upJ = (x, y) => {
        const R = 40;
        let dx = x - jc.x, dy = y - jc.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > R) { const r = R / d; dx *= r; dy *= r; }
        jk.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
        input.moveVector.set(dx / R, -(dy / R));
    };

    const endJ = e => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === jId) {
                jId = null; input.moveVector.set(0, 0); jk.style.transform = 'translate(-50%,-50%)'; break;
            }
        }
    };

    jz.addEventListener('touchstart', e => {
        if (modalOverlay.style.display === 'flex') return;
        e.preventDefault();
        const t = e.changedTouches[0];
        jId = t.identifier;
        const r = jz.getBoundingClientRect();
        jc = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        upJ(t.clientX, t.clientY);
    }, { passive: false });

    jz.addEventListener('touchmove', e => {
        if (modalOverlay.style.display === 'flex') return;
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === jId) {
                upJ(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                break;
            }
        }
    }, { passive: false });

    jz.addEventListener('touchend', endJ);
    jz.addEventListener('touchcancel', endJ);

    const lz = document.getElementById('touch-look-zone');
    let lx = 0, ly = 0;
    let lId = null;

    lz.addEventListener('touchstart', e => {
        if (modalOverlay.style.display === 'flex') return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier !== jId) {
                lId = e.changedTouches[i].identifier;
                lx = e.changedTouches[i].clientX;
                ly = e.changedTouches[i].clientY;
                input.looking = true;
                break;
            }
        }
    }, { passive: false });

    lz.addEventListener('touchmove', e => {
        if (!input.looking || modalOverlay.style.display === 'flex') return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === lId) {
                const t = e.changedTouches[i];
                const dx = t.clientX - lx, dy = t.clientY - ly;
                cameraGroup.rotation.y -= dx * 0.005;
                camera.rotation.x = Math.max(-1.5, Math.min(1.5, camera.rotation.x - dy * 0.005));
                lx = t.clientX; ly = t.clientY;
                break;
            }
        }
    }, { passive: false });

    const endL = e => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === lId) {
                input.looking = false; lId = null; break;
            }
        }
    };
    lz.addEventListener('touchend', endL);
    lz.addEventListener('touchcancel', endL);

    lz.addEventListener('click', e => {
        if (modalOverlay.style.display === 'flex') return;
        const r = renderer.domElement.getBoundingClientRect();
        raycaster.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
        const hits = raycaster.intersectObjects(interactables.map(i => i.mesh ? i.mesh : i)); // Handle both Interactable objects and Meshes if needed, but here we pass meshes
        if (hits.length > 0 && hits[0].distance < 6) {
            const t = hits[0].object.userData.parent;
            if (t) t.onInteract(t, hits[0]);
        }
    });

    let md = false;
    document.addEventListener('mousedown', () => md = true);
    document.addEventListener('mouseup', () => md = false);
    document.addEventListener('mousemove', e => {
        if (md && document.getElementById('start-screen').style.display === 'none' && modalOverlay.style.display !== 'flex') {
            cameraGroup.rotation.y -= e.movementX * 0.003;
            camera.rotation.x = Math.max(-1.5, Math.min(1.5, camera.rotation.x - e.movementY * 0.003));
        }
    });
}
