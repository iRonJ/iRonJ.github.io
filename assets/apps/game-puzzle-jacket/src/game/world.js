import * as THREE from 'three';
import { STATE, ITEMS } from './state.js';
import { ASSETS } from './assets.js';
import { Interactable as BaseInteractable } from './interaction.js';
import { showMessage, showModal } from './ui.js';
import { sfx } from './audio.js';
import { takeItem, useItem, giveItem, hasItem } from './logic.js';
import { snowVS, snowFS, waterVS, waterFS, treeVS, treeFS } from './shaders.js';

export const interactables = [];
export const obstacles = [];
export const drawers = [];
export const globalUniforms = { u_time: { value: 0.0 } };

class Interactable extends BaseInteractable {
    constructor(geo, mat, name, cb) {
        super(geo, mat, name, cb);
        interactables.push(this.mesh);
    }
}

function noise(x, z) { return Math.sin(x) * Math.cos(z) + Math.sin(x * 2.1 + z * 1.8) * 0.5; }

function addObstacle(x, z, w, d) { obstacles.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 }); }

let growingPlantMesh = null;

export function checkGrowth(scene) {
    if (STATE.flags.plantPlaced && STATE.flags.seedsAdded && STATE.flags.waterAdded) {
        showMessage("The seed cracks! A glowing vine erupts, spreading across the frozen glass!", 4000); sfx.grow();
        let s = 0;
        const i = setInterval(() => {
            s += 0.05;
            if (growingPlantMesh) growingPlantMesh.material.uniforms.u_growth.value = s;
            if (s > 5) { clearInterval(i); openPortal(scene); }
        }, 200);
    }
}

function openPortal(scene) {
    showMessage("The air tears open! A PORTAL!", 4000); sfx.success(); STATE.flags.portalOpen = true;
    const p = new Interactable(new THREE.CircleGeometry(2, 32), new THREE.ShaderMaterial({ uniforms: { u_time: globalUniforms.u_time, u_color: { value: new THREE.Color(0x00ffff) } }, vertexShader: waterVS, fragmentShader: waterFS, transparent: true, side: THREE.DoubleSide }), "Portal", () => teleportToBeach(scene));
    p.mesh.position.set(0, 2.5, -4.8); scene.add(p.mesh);
}

export function spawnPlacedPot(pos, scene) {
    const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.4), new THREE.MeshStandardMaterial({ color: 0x8b4513 })));
    const z = new Interactable(new THREE.BoxGeometry(1.5, 2, 1.5), new THREE.MeshBasicMaterial({ visible: false }), "Plant Pot", () => {
        if (STATE.flags.portalOpen) { teleportToBeach(scene); return; }

        // NO ITEM SELECTED - INSPECT
        if (!STATE.activeItem) {
            if (STATE.flags.seedsAdded && STATE.flags.waterAdded) {
                showMessage("It's growing...");
            } else if (STATE.flags.seedsAdded) {
                showMessage("The seed rests in the dirt, thirsting for a blessing.");
            } else if (STATE.flags.waterAdded) {
                showMessage("The soil is perfectly damp with holy essence, but needs life.");
            } else if (STATE.flags.plainWaterAdded) {
                showMessage("The soil is wet and muddy, but feels lifeless.");
            } else {
                showMessage("The soil is dry and barren.");
            }
            return;
        }

        // ITEM SELECTED - INTERACT
        if (STATE.activeItem.id.includes('seed')) {
            useItem(STATE.activeItem.id);
            STATE.flags.seedsAdded = true;
            showMessage("You bury the seed in the dark earth.");
            checkGrowth(scene);
        }
        else if (STATE.activeItem.id === 'glass_holy' || STATE.activeItem.id === 'vial') {
            useItem(STATE.activeItem.id);
            STATE.flags.waterAdded = true;
            STATE.flags.plainWaterAdded = false;
            showMessage("You pour the blessed water. It shimmers.");
            checkGrowth(scene);
        }
        else if (STATE.activeItem.id === 'glass_water') {
            if (STATE.flags.waterAdded) {
                showMessage("The soil is already damp with holy essence. No need for more.");
            } else {
                showMessage("You water the earth. Now it is just wet, boring soil.");
                useItem('glass_water');
                giveItem(ITEMS.glass_empty, true);
                STATE.flags.plainWaterAdded = true;
            }
        }
    });
    z.mesh.position.y = 1.0; g.add(z.mesh);

    // Shader Plant (Fractal Vine - Large Plane)
    const treeMat = new THREE.ShaderMaterial({
        uniforms: { u_time: globalUniforms.u_time, u_growth: { value: 0.0 } },
        vertexShader: treeVS,
        fragmentShader: treeFS,
        transparent: true,
        side: THREE.DoubleSide
    });
    const treeMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), treeMat);
    treeMesh.position.set(0, 2.5, -0.2);
    g.add(treeMesh);
    growingPlantMesh = treeMesh;

    g.position.copy(pos); scene.add(g);
}

