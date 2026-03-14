import React, { useState, useEffect, useRef } from 'react';
import { Rocket, ShieldCheck, AlertTriangle, Eye, ArrowRight, Compass, Database } from 'lucide-react';

// --- EXPANDED DATASET (20 Scenarios) ---
const SCENARIO_DATA = [
  // Original 10 Scenarios
  { 
    id: 's1', claim: "A local initiative plans to seed clouds to increase rainfall.", 
    optA: "Cloud seeding introduces silver iodide, a known heavy metal toxin, intentionally meant to suppress population health under the guise of agriculture.", 
    optB: "I should check the EPA's environmental impact report on the specific silver iodide concentrations used in standard meteorological seeding.", 
    crit: 'B', exp: "Silver iodide is used, but assuming malicious population control without evidence is a leap. Critical thinking checks the actual dosage and safety reports." 
  },
  { 
    id: 's2', claim: "A new study claims blue light glasses don't actually reduce eye strain.", 
    optA: "The optometry lobby clearly funded this study. They rely on our macular degeneration to prescribe stronger, more expensive lenses over time.", 
    optB: "I'll look at the study's methodology to see if they measured subjective strain or objective physiological changes in the eye.", 
    crit: 'B', exp: "Assuming a massive industry conspiracy to degrade vision ignores the simpler explanation: the product might just be a placebo. Check the methodology." 
  },
  { 
    id: 's3', claim: "A supermarket introduces dynamic digital pricing tags.", 
    optA: "I wonder if the algorithm responds strictly to inventory levels, or if it tracks individual shopper habits to adjust prices.", 
    optB: "Algorithmic pricing is mathematically designed to trigger scarcity responses in the amygdala, forcing us to buy out of artificial panic.", 
    crit: 'A', exp: "Throwing around terms like 'amygdala scarcity response' sounds smart, but it's an unproven assumption of malice. Asking how the algorithm actually works is critical." 
  },
  { 
    id: 's4', claim: "A popular podcast host claims cold plunges cure clinical depression based on dopamine spikes.", 
    optA: "A temporary dopamine spike isn't the same as treating clinical depression. What do randomized controlled trials say about long-term efficacy?", 
    optB: "The clinical psychology establishment ignores this because you can't patent ice water. They need the population dependent on SSRIs for profit.", 
    crit: 'A', exp: "The cynical view uses a real economic concept (patents) to jump to a massive conspiracy about suppressing cures. The critical view questions the physiological leap." 
  },
  { 
    id: 's5', claim: "The company is installing AI productivity tracking software.", 
    optA: "Studies show tracking increases cortisol; it's a scientifically optimized method to force employee attrition without paying severance.", 
    optB: "I'll research the specific metrics the software aggregates and whether it anonymizes data or tracks individual keystrokes.", 
    crit: 'B', exp: "While tracking can cause stress, assuming it's a calculated plot to force attrition is a cynical projection. Investigating the actual data policy is critical." 
  },
  { 
    id: 's6', claim: "NASA announces a delay in the next lunar mission due to radiation concerns.", 
    optA: "The Van Allen radiation belts are impenetrable. They're delaying it because they lost the legacy technology used to fake the original footage.", 
    optB: "What specific solar flare activity or spacecraft shielding limitations caused the delay according to the mission engineering brief?", 
    crit: 'B', exp: "The cynical option misuses a real scientific phenomenon (Van Allen belts) to support a discredited conspiracy. The critical option asks for the engineering data." 
  },
  { 
    id: 's7', claim: "An AI company releases a model that can predict human purchasing behavior with 90% accuracy.", 
    optA: "Is that 90% accuracy on their isolated training data, or does it hold up in real-world, novel situations? I need to see the validation metrics.", 
    optB: "By mapping our neural engrams, they've already eliminated free will. It's a deterministic psychological cage disguised as convenience.", 
    crit: 'A', exp: "Using terms like 'neural engrams' and 'deterministic cage' creates a false sense of intellectual authority. Checking the statistical validation is the true scientific approach." 
  },
  { 
    id: 's8', claim: "Your car's check engine light comes on exactly two days after getting an oil change.", 
    optA: "Mechanics utilize planned obsolescence. Statistically, they likely loosened an O2 sensor to guarantee a return visit and diagnostic fee.", 
    optB: "It could be a coincidence, or a sensor was accidentally bumped during the service. I'll get the diagnostic OBD2 code read before drawing conclusions.", 
    crit: 'B', exp: "Applying 'planned obsolescence' and 'statistics' to a singular event is a logical fallacy. Gathering the diagnostic data first is critical thinking." 
  },
  {
    id: 's9', claim: "A famous scientist publicly changes their stance on a major dietary theory.",
    optA: "I wonder what new longitudinal data, peer-reviewed experiments, or metabolic pathways led to this fundamental change in perspective.",
    optB: "Industry funding dictates scientific consensus. They were clearly offered a lucrative grant by agricultural conglomerates to alter their narrative.",
    crit: 'A', exp: "Cynicism often disguises itself as 'following the money' without actual proof of a transaction. Science updates based on new data."
  },
  {
    id: 's10', claim: "A new wellness app uses binaural beats to increase focus.",
    optA: "Neurological entrainment via binaural beats is a documented method used by tech companies to bypass the prefrontal cortex and implant subliminal marketing.",
    optB: "Does the app's literature cite double-blind EEG studies showing actual wave entrainment, or just rely on subjective user surveys?",
    crit: 'B', exp: "The cynical choice uses heavy neuro-jargon ('prefrontal cortex', 'entrainment') to make a wild, unsubstantiated leap about subliminal marketing."
  },
  // 10 New Scenarios
  {
    id: 's11', claim: "A social media platform updates its algorithm to 'prioritize local community news'.",
    optA: "They are geographically isolating populations to prevent mass organization, using localized echo chambers to test psychological warfare tactics.",
    optB: "I should observe if my feed actually shows more local civic events, or if it's just prioritizing hyper-local outrage bait to drive engagement.",
    crit: 'B', exp: "Tech companies definitely manipulate engagement, but jumping straight to 'psychological warfare and preventing mass organization' is a paranoid leap that ignores simpler profit motives."
  },
  {
    id: 's12', claim: "A fitness influencer launches a custom 'nootropic' brain supplement.",
    optA: "I need to check the active ingredients against independent, peer-reviewed clinical trials, not just rely on the influencer's sponsored testimonials.",
    optB: "Big Pharma actively suppressed these exact neuro-peptides to keep the population docile; this influencer is risking their platform exposing the formula.",
    crit: 'A', exp: "The cynical view invents a massive, villainous suppression narrative to validate a commercial product. The critical view simply asks for the clinical data."
  },
  {
    id: 's13', claim: "Schools are introducing gamified math apps for elementary students.",
    optA: "It's an operant conditioning matrix designed to destroy intrinsic motivation so the next generation only responds to external, corporate-controlled dopamine loops.",
    optB: "Does the data show these apps actually improve long-term math retention, or do they just train kids to click fast for temporary rewards?",
    crit: 'B', exp: "While gamification *is* based on operant conditioning, claiming it's a deliberate plot to 'destroy intrinsic motivation' is fatalistic pseudo-intellectualism."
  },
  {
    id: 's14', claim: "A major fossil fuel company donates millions to a clean ocean initiative.",
    optA: "They are likely funding ecoterrorists to subtly sabotage competing green energy infrastructure under the guise of 'ocean cleanup' to maintain their monopoly.",
    optB: "I should look at their annual tax filings to see if this donation is a genuine pivot, or just a tiny fraction of their budget used for PR 'greenwashing'.",
    crit: 'B', exp: "Greenwashing is a real corporate tactic. Funding ecoterrorists to sabotage competitors is a Hollywood conspiracy theory."
  },
  {
    id: 's15', claim: "HR announces a new 'flexible unlimited PTO (Paid Time Off)' policy.",
    optA: "This is a neuro-linguistic programming trick; by removing boundaries, they mathematically ensure we take less time off while wiping accrued vacation debt off their balance sheet.",
    optB: "I need to talk to veteran employees to see the actual culture around taking time off, and check if workloads are adjusted to make PTO functionally possible.",
    crit: 'B', exp: "It's true unlimited PTO often results in less time taken. However, calling it a 'neuro-linguistic programming trick' assigns comic-book malice to standard corporate financial restructuring."
  },
  {
    id: 's16', claim: "A new smart fridge claims to automatically order groceries when you run low.",
    optA: "What are the terms of service regarding the purchasing data? Will it lock me into specific vendor monopolies, or can I choose local grocers?",
    optB: "It contains biometric sensors analyzing our nutritional deficiencies to sell our biological profiles to health insurance conglomerates for rate hikes.",
    crit: 'A', exp: "Questioning data privacy and monopolies is critical. Assuming a fridge is running covert biometric blood-sugar analysis is cynical paranoia."
  },
  {
    id: 's17', claim: "The city replaces standard streetlights with high-efficiency blue-white LEDs.",
    optA: "The specific wavelength of these LEDs is calibrated to disrupt our circadian rhythms, keeping the populace chronically fatigued and incapable of civic resistance.",
    optB: "While energy efficient, I wonder if the city consulted environmental studies on how this specific light spectrum affects local nocturnal wildlife and human sleep patterns.",
    crit: 'B', exp: "Blue light does affect sleep (a scientific fact), but claiming the city is using it as a weapon to suppress civic resistance is a massive, unproven logical leap."
  },
  {
    id: 's18', claim: "A streaming service starts releasing episodes weekly instead of all at once.",
    optA: "This is likely a retention strategy to prevent users from subscribing for one month, bingeing, and canceling. I'll evaluate if the content justifies the prolonged subscription.",
    optB: "They are artificially suppressing dopamine release to create chemical dependency cycles, turning viewers into literal addicts incapable of delayed gratification.",
    crit: 'A', exp: "The cynical option misuses psychological terms ('chemical dependency cycles') to describe a basic business retention model."
  },
  {
    id: 's19', claim: "A new banking app uses AI to 'auto-invest your spare change'.",
    optA: "The app is a data-harvesting Trojan horse designed to map our financial anxiety triggers, allowing algorithmic hedge funds to front-run our economic collapse.",
    optB: "I need to read the fine print to see what their management fees are compared to the actual micro-returns, and if they are selling my transaction history.",
    crit: 'B', exp: "Payment For Order Flow (selling data) is real and worth critiquing. But claiming the app maps 'financial anxiety' to 'front-run economic collapse' is pseudo-intellectual fearmongering."
  },
  {
    id: 's20', claim: "A viral video claims a specific breathing technique can alkalize your blood and prevent disease.",
    optA: "The human body strictly regulates blood pH. I should consult actual physiological data to see if breathing can significantly alter it, or if it just creates temporary lightheadedness.",
    optB: "The medical-industrial complex actively censors this ancient knowledge because healthy people don't generate quarterly profits for the hospital systems.",
    crit: 'A', exp: "The cynical choice relies on the 'suppressed cure' trope to validate a biological impossibility, rather than asking how human physiology actually works."
  }
];

