/* ==========================================================================
   METAFIN RETRO ARCADE ENGINE (Chiptune Music, SFX, Attacks & Mini-Game)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initRetroAudioAndBgm();
  initCrtToggle();
  initBossBattleActions();
  initCurrencyToggle();
  initBusinessTabs();
  initCharacterSelect();
  initMiniGame();
});

/* ==========================================================================
   1. POLYPHONIC RETRO CHIPTUNE ENGINE (Web Audio API Multi-Track)
   ========================================================================== */
/* ==========================================================================
   1. SUPER MARIO BROS 8-BIT CHIPTUNE THEME (Authentic & Soft Volume)
   ========================================================================== */
let audioCtx = null;
let bgmPlaying = false;
let bgmInterval = null;
let musicEnabled = true;

// Complete Super Mario Bros Overworld Chiptune Theme (Melody + Bass + Drum tick)
const MARIO_BROS_THEME = [
  // --- INTRO FANFARE ---
  { f: 659.25, b: 164.81, d: 0.10, p: "hat" },  // E5 + E3
  { f: 659.25, b: 164.81, d: 0.10, p: "hat" },  // E5 + E3
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 659.25, b: 164.81, d: 0.10, p: "snare" },// E5 + E3
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 523.25, b: 130.81, d: 0.10, p: "hat" },  // C5 + C3
  { f: 659.25, b: 164.81, d: 0.12, p: "kick" }, // E5 + E3
  { f: 0,      b: 0,      d: 0.10, p: null },   // rest
  { f: 783.99, b: 196.00, d: 0.18, p: "kick" }, // G5 + G3
  { f: 0,      b: 0,      d: 0.14, p: null },   // rest
  { f: 0,      b: 0,      d: 0.14, p: null },   // rest
  { f: 0,      b: 0,      d: 0.14, p: null },   // rest
  { f: 392.00, b: 98.00,  d: 0.18, p: "kick" }, // G4 + G2
  { f: 0,      b: 0,      d: 0.14, p: null },   // rest
  { f: 0,      b: 0,      d: 0.14, p: null },   // rest
  { f: 0,      b: 0,      d: 0.14, p: null },   // rest

  // --- MAIN THEME (PART A) ---
  { f: 523.25, b: 130.81, d: 0.12, p: "kick" }, // C5 + C3
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 392.00, b: 98.00,  d: 0.12, p: "snare" },// G4 + G2
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 329.63, b: 82.41,  d: 0.12, p: "kick" }, // E4 + E2
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 440.00, b: 110.00, d: 0.12, p: "hat" },  // A4 + A2
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 493.88, b: 123.47, d: 0.12, p: "snare" },// B4 + B2
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 466.16, b: 116.54, d: 0.10, p: "hat" },  // Bb4 + Bb2
  { f: 440.00, b: 110.00, d: 0.12, p: "kick" }, // A4 + A2
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest

  // --- MAIN THEME (PART B: Upward run) ---
  { f: 392.00, b: 98.00,  d: 0.10, p: "kick" }, // G4 + G2
  { f: 659.25, b: 164.81, d: 0.10, p: "hat" },  // E5 + E3
  { f: 783.99, b: 196.00, d: 0.10, p: "snare" },// G5 + G3
  { f: 880.00, b: 220.00, d: 0.12, p: "hat" },  // A5 + A3
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 698.46, b: 174.61, d: 0.10, p: "kick" }, // F5 + F3
  { f: 783.99, b: 196.00, d: 0.10, p: "hat" },  // G5 + G3
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 659.25, b: 164.81, d: 0.12, p: "snare" },// E5 + E3
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 523.25, b: 130.81, d: 0.10, p: "hat" },  // C5 + C3
  { f: 587.33, b: 146.83, d: 0.10, p: "kick" }, // D5 + D3
  { f: 493.88, b: 123.47, d: 0.14, p: "snare" },// B4 + B2
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest

  // --- SECTION 2: DOWNWARD CHROMATIC PHRASE ---
  { f: 783.99, b: 196.00, d: 0.10, p: "kick" }, // G5
  { f: 739.99, b: 185.00, d: 0.10, p: "hat" },  // F#5
  { f: 698.46, b: 174.61, d: 0.10, p: "snare" },// F5
  { f: 622.25, b: 155.56, d: 0.10, p: "hat" },  // D#5
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 659.25, b: 164.81, d: 0.12, p: "kick" }, // E5
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 415.30, b: 103.83, d: 0.10, p: "hat" },  // G#4
  { f: 440.00, b: 110.00, d: 0.10, p: "snare" },// A4
  { f: 523.25, b: 130.81, d: 0.12, p: "kick" }, // C5
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 440.00, b: 110.00, d: 0.10, p: "hat" },  // A4
  { f: 523.25, b: 130.81, d: 0.10, p: "snare" },// C5
  { f: 587.33, b: 146.83, d: 0.14, p: "kick" }, // D5
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest

  // --- SECTION 3: RESOLUTION & LOOP ---
  { f: 783.99, b: 196.00, d: 0.10, p: "kick" }, // G5
  { f: 739.99, b: 185.00, d: 0.10, p: "hat" },  // F#5
  { f: 698.46, b: 174.61, d: 0.10, p: "snare" },// F5
  { f: 622.25, b: 155.56, d: 0.10, p: "hat" },  // D#5
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 659.25, b: 164.81, d: 0.12, p: "kick" }, // E5
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 1046.5, b: 261.63, d: 0.12, p: "snare" },// C6
  { f: 0,      b: 0,      d: 0.08, p: null },   // rest
  { f: 1046.5, b: 261.63, d: 0.10, p: "kick" }, // C6
  { f: 1046.5, b: 261.63, d: 0.14, p: "snare" },// C6
  { f: 0,      b: 0,      d: 0.12, p: null },   // rest
  { f: 0,      b: 0,      d: 0.12, p: null }    // rest (Loops back)
];

