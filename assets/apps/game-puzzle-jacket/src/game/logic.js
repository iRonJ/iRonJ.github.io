import { STATE, ITEMS } from './state.js';
import { sfx } from './audio.js';
import { showMessage, updateInv } from './ui.js';

export function hasItem(id) { return STATE.inventory.permanent.find(i => i.id === id) || STATE.inventory.working.find(i => i.id === id); }

export function takeItem(d, o, interactables) {
    if (o) {
        const parent = o.mesh.parent;
        o.mesh.removeFromParent();
        // Remove from interactables list if passed
        if (interactables) {
            const i = interactables.indexOf(o.mesh); if (i > -1) interactables.splice(i, 1);
        }

        if (parent && parent.userData.isDrawer) {
            const remainingItems = parent.children.filter(c => c.userData.parent && c.userData.parent.onInteract);
            if (remainingItems.length <= 1) {
                const drawerMesh = parent.children.find(c => c.userData.isOpen !== undefined);
                if (drawerMesh) { setTimeout(() => { drawerMesh.userData.isOpen = false; sfx.close(); }, 200); }
            }
        }
    }
    giveItem(d);
}

export function giveItem(d, silent = false) {
    sfx.blip();
    (d.type === 'perm' ? STATE.inventory.permanent : STATE.inventory.working).push(d);
    updateInv();
    if (!silent) showMessage(`Got: ${d.name}`);
}

export function useItem(id) { sfx.interact(); const i = STATE.inventory.working.findIndex(x => x.id === id); if (i > -1) { STATE.inventory.working.splice(i, 1); STATE.activeItem = null; updateInv(); } }

export function triggerAction(i) {
    if (i.id === 'book') {
        if (hasItem('glass_water')) {
            const idx = STATE.inventory.working.findIndex(x => x.id === 'glass_water');
            STATE.inventory.working[idx] = ITEMS.glass_holy; sfx.success(); showMessage("The ancient words resonate with the water, infusing it with a shimmering, holy light.", 4000); updateInv();
        } else {
            showMessage("You flip through the enchanted book with written characters you sort of recognize. You see pictures of waterfalls and rivers and thunderstorms. You recite out loud all the syllables you recognize. You're intrigued but otherwise nothing notable happens. You shiver in the cold.", 8000);
        }
    } else if (i.id === 'glass_water') {
        sfx.interact();
        useItem(i.id);
        giveItem(ITEMS.glass_empty, true);
        showMessage("You feel hydrated but that’s about it. Got: Empty Glass.");
    } else if (i.id === 'glass_holy' || i.id === 'vial') { sfx.interact(); showMessage("You drink the glowing water. A warmth spreads through your chest, chasing away the chill.", 4000); useItem(i.id); if (i.id === 'glass_holy') giveItem(ITEMS.glass_empty); }
}