const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'mindlens_v6_expanded';

export default function App() {
  const [gameState, setGameState] = useState('START'); 
  const [score, setScore] = useState({ critical: 0, cynical: 0 });
  const [seenHistory, setSeenHistory] = useState({});
  const [currentScenario, setCurrentScenario] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [randomOrder, setRandomOrder] = useState([0, 1]);
  const [showResetNotice, setShowResetNotice] = useState(false);

  const canvasRef = useRef(null);
  const gameStateRef = useRef('START');
  const engine = useRef({ stars: [], celestials: [], particles: [], frame: 0 });

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // --- LOCAL STORAGE ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        const validHistory = {};
        
        Object.keys(parsed.history || {}).forEach(key => {
          if (now - parsed.history[key] < FIVE_DAYS) {
            validHistory[key] = parsed.history[key];
          }
        });
        
        setSeenHistory(validHistory);
        if (parsed.scores) setScore(parsed.scores);
      }
    } catch (e) {
      console.error("Storage format error. Resetting.");
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveProgress = (id, isCrit) => {
    const newHistory = { ...seenHistory, [id]: Date.now() };
    const newScore = {
      critical: score.critical + (isCrit ? 1 : 0),
      cynical: score.cynical + (isCrit ? 0 : 1)
    };
    
    setSeenHistory(newHistory);
    setScore(newScore);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      history: newHistory, 
      scores: newScore 
    }));
    
    return newScore;
  };

  const flushMemory = () => {
    setSeenHistory({});
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history: {}, scores: score }));
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 3000);
  };

  // --- MOBILE-OPTIMIZED ANIMATION ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      if (canvas.width === window.innerWidth && Math.abs(canvas.height - window.innerHeight) < 150) {
        canvas.height = window.innerHeight; 
        return;
      }
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const starCount = window.innerWidth < 768 ? 80 : 150;
      
      engine.current.stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 2 + 0.5,
        s: Math.random() * 0.5 + 0.1
      }));
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      engine.current.frame++;
      const currentGS = gameStateRef.current;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      engine.current.stars.forEach(s => {
        ctx.globalAlpha = 0.15 + Math.abs(Math.sin(engine.current.frame * 0.02 + s.x)) * 0.3;
        ctx.fillRect(s.x, s.y, s.z, s.z);
        s.y += currentGS === 'FLYING' ? s.z * 5 : s.z * 0.5;
        if (s.y > canvas.height) s.y = 0;
      });

      if (currentGS === 'FLYING' && Math.random() < 0.012) {
        engine.current.celestials.push({
          x: Math.random() * canvas.width,
          y: -100,
          type: Math.random() > 0.6 ? 'planet' : 'asteroid',
          size: 15 + Math.random() * 55,
          speed: 1.5 + Math.random() * 3,
          color: `hsl(${Math.random() * 360}, 35%, 35%)`,
          rot: 0,
          vRot: (Math.random() - 0.5) * 0.04
        });
      }

      engine.current.celestials = engine.current.celestials.filter(c => {
        c.y += (currentGS === 'FLYING' ? c.speed * 2.5 : c.speed * 0.2);
        c.rot += c.vRot;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.type === 'planet' ? c.color : '#334155';
        ctx.beginPath();
        if (c.type === 'planet') {
          ctx.arc(0, 0, c.size, 0, Math.PI * 2);
        } else {
          for (let i = 0; i < 7; i++) {
            const r = c.size * (0.8 + Math.abs(Math.sin(i * 2 + c.x)) * 0.3);
            ctx.lineTo(Math.cos(i * 0.9) * r, Math.sin(i * 0.9) * r);
          }
        }
        ctx.fill();
        ctx.restore();
        return c.y < canvas.height + 200;
      });

      if (currentGS === 'FLYING' || currentGS === 'START') {
        engine.current.particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 16,
          y: canvas.height / 2 + 50,
          vx: (Math.random() - 0.5) * 2,
          vy: 4 + Math.random() * 5,
          life: 1,
          c: Math.random() > 0.5 ? '#3b82f6' : '#818cf8'
        });
      }

      engine.current.particles = engine.current.particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.035;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.life * 12, 0, Math.PI * 2); ctx.fill();
        return p.life > 0;
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // --- AUDIO PRIMING ---
  const playTone = (freq, type = 'sine', dur = 0.5) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  };

  // --- GAME LOGIC ---
  const handleIntercept = () => {
    let pool = SCENARIO_DATA.filter(s => !seenHistory[s.id]);
    
    if (pool.length === 0) {
      flushMemory();
      pool = SCENARIO_DATA;
    }

    const target = pool[Math.floor(Math.random() * pool.length)];
    setCurrentScenario(target);
    setRandomOrder([0, 1].sort(() => Math.random() - 0.5));
    setGameState('SCANNING');
    playTone(440, 'sine', 0.2);
  };

  const submitChoice = (key) => {
    const isCrit = currentScenario.crit === key;
    saveProgress(currentScenario.id, isCrit);
    
    setFeedback({
      t: isCrit ? "SIGNAL VERIFIED: Methodological analysis confirmed." : "ILLUSION DETECTED: This choice utilized scientific jargon to mask a logical fallacy.",
      exp: currentScenario.exp,
      s: isCrit
    });
    
    playTone(isCrit ? 880 : 110, isCrit ? 'sine' : 'triangle', 0.6);
    setGameState('RESULT');
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100dvh] bg-[#020617] text-white font-sans overflow-hidden select-none touch-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top HUD */}
      <div className="relative z-50 p-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/40">
            <Rocket size={18} />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tighter uppercase leading-none">
              MindLens <span className="text-blue-400 font-bold">PRO</span>
            </h1>
            <div className="text-[9px] text-blue-400/50 font-mono tracking-widest uppercase mt-0.5">
              Nodes Processed: {Object.keys(seenHistory).length}/{SCENARIO_DATA.length}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-center min-w-[50px]">
            <div className="text-[8px] uppercase font-bold text-emerald-400">Critical</div>
            <div className="text-sm font-mono text-emerald-100">{score.critical}</div>
          </div>
          <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded text-center min-w-[50px]">
            <div className="text-[8px] uppercase font-bold text-rose-400">Cynical</div>
            <div className="text-sm font-mono text-rose-100">{score.cynical}</div>
          </div>
        </div>
      </div>

      {showResetNotice && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-900/80 border border-blue-400/50 text-blue-200 px-4 py-2 rounded-full text-xs font-mono flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300">
          <Database size={14} /> Memory Banks Flushed
        </div>
      )}

      {/* Main Overlays */}
      <div className="relative z-10 w-full h-full">
        
        {gameState === 'START' && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/50">
            <div className="max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500 pb-12">
              <Compass size={80} className="text-blue-500 mx-auto animate-pulse" />
              <div className="space-y-4">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">The Illusion of Logic</h2>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                  Cynicism often disguises itself as intelligence by using scientific jargon and logical fallacies.<br/><br/>
                  Navigate the void by separating <span className="text-emerald-400 font-bold">Methodological Inquiry</span> from <span className="text-rose-400 font-bold">Pseudo-Intellectual Suspicion</span>.
                </p>
              </div>
              <button 
                onClick={() => setGameState('FLYING')} 
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-full font-black text-xl shadow-xl shadow-blue-900/40 transition-all active:scale-95 touch-manipulation"
              >
                ENGAGE THRUSTERS
              </button>
            </div>
          </div>
        )}

        {gameState === 'FLYING' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={handleIntercept} 
              className="group relative flex flex-col items-center transition-transform hover:scale-110 active:scale-95 touch-manipulation"
            >
              <div className="absolute -inset-16 bg-blue-500/10 blur-[70px] rounded-full animate-pulse" />
              <Rocket size={110} className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
              <div className="mt-16 text-center">
                <div className="text-blue-400 font-black text-2xl tracking-[0.3em] animate-bounce uppercase">Intercept</div>
                <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2">Tap Ship to process cognitive signal</div>
              </div>
            </button>
          </div>
        )}

        {gameState === 'SCANNING' && currentScenario && (
          <div className="absolute inset-0 flex flex-col items-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto overscroll-contain">
            <div className="max-w-2xl w-full flex flex-col items-center gap-8 text-center animate-in zoom-in py-8 pb-32">
              
              <div className="space-y-4 w-full">
                <div className="text-blue-400 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                  <Eye size={18} /> Bilateral Processing Active
                </div>
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <p className="text-xl sm:text-2xl font-semibold italic text-slate-100 leading-snug">"{currentScenario.claim}"</p>
                </div>
              </div>
              
              <EMDRTrack />

              <div className="grid grid-cols-1 gap-4 sm:gap-5 w-full animate-in slide-in-from-bottom-8 duration-700">
                {randomOrder.map(idx => {
                  const key = idx === 0 ? 'A' : 'B';
                  const text = idx === 0 ? currentScenario.optA : currentScenario.optB;
                  return (
                    <button 
                      key={key} 
                      onClick={() => submitChoice(key)} 
                      className="p-5 sm:p-6 bg-slate-900/80 border-2 border-slate-800 hover:border-blue-500/50 rounded-2xl text-left flex items-start gap-4 transition-all group active:scale-[0.98] touch-manipulation"
                    >
                      <div className="shrink-0 mt-0.5 sm:mt-1 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <p className="text-slate-300 font-medium text-sm sm:text-base leading-relaxed flex-1">{text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="absolute inset-0 flex flex-col items-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto overscroll-contain">
            <div className="max-w-xl w-full bg-slate-900/95 rounded-[3rem] p-6 sm:p-10 border border-slate-700 shadow-2xl text-center my-8 pb-12">
              <div className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center ${feedback.s ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                {feedback.s ? <ShieldCheck size={40} /> : <AlertTriangle size={40} />}
              </div>
              
              <h3 className={`text-xl sm:text-2xl font-black mb-2 uppercase tracking-tighter ${feedback.s ? 'text-emerald-400' : 'text-rose-400'}`}>
                {feedback.t.split(':')[0]}
              </h3>
              <p className="text-slate-400 font-medium text-sm mb-8">{feedback.t.split(':')[1]}</p>
              
              <div className="bg-black/50 rounded-2xl p-5 sm:p-6 text-left mb-8 border border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-mono">Cognitive Breakdown</div>
                <p className="text-slate-300 text-sm leading-relaxed">{feedback.exp}</p>
              </div>

              <button 
                onClick={() => setGameState('FLYING')} 
                className="w-full py-5 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors uppercase tracking-widest text-sm touch-manipulation"
              >
                Resume Navigation <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full pb-4 pt-2 bg-black/60 text-[8px] text-center text-slate-600 font-mono uppercase tracking-[0.4em] z-50 pointer-events-none">
        Bilateral Synchronization Mode // 5-Day reinforcement Loop
      </div>
    </div>
  );
}

function EMDRTrack() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProg(p => (p + 2.5) % 100), 40);
    return () => clearInterval(t);
  }, []);
  
  const x = 50 + 40 * Math.sin(prog * 0.15);
  return (
    <div className="relative h-16 w-full bg-black rounded-[2rem] border border-slate-800 overflow-hidden shadow-inner flex items-center">
      <div 
        className="absolute w-10 h-10 bg-blue-500 rounded-full shadow-[0_0_35px_rgba(59,130,246,0.9)] border-4 border-white/10 transition-all duration-40" 
        style={{ left: `calc(${x}% - 20px)` }} 
      />
      <div className="absolute inset-y-0 left-10 w-[1px] bg-slate-800" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-slate-800" />
    </div>
  );
}