export function teleportToBeach(scene) {
    STATE.isBeach = true; interactables.length = 0; obstacles.length = 0; drawers.length = 0;

    // Keep camera group, remove everything else
    const cameraGroup = scene.children.find(c => c.type === 'Group' && c.children[0] && c.children[0].isCamera);

    while (scene.children.length > 0) { scene.remove(scene.children[0]); }
    if (cameraGroup) scene.add(cameraGroup);

    scene.fog = new THREE.FogExp2(0xffffff, 0.002); scene.background = new THREE.Color(0x87CEEB);

    const sun = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffff00 })); sun.position.set(50, 100, -100); scene.add(sun);

    const geo = new THREE.PlaneGeometry(200, 200, 64, 64); geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i); const z = pos.getZ(i);
        pos.setY(i, noise(x * 0.05, z * 0.05) * 2 + noise(x * 0.1, z * 0.1) * 0.5);
    }
    geo.computeVertexNormals();
    scene.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xf4a460, roughness: 0.9 })));

    const w = new THREE.Mesh(new THREE.PlaneGeometry(200, 50), new THREE.ShaderMaterial({ uniforms: { u_time: globalUniforms.u_time, u_color: { value: new THREE.Color(0x0077be) } }, vertexShader: waterVS, fragmentShader: waterFS, transparent: true }));
    w.rotation.x = -Math.PI / 2; w.position.set(0, 0.5, -20); scene.add(w);

    const b = new Interactable(new THREE.BoxGeometry(1.5, 1, 1.5), new THREE.MeshStandardMaterial({ map: ASSETS.texBasket }), "Picnic Basket", () => {
        if (!STATE.flags.gameEnded) {
            giveItem(ITEMS.jacket);
            sfx.success();
            const endTime = Date.now();
            const duration = endTime - STATE.startTime;
            const seconds = Math.floor((duration / 1000) % 60);
            const minutes = Math.floor((duration / (1000 * 60)) % 60);
            const timeString = `${minutes}m ${seconds}s`;
            let msg = `FOUND YOUR JACKET! WIN! Time: ${timeString}`;
            if (hasItem('socks_dirty')) {
                msg += " You chose to wear the dirty socks...";
            } else {
                msg += " You chose the clean socks!";
            }
            showMessage(msg);
            STATE.flags.gameEnded = true;
        }
    });
    b.mesh.position.set(5, 1.5, 2); scene.add(b.mesh);

    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 4), new THREE.MeshStandardMaterial({ color: 0x5d4037 })); t.position.set(8, 2, 2); scene.add(t);
    const l = new THREE.Mesh(new THREE.ConeGeometry(2, 1, 8), new THREE.MeshStandardMaterial({ color: 0x00aa00 })); l.position.set(8, 4, 2); scene.add(l);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    if (cameraGroup) cameraGroup.position.set(0, 3, 10);
}

