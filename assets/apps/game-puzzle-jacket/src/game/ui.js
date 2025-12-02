import { sfx } from './audio.js';
import { STATE, ITEMS } from './state.js';
import { triggerAction } from './logic.js';

export const modalOverlay = document.getElementById('modal-overlay');

export function showMessage(t, d = 3000) {
    const el = document.getElementById('message-log'); const div = document.createElement('div');
    div.className = 'msg'; div.innerText = t; el.innerHTML = ''; el.appendChild(div); setTimeout(() => div.classList.add('fade'), d);
}

export function showModal(t, y, n) {
    const mt = document.getElementById('modal-text'), by = document.getElementById('btn-modal-yes'), bn = document.getElementById('btn-modal-no');
    mt.innerText = t; modalOverlay.style.display = 'flex';
    const ny = by.cloneNode(true), nn = bn.cloneNode(true); by.parentNode.replaceChild(ny, by); bn.parentNode.replaceChild(nn, bn);
    ny.onclick = () => { modalOverlay.style.display = 'none'; sfx.interact(); if (y) y(); }; nn.onclick = () => { modalOverlay.style.display = 'none'; sfx.blip(); if (n) n(); };
}

export function updateInv() {
    const p = document.getElementById('inv-perm'), w = document.getElementById('inv-work'); p.innerHTML = '<span class="inv-title">Worn</span>'; w.innerHTML = '<span class="inv-title">Hand</span>';
    STATE.inventory.permanent.forEach(i => p.appendChild(createSlot(i, false))); STATE.inventory.working.forEach(i => w.appendChild(createSlot(i, true)));
}

function createSlot(i, w) {
    const d = document.createElement('div'); d.className = 'item-slot'; if (STATE.activeItem === i) d.classList.add('active');
    if (i.img) { d.innerHTML = `<img src="${i.img}" alt="${i.name}">`; } else { d.innerText = i.icon; }
    d.onclick = (e) => { e.stopPropagation(); sfx.blip(); if (w) { if (STATE.activeItem === i) { STATE.activeItem = null; triggerAction(i); } else { STATE.activeItem = i; showMessage("Selected: " + i.name); } } else showMessage("Worn: " + i.name); updateInv(); };
    d.ontouchstart = d.onclick; return d;
}
