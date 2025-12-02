export const STATE = {
    startTime: 0,
    inventory: { permanent: [], working: [] },
    activeItem: null, isBeach: false, wakingUp: false, ready: false,
    flags: {
        pantsTaken: false, socksCleanTaken: false, socksFloorTaken: false,
        seedsAdded: false, waterAdded: false, plainWaterAdded: false,
        plantPlaced: false, portalOpen: false, gameEnded: false
    }
};

// Items will be populated with image URLs after asset generation
export const ITEMS = {
    socks_dirty: { id: 'socks_dirty', icon: "🧦", img: null, type: 'perm', name: "Dirty Socks" },
    socks_clean: { id: 'socks_clean', icon: "✨🧦", img: null, type: 'perm', name: "Clean Socks" },
    pants: { id: 'pants', icon: "👖", type: 'perm', name: "Pants" },
    seed_corner: { id: 'seed_corner', icon: "🌰", img: null, type: 'work', name: "Stray Seed" },
    seed_drawer: { id: 'seed_drawer', icon: "🌰", img: null, type: 'work', name: "Seed Packet" },
    book: { id: 'book', icon: "📖", type: 'work', name: "Enchanted Book" },
    glass_empty: { id: 'glass_empty', icon: "🥃", type: 'work', name: "Empty Glass" },
    glass_water: { id: 'glass_water', icon: "💧", type: 'work', name: "Water Glass" },
    glass_holy: { id: 'glass_holy', icon: "✨💧", img: null, type: 'work', name: "Holy Water" },
    pot: { id: 'pot', icon: "🪴", type: 'work', name: "Pot" },
    vial: { id: 'vial', icon: "🧪", type: 'work', name: "Holy Vial" },
    jacket: { id: 'jacket', icon: "🧥", type: 'perm', name: "Jacket" }
};