export function buildRoom(scene) {
    const g = new THREE.Group();
    addObstacle(-3, 0, 3.2, 6.2); addObstacle(-3, -4, 1.6, 1.6); addObstacle(3, -4, 1.6, 1.6); addObstacle(4, 0, 2.2, 1.6);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ map: ASSETS.texFloor })); fl.rotation.x = -Math.PI / 2; g.add(fl);
    const cl = fl.clone(); cl.position.y = 4; cl.rotation.x = Math.PI / 2; g.add(cl);
    const wMat = new THREE.MeshStandardMaterial({ map: ASSETS.texLogs, side: THREE.DoubleSide });
    const wall = (x, y, z, ry, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wMat); m.position.set(x, y, z); m.rotation.y = ry; g.add(m); };
    wall(0, 2, -5, 0, 10, 4); wall(-5, 2, 0, Math.PI / 2, 10, 4); wall(5, 2, 0, -Math.PI / 2, 10, 4); wall(0, 2, 5, Math.PI, 10, 4);

    // Window (Interactive)
    const win = new Interactable(new THREE.PlaneGeometry(2.8, 1.8), new THREE.ShaderMaterial({ uniforms: globalUniforms, vertexShader: snowVS, fragmentShader: snowFS }), "Window", () => {
        if (STATE.flags.portalOpen) { teleportToBeach(scene); return; }
        showMessage("The glass is thick with frost. Outside, the white void seems endless.");
    });
    win.mesh.position.set(0, 2.5, -4.9); g.add(win.mesh);

    const sill = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 0.6), new THREE.MeshStandardMaterial({ map: ASSETS.texWood }));
    sill.position.set(0, 1.6, -4.7); g.add(sill);

    const zone = new Interactable(new THREE.BoxGeometry(3, 0.5, 1), new THREE.MeshBasicMaterial({ visible: false }), "Windowsill", (o) => {
        if (STATE.flags.portalOpen) { teleportToBeach(scene); return; }
        if (STATE.activeItem && STATE.activeItem.id === 'pot') {
            useItem('pot'); o.mesh.visible = false; spawnPlacedPot(new THREE.Vector3(0, 1.7, -4.7), scene);
            showMessage("The pot rests in the light, waiting for potential."); STATE.flags.plantPlaced = true; checkGrowth(scene);
        } else showMessage("A sunbeam pierces the gloom, warm but lonely.");
    });
    zone.mesh.position.set(0, 1.6, -4.5); g.add(zone.mesh);

    // Door
    const door = new Interactable(new THREE.PlaneGeometry(2, 3.5), new THREE.MeshStandardMaterial({ map: ASSETS.texDoor }), "Cabin Door", () => showMessage("It's frozen shut. Snow is piled high against it outside. No escape this way."));
    door.mesh.rotation.y = Math.PI; door.mesh.position.set(0, 1.75, 4.95); g.add(door.mesh);

    scene.add(g);
}

