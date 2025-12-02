let audioCtx = null;

export const sfx = {
    init: () => {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        } catch (e) { console.log('Audio error', e); }
    },
    play: (f, t, d, v) => {
        if (!audioCtx) return;
        const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
        o.type = t; o.frequency.setValueAtTime(f, audioCtx.currentTime);
        g.gain.setValueAtTime(v, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + d);
        o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + d);
    },
    blip: () => sfx.play(800, 'sine', 0.1, 0.05),
    interact: () => sfx.play(400, 'triangle', 0.1, 0.1),
    close: () => sfx.play(200, 'sawtooth', 0.2, 0.05),
    success: () => { if (audioCtx) { sfx.play(600, 'sine', 0.1, 0.1); setTimeout(() => sfx.play(800, 'sine', 0.1, 0.1), 100); setTimeout(() => sfx.play(1200, 'sine', 0.2, 0.4), 200); } },
    grow: () => {
        if (!audioCtx) return;
        const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
        o.frequency.setValueAtTime(100, audioCtx.currentTime); o.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 2);
        g.gain.setValueAtTime(0.2, audioCtx.currentTime); g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
        o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + 2);
    }
};