const BGM_TEMPO = 135; // ms per step (Authentic Mario Tempo)

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 8-Bit Noise Drum synthesizer (Soft Kick, Snare, Hi-Hat)
function playRetroPercussion(ctx, type, time) {
  if (!type) return;
  
  if (type === "kick") {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(25, time + 0.08);
    gain.gain.setValueAtTime(0.015, time);
    gain.gain.exponentialRampToValueAtTime(0.0005, time + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
  } else if (type === "snare") {
    // Noise buffer snare
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1200;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.007, time);
    gain.gain.exponentialRampToValueAtTime(0.0005, time + 0.05);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(time);
  } else if (type === "hat") {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(3000, time);
    gain.gain.setValueAtTime(0.003, time);
    gain.gain.exponentialRampToValueAtTime(0.0002, time + 0.025);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.025);
  }
}

// Sound effects (Gentle volume, ALWAYS ACTIVE)
const SFX = {
  click: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  },
  coin: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  },
  powerup: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const notes = [330, 392, 523, 659, 784, 1046];
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
      });
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  },
  damage: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }
};

function playRetroMusic() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (!musicEnabled) {
    bgmPlaying = false;
    return;
  }
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  let step = 0;
  bgmPlaying = true;

  bgmInterval = setInterval(() => {
    if (!bgmPlaying || !musicEnabled) return;
    const now = ctx.currentTime;
    const note = MARIO_BROS_THEME[step % MARIO_BROS_THEME.length];

    if (!note) {
      step++;
      return;
    }

    // Lead Melody (Square wave with warm low-pass filter & smooth volume)
    if (note.f > 0) {
      const oscM = ctx.createOscillator();
      const filterM = ctx.createBiquadFilter();
      const gainM = ctx.createGain();
      
      oscM.type = "square";
      oscM.frequency.setValueAtTime(note.f, now);
      
      filterM.type = "lowpass";
      filterM.frequency.setValueAtTime(2000, now);

      gainM.gain.setValueAtTime(0.011, now);
      gainM.gain.exponentialRampToValueAtTime(0.0003, now + note.d);

      oscM.connect(filterM);
      filterM.connect(gainM);
      gainM.connect(ctx.destination);

      oscM.start(now);
      oscM.stop(now + note.d);
    }

    // Warm Arpeggiated Bass (Triangle wave, soft & deep)
    if (note.b > 0) {
      const oscB = ctx.createOscillator();
      const gainB = ctx.createGain();
      
      oscB.type = "triangle";
      oscB.frequency.setValueAtTime(note.b, now);

      gainB.gain.setValueAtTime(0.013, now);
      gainB.gain.exponentialRampToValueAtTime(0.0003, now + note.d);

      oscB.connect(gainB);
      gainB.connect(ctx.destination);

      oscB.start(now);
      oscB.stop(now + note.d);
    }

    // Subtle Chiptune Drum beat
    if (note.p) {
      playRetroPercussion(ctx, note.p, now);
    }

    step++;
  }, BGM_TEMPO);
}