export function spawnItems(scene) {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 6), new THREE.MeshStandardMaterial({ color: 0x880000 })); bed.position.set(-3, 0.5, 0); scene.add(bed);
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshStandardMaterial({ map: ASSETS.texWood })); table.position.set(-3, 0.75, -4); scene.add(table);

    const note = new Interactable(new THREE.PlaneGeometry(0.8, 0.6), new THREE.MeshBasicMaterial({ color: 0xffffff }), "Note", () => showMessage("A hurried scrawl: 'The wilderness is unforgiving. Don't forget your jacket.'", 4000));
    note.mesh.rotation.x = -Math.PI / 2; note.mesh.position.set(-2, 1.01, -1); scene.add(note.mesh);

    const matCover = new THREE.MeshStandardMaterial({ color: 0x111144, emissive: 0x050522, roughness: 0.6 });
    const matPages = new THREE.MeshStandardMaterial({ color: 0xf5deb3, roughness: 0.9 });
    const bookMats = [matPages, matCover, matCover, matCover, matPages, matPages];
    const book = new Interactable(new THREE.BoxGeometry(0.6, 0.2, 0.8), bookMats, "Enchanted Book", (o) => takeItem(ITEMS.book, o, interactables));
    book.mesh.position.set(-3, 1.6, -4); scene.add(book.mesh);

    const glass = new Interactable(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 }), "Glass", (o) => takeItem(ITEMS.glass_empty, o, interactables));
    glass.mesh.position.set(-2.5, 1.7, -4.2); scene.add(glass.mesh);

    // DRESSER
    const dresserFrame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshStandardMaterial({ map: ASSETS.texWood }));
    dresserFrame.position.set(3, 0.75, -4); scene.add(dresserFrame);

    const makeDrawer = (y, itemsInside) => {
        const dGroup = new THREE.Group();
        const matInvisible = new THREE.MeshBasicMaterial({ visible: false });
        const matBrown = new THREE.MeshStandardMaterial({ color: 0x5d4037, side: THREE.DoubleSide });
        const matFace = new THREE.MeshStandardMaterial({ map: ASSETS.texDrawer, side: THREE.DoubleSide });
        const matWoodSide = new THREE.MeshStandardMaterial({ map: ASSETS.texWood, side: THREE.DoubleSide });
        const drawerMats = [matWoodSide, matWoodSide, matInvisible, matBrown, matFace, matWoodSide];

        const dMesh = new Interactable(new THREE.BoxGeometry(1.4, 0.4, 1.4), drawerMats, "Drawer", (drawerInteractable, hit) => {
            const dMesh = drawerInteractable.mesh;
            const dGroup = dMesh.parent;

            // Check Hit Face. Face 4 is the Front (with handle).
            const isFront = hit.face.materialIndex === 4;

            if (!dMesh.userData.isOpen) {
                dMesh.userData.isOpen = true; sfx.interact();
            } else {
                if (isFront) {
                    // Tapped front face while open -> Close drawer
                    dMesh.userData.isOpen = false; sfx.close();
                } else {
                    // Tapped inside/top -> Try to take items
                    const items = dGroup.children.filter(c => c !== dMesh && c.userData.parent && c.userData.parent.onInteract);
                    if (items.length > 0) {
                        items.sort((a, b) => b.position.y - a.position.y);
                        items[0].userData.parent.onInteract(items[0].userData.parent);
                    } else {
                        dMesh.userData.isOpen = false; sfx.close();
                    }
                }
            }
        });
        dMesh.mesh.userData.isOpen = false; dGroup.add(dMesh.mesh); dGroup.userData = { isDrawer: true };

        itemsInside.forEach(item => {
            const iMesh = new Interactable(item.geo, item.mat, item.def.name, (o) => {
                if (item.onInteract) {
                    item.onInteract(o);
                } else {
                    takeItem(item.def, o, interactables);
                }
            });
            iMesh.mesh.position.copy(item.pos); iMesh.mesh.rotation.set(item.rot.x, item.rot.y, item.rot.z);
            dGroup.add(iMesh.mesh);
        });
        dGroup.position.set(3, y, -3.9); scene.add(dGroup); drawers.push(dGroup);
    };

    makeDrawer(1.25, [
        { def: ITEMS.pants, geo: new THREE.PlaneGeometry(0.8, 0.8), mat: new THREE.MeshBasicMaterial({ map: ASSETS.texPants, transparent: true }), pos: new THREE.Vector3(0, -0.14, 0), rot: { x: -Math.PI / 2, y: 0, z: 0 } },
        { def: ITEMS.seed_drawer, geo: new THREE.PlaneGeometry(0.4, 0.4), mat: new THREE.MeshBasicMaterial({ map: ASSETS.packetSeed.tex, transparent: true }), pos: new THREE.Vector3(0, -0.15, 0), rot: { x: -Math.PI / 2, y: 0, z: 0 } }
    ]);
    makeDrawer(0.75, []);
    makeDrawer(0.25, [
        {
            def: ITEMS.socks_clean,
            geo: new THREE.PlaneGeometry(0.6, 0.6),
            mat: new THREE.MeshBasicMaterial({ map: ASSETS.cleanSock.tex, transparent: true }),
            pos: new THREE.Vector3(0.2, -0.10, 0),
            rot: { x: -Math.PI / 2, y: 0, z: 0 },
            onInteract: (o) => {
                if (hasItem('socks_dirty')) {
                    showMessage("You are already wearing socks.");
                } else {
                    takeItem(ITEMS.socks_clean, o, interactables);
                }
            }
        },
        {
            def: ITEMS.vial,
            geo: new THREE.CylinderGeometry(0.1, 0.1, 0.4),
            mat: new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xaa4400 }),
            pos: new THREE.Vector3(-0.3, -0.15, 0),
            rot: { x: 0, y: 0, z: Math.PI / 2 }
        }
    ]);

    const dirtySocks = new Interactable(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshBasicMaterial({ map: ASSETS.dirtySock.tex, transparent: true, side: THREE.DoubleSide }), "Dirty Socks", (o) => {
        if (hasItem('socks_clean')) { showMessage("You are already wearing fresh, clean socks."); return; }
        showModal("You pick up the dirty socks, they don’t seem too dirty but obviously not clean. Do you want to put them on? They might warm your feet a tiny bit.", () => { takeItem(ITEMS.socks_dirty, o, interactables); STATE.flags.socksFloorTaken = true; showMessage("You put on the dusty socks."); }, () => showMessage("You leave them."));
    });
    dirtySocks.mesh.rotation.x = -Math.PI / 2; dirtySocks.mesh.position.set(0, 0.02, -2.5); scene.add(dirtySocks.mesh);

    const cornerSeed = new Interactable(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: ASSETS.singleSeed.tex, transparent: true, side: THREE.DoubleSide }), "Stray Seed", (o) => takeItem(ITEMS.seed_corner, o, interactables));
    cornerSeed.mesh.rotation.x = -Math.PI / 2;
    cornerSeed.mesh.position.set(4.7, 0.02, -4.8);
    scene.add(cornerSeed.mesh);

    const pot = new Interactable(new THREE.CylinderGeometry(0.3, 0.2, 0.4), new THREE.MeshStandardMaterial({ color: 0x8b4513 }), "Pot", (o) => takeItem(ITEMS.pot, o, interactables));
    pot.mesh.position.set(-4, 0.2, 4); scene.add(pot.mesh);

    // SINK
    const sinkGroup = new THREE.Group();
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1.5), new THREE.MeshStandardMaterial({ map: ASSETS.texWood }));
    cabinet.position.y = 0.5; sinkGroup.add(cabinet);
    const basinMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const bBot = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 1.3), basinMat); bBot.position.y = 1.0; sinkGroup.add(bBot);
    const bL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 1.3), basinMat); bL.position.set(-0.85, 1.15, 0); sinkGroup.add(bL);
    const bR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 1.3), basinMat); bR.position.set(0.85, 1.15, 0); sinkGroup.add(bR);
    const bF = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.1), basinMat); bF.position.set(0, 1.15, 0.6); sinkGroup.add(bF);
    const bB = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.1), basinMat); bB.position.set(0, 1.15, -0.6); sinkGroup.add(bB);
    const drain = new THREE.Mesh(new THREE.CircleGeometry(0.1), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    drain.rotation.x = -Math.PI / 2; drain.position.set(0, 1.06, 0); sinkGroup.add(drain);
    const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    f1.position.set(0, 1.25, -0.6); sinkGroup.add(f1);
    const f2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    f2.position.set(0, 1.5, -0.4); sinkGroup.add(f2);
    const sinkTap = new Interactable(new THREE.BoxGeometry(1.5, 0.5, 1), new THREE.MeshBasicMaterial({ visible: false }), "Sink", () => {
        if (STATE.activeItem) {
            if (STATE.activeItem.id === 'glass_empty') { useItem('glass_empty'); giveItem(ITEMS.glass_water); showMessage("The glass fills with the pure, freezing liquid."); }
            else if (STATE.activeItem.id === 'glass_holy' || STATE.activeItem.id === 'glass_water') { showMessage("The water rushes over it, but nothing mystical occurs."); }
            else { showMessage("It’s not useful to rinse this item."); }
        } else showMessage("The faucet creaks, spitting out a stream of icy water.");
    });
    sinkTap.mesh.position.set(0, 1.5, 0); sinkGroup.add(sinkTap.mesh);
    sinkGroup.position.set(4, 0, 0); scene.add(sinkGroup);
}

export function chkCol(p) {
    if (!STATE.isBeach) { if (Math.abs(p.x) > 4.5 || Math.abs(p.z) > 4.5) return true; for (let o of obstacles) if (p.x + 0.2 > o.minX && p.x - 0.2 < o.maxX && p.z + 0.2 > o.minZ && p.z - 0.2 < o.maxZ) return true; }
    else if (p.z < -40 || p.z > 20 || Math.abs(p.x) > 50) return true;
    return false;
}
