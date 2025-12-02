import * as THREE from 'three';
import { ITEMS } from './state.js';

function makeTex(w, h, fn) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d'); fn(ctx, w, h);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

function createSockAssets(isClean) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.translate(64, 64); ctx.rotate(-Math.PI / 4); ctx.translate(-64, -64);
    ctx.fillStyle = isClean ? "#dddddd" : "#8a7f70";
    ctx.beginPath(); ctx.moveTo(40, 20); ctx.lineTo(80, 20); ctx.lineTo(80, 80);
    ctx.quadraticCurveTo(80, 100, 60, 100); ctx.lineTo(30, 100);
    ctx.quadraticCurveTo(10, 100, 10, 80); ctx.lineTo(10, 70); ctx.lineTo(40, 70);
    ctx.lineTo(40, 20); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#333"; ctx.stroke();
    if (isClean) {
        ctx.strokeStyle = "#ff0000"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(40, 30); ctx.lineTo(80, 30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(40, 40); ctx.lineTo(80, 40); ctx.stroke();
    } else {
        ctx.fillStyle = "#554433"; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(30, 90, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 50, 4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    return { tex: new THREE.CanvasTexture(c), imgUrl: c.toDataURL() };
}

function createSeedAssets(count) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    const drawSeed = (x, y) => {
        ctx.fillStyle = "#5d4037"; ctx.beginPath(); ctx.ellipse(x, y, 15, 25, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#8d6e63"; ctx.beginPath(); ctx.ellipse(x - 3, y - 3, 5, 10, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    };
    if (count === 1) drawSeed(64, 64); else { drawSeed(50, 64); drawSeed(80, 70); }
    return { tex: new THREE.CanvasTexture(c), imgUrl: c.toDataURL() };
}

function createHolyWaterAsset() {
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = "#4fc3f7";
    ctx.beginPath(); ctx.moveTo(64, 20); ctx.quadraticCurveTo(20, 80, 64, 110);
    ctx.quadraticCurveTo(108, 80, 64, 20); ctx.fill();
    ctx.fillStyle = "#ffd700";
    const drawStar = (x, y, r) => {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r + x, -Math.sin((18 + i * 72) / 180 * Math.PI) * r + y);
            ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (r / 2) + x, -Math.sin((54 + i * 72) / 180 * Math.PI) * (r / 2) + y);
        }
        ctx.closePath(); ctx.fill();
    };
    drawStar(64, 64, 15); drawStar(90, 40, 8); drawStar(38, 90, 8);
    return { tex: new THREE.CanvasTexture(c), imgUrl: c.toDataURL() };
}

const texEmoji = (e) => makeTex(128, 128, (ctx, w, h) => { ctx.font = "100px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(e, w / 2, h / 2); });

export const ASSETS = {
    dirtySock: createSockAssets(false),
    cleanSock: createSockAssets(true),
    singleSeed: createSeedAssets(1),
    packetSeed: createSeedAssets(2),
    holyWater: createHolyWaterAsset(),
    texLogs: makeTex(512, 512, (ctx, w, h) => {
        ctx.fillStyle = "#4a3c31"; ctx.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 64) {
            const g = ctx.createLinearGradient(0, y, 0, y + 64); g.addColorStop(0, "#2a1d15"); g.addColorStop(0.5, "#6d5446"); g.addColorStop(1, "#2a1d15");
            ctx.fillStyle = g; ctx.fillRect(0, y, w, 64); ctx.fillStyle = "#110b08"; ctx.fillRect(0, y + 62, w, 2);
        }
    }),
    texDrawer: makeTex(256, 128, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#3e2723"); g.addColorStop(0.5, "#5d4037"); g.addColorStop(1, "#3e2723");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) { const y = Math.random() * h; ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(w / 3, y + 10, w * 0.6, y - 10, w, y); ctx.stroke(); }
        ctx.strokeStyle = "#2a1d15"; ctx.lineWidth = 6; ctx.strokeRect(0, 0, w, h);
        ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 5; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
        ctx.fillStyle = "#8d6e63"; ctx.fillRect(w / 2 - 25, h / 2 - 5, 50, 10);
        ctx.fillStyle = "#d7ccc8"; ctx.fillRect(w / 2 - 25, h / 2 - 5, 50, 8);
        ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(w / 2 - 20, h / 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(w / 2 + 20, h / 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowColor = "transparent";
    }),
    texDoor: makeTex(256, 512, (ctx, w, h) => {
        ctx.fillStyle = "#2d1e15"; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#1a100a"; ctx.lineWidth = 4;
        for (let x = 0; x < w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        ctx.strokeStyle = "#4a3525"; ctx.lineWidth = 10; ctx.strokeRect(0, 0, w, h);
        ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(w - 40, h / 2, 10, 0, Math.PI * 2); ctx.fill();
    }),
    texBasket: makeTex(256, 256, (ctx, w, h) => {
        ctx.fillStyle = "#deb887"; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#a0522d"; ctx.lineWidth = 8; const s = 32;
        for (let y = 0; y < h; y += s) {
            for (let x = 0; x < w; x += s) {
                ctx.beginPath(); ctx.moveTo(x, y + s / 2); ctx.lineTo(x + s, y + s / 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x + s / 2, y); ctx.lineTo(x + s / 2, y + s); ctx.stroke();
            }
        }
        ctx.fillStyle = "rgba(0,0,0,0.1)"; for (let i = 0; i < 200; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 4, 4);
    }),
    texPants: texEmoji("👖"),
    texWood: makeTex(64, 64, (ctx, w, h) => { ctx.fillStyle = "#5d4037"; ctx.fillRect(0, 0, w, h); }),
    texFloor: makeTex(64, 64, (ctx, w, h) => { ctx.fillStyle = "#3e2723"; ctx.fillRect(0, 0, w, h); })
};

// Initialize ITEM images
ITEMS.socks_dirty.img = ASSETS.dirtySock.imgUrl;
ITEMS.socks_clean.img = ASSETS.cleanSock.imgUrl;
ITEMS.seed_corner.img = ASSETS.singleSeed.imgUrl;
ITEMS.seed_drawer.img = ASSETS.packetSeed.imgUrl;
ITEMS.glass_holy.img = ASSETS.holyWater.imgUrl;