function initRetroAudioAndBgm() {
  const musicToggleBtn = document.getElementById("btn-toggle-music");
  
  const ensureAudioIsPlaying = () => {
    if (!musicEnabled) return;
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume().then(() => {
        if (!bgmPlaying || !bgmInterval) playRetroMusic();
      });
    } else {
      if (!bgmPlaying || !bgmInterval) playRetroMusic();
    }
  };
  
  // Try on load
  try {
    ensureAudioIsPlaying();
  } catch (e) {}

  // Trigger on any gesture on window or document
  const triggerEvents = ["click", "pointerdown", "touchstart", "keydown", "scroll", "wheel", "mousemove"];
  triggerEvents.forEach(evt => {
    window.addEventListener(evt, ensureAudioIsPlaying, { once: true, passive: true });
    document.addEventListener(evt, ensureAudioIsPlaying, { once: true, passive: true });
  });

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      musicEnabled = !musicEnabled;
      if (!musicEnabled) {
        musicToggleBtn.innerHTML = "🔇 MÚSICA: OFF";
        musicToggleBtn.style.color = "#ff5577";
        musicToggleBtn.style.borderColor = "#ff5577";
        if (bgmInterval) {
          clearInterval(bgmInterval);
          bgmInterval = null;
        }
        bgmPlaying = false;
      } else {
        musicToggleBtn.innerHTML = "🎵 MÚSICA: ON";
        musicToggleBtn.style.color = "var(--neon-green)";
        musicToggleBtn.style.borderColor = "var(--neon-green)";
        const ctx = getAudioContext();
        ctx.resume().then(() => playRetroMusic());
        SFX.coin();
      }
    });
  }

  // Sound effects on buttons (ALWAYS PLAY)
  document.querySelectorAll("button, .btn-arcade-primary, .btn-arcade-secondary, .tab-btn").forEach(el => {
    el.addEventListener("click", () => SFX.click());
  });
}

/* ==========================================================================
   2. CRT SCANLINES TOGGLE
   ========================================================================== */
function initCrtToggle() {
  const crtBtn = document.getElementById("btn-toggle-crt");
  if (crtBtn) {
    crtBtn.addEventListener("click", () => {
      document.body.classList.toggle("crt-active");
      const isOn = document.body.classList.contains("crt-active");
      crtBtn.innerHTML = isOn ? "📺 CRT: ON" : "📺 CRT: OFF";
      crtBtn.style.color = isOn ? "var(--neon-cyan)" : "var(--text-dim)";
      crtBtn.style.borderColor = isOn ? "var(--neon-cyan)" : "#3a3466";
      SFX.click();
    });
  }
}

/* ==========================================================================
   3. BOSS BATTLE ACTIONS (Level 1: Registros de Gastos Cotidianos)
   ========================================================================== */
function initBossBattleActions() {
  const attackButtons = document.querySelectorAll(".btn-expense-attack");
  const bossHpFill = document.getElementById("boss-hp-fill");
  const bossHpText = document.getElementById("boss-hp-text");
  const battleLog = document.getElementById("boss-action-feedback");
  let hp = 100;

  attackButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const expenseType = btn.getAttribute("data-expense-name");
      const damageAmount = parseInt(btn.getAttribute("data-damage")) || 25;
      
      hp = Math.max(0, hp - damageAmount);
      bossHpFill.style.width = hp + "%";
      bossHpText.innerText = `HP: ${hp} / 100`;

      if (hp > 0) {
        SFX.damage();
        if (battleLog) {
          battleLog.innerHTML = `⚡ ¡Registraste <strong>${expenseType}</strong> en 2.4s! Causaste <strong>-${damageAmount} HP</strong> de daño al monstruo.`;
          battleLog.className = "boss-feedback active";
        }
      } else {
        SFX.powerup();
        bossHpFill.style.background = "#39ff14";
        bossHpText.innerText = "¡ENEMIGO DERROTADO CON METAFIN!";
        if (battleLog) {
          battleLog.innerHTML = `🏆 <strong>¡VICTORIA TOTAL!</strong> Has controlado todos tus gastos del mes. ¡El hábito financiero está blindado!`;
          battleLog.className = "boss-feedback victory";
        }
        attackButtons.forEach(b => {
          b.disabled = true;
          b.style.opacity = "0.6";
        });
      }
    });
  });
}

/* ==========================================================================
   4. CURRENCY TOGGLE (Bs / USD)
   ========================================================================== */
function initCurrencyToggle() {
  const toggleRadios = document.querySelectorAll("input[name='currency-switch']");
  const priceElements = document.querySelectorAll("[data-price-bs]");

  toggleRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const isUsd = e.target.value === "usd";
      SFX.coin();
      priceElements.forEach(el => {
        const bsPrice = el.getAttribute("data-price-bs");
        const usdPrice = el.getAttribute("data-price-usd");
        el.innerText = isUsd ? usdPrice : bsPrice;
      });
    });
  });
}

/* ==========================================================================
   5. BUSINESS MODEL TABS (B2C, B2B PyME, B2B Corp, B2B2C, B2G)
   ========================================================================== */
function initBusinessTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".model-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      
      tabBtns.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
      SFX.click();
    });
  });
}

/* ==========================================================================
   6. CHARACTER SELECT SCREEN
   ========================================================================== */
function initCharacterSelect() {
  const cards = document.querySelectorAll(".character-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      SFX.coin();
    });
  });
}

/* ==========================================================================
   7. MINI-GAME: METAFIN RPG EXPEDITION SIMULATOR
   ========================================================================== */
function initMiniGame() {
  const choiceA = document.getElementById("game-choice-a");
  const choiceB = document.getElementById("game-choice-b");
  const choiceC = document.getElementById("game-choice-c");
  const resultBox = document.getElementById("game-result-box");
  const hudScore = document.getElementById("hud-coins-val");
  const hudStreak = document.getElementById("hud-streak-val");

  let coins = 1250;
  let streak = 12;

  if (choiceA && choiceB && resultBox) {
    choiceA.addEventListener("click", () => {
      // Mala decisión
      SFX.damage();
      resultBox.className = "minigame-result show bad";
      resultBox.innerHTML = `
        👾 <strong>¡El Monstruo del Gasto Inesperado atacó a tu mascota!</strong><br>
        Gastaste 150 Bs en compras impulsivas. Tu barra de imprevistos quedó en 0 y perdiste 20 XP.
      `;
    });

    choiceB.addEventListener("click", () => {
      // Buena decisión: Estrategia Dual MetaFin
      SFX.powerup();
      coins += 200;
      streak += 1;
      if (hudScore) hudScore.innerText = `${coins} XP`;
      if (hudStreak) hudStreak.innerText = `🔥 ${streak} Días`;

      resultBox.className = "minigame-result show good";
      resultBox.innerHTML = `
        ✨ <strong>¡COMBO METAFIN DUAL ACTIVADO! (+200 XP & +1 Día de Racha)</strong><br>
        Alimentaste tu <em>Fondo de Emergencia</em> (+100 Bs) y avanzaste en tu <em>Quest de Viaje</em> (+100 Bs). ¡Tu avatar subió de nivel y ganaste una insignia de Gremio!
      `;
    });

    if (choiceC) {
      choiceC.addEventListener("click", () => {
        SFX.coin();
        coins += 80;
        if (hudScore) hudScore.innerText = `${coins} XP`;
        resultBox.className = "minigame-result show good";
        resultBox.innerHTML = `
          🛡️ <strong>¡Escudo Anti-Racha Usado con Éxito! (+80 XP)</strong><br>
          Pospusiste una compra no esencial 48 horas para evaluar necesidad real. ¡Evitaste un gasto hormiga!
        `;
      });
    }
  }
}
