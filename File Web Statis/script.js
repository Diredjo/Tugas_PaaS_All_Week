/**
 * SUPER SLOTS SULTAN 777 & PUKUL PRABOWO CLICKER
 * 100vh Responsive Interactive Web Game
 * Zero external assets required (Web Audio API synthesis for all sounds).
 */

// ==========================================
// 1. GAME STATE
// ==========================================
const state = {
    coins: 1000,
    tokens: 1, // Start with 1 free spin token
    clicksCount: 0,
    clicksRequired: 5,
    isSpinning: false,
    soundEnabled: true,
    lastResults: ['💎', '7️⃣', '💎']
};

const SYMBOLS = [
    { icon: '7️⃣', name: 'LUCKY SEVEN', payout: 10000, weight: 1 },
    { icon: '💎', name: 'BERLIAN SULTAN', payout: 5000, weight: 2 },
    { icon: '💰', name: 'KARUNG UANG', payout: 2500, weight: 3 },
    { icon: '🍉', name: 'SEMANGKA MANIS', payout: 1000, weight: 4 },
    { icon: '🍋', name: 'LEMON SEGAR', payout: 500, weight: 5 },
    { icon: '🍒', name: 'CERI MERAH', payout: 300, weight: 6 },
    { icon: '🍇', name: 'ANGGUR UNGU', payout: 200, weight: 6 }
];

// Weighted random pool for fair & exciting spin outcomes
const symbolPool = [];
SYMBOLS.forEach(s => {
    for (let i = 0; i < s.weight; i++) {
        symbolPool.push(s.icon);
    }
});

// ==========================================
// 2. SYNTHESIZED SOUND EFFECTS (Web Audio API)
// ==========================================
class SlotAudio {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Heavy punch impact ("BOKK / POW!")
    playPunch() {
        if (!state.soundEnabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Thump sub bass
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

        // Crack / slap
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1800;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
    }

    // Token earned chime ("DING DING! +1 TIKET")
    playTokenEarned() {
        if (!state.soundEnabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const t = now + i * 0.07;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.2);
        });
    }

    // Reel spinning ticks
    playTick() {
        if (!state.soundEnabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 950;
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
    }

    // Reel stop "THUD"
    playReelStop() {
        if (!state.soundEnabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Win chime
    playWin() {
        if (!state.soundEnabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            const t = now + idx * 0.09;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.35);
        });
    }

    // Mega Jackpot Siren / Horn
    playJackpot() {
        if (!state.soundEnabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            const t = now + i * 0.22;
            osc.frequency.setValueAtTime(587.33, t);
            osc.frequency.linearRampToValueAtTime(880, t + 0.1);
            osc.frequency.linearRampToValueAtTime(587.33, t + 0.2);
            gain.gain.setValueAtTime(0.4, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.22);
        }
    }
}

const audio = new SlotAudio();

// ==========================================
// 3. DOM ELEMENTS
// ==========================================
const dom = {
    coinBalance: document.getElementById('coinBalance'),
    tokenBalance: document.getElementById('tokenBalance'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundIcon: document.getElementById('soundIcon'),
    winBanner: document.getElementById('winBanner'),
    bannerText: document.getElementById('bannerText'),
    reels: [
        document.getElementById('reel-0'),
        document.getElementById('reel-1'),
        document.getElementById('reel-2')
    ],
    strips: [
        document.getElementById('strip-0'),
        document.getElementById('strip-1'),
        document.getElementById('strip-2')
    ],
    // Clicker
    clickCounterDisplay: document.getElementById('clickCounterDisplay'),
    progressBar: document.getElementById('progressBar'),
    punchBtn: document.getElementById('punchBtn'),
    punchAvatar: document.getElementById('punchAvatar'),
    // Spin
    spinBtn: document.getElementById('spinBtn'),
    // Jackpot Modal
    jackpotOverlay: document.getElementById('jackpotOverlay'),
    jackpotTitle: document.getElementById('jackpotTitle'),
    jackpotPrize: document.getElementById('jackpotPrize'),
    collectBtn: document.getElementById('collectBtn'),
    coinBlastLayer: document.getElementById('coinBlastLayer')
};

// ==========================================
// 4. UI UPDATE
// ==========================================
function updateUI() {
    dom.coinBalance.textContent = state.coins.toLocaleString('id-ID');
    dom.tokenBalance.textContent = state.tokens;

    // Clicker status
    dom.clickCounterDisplay.textContent = `${state.clicksCount} / ${state.clicksRequired} KLIK`;
    const progressPct = (state.clicksCount / state.clicksRequired) * 100;
    dom.progressBar.style.width = `${progressPct}%`;

    // Spin button state
    dom.spinBtn.disabled = state.isSpinning || state.tokens < 1;
    if (state.tokens < 1 && !state.isSpinning) {
        dom.spinBtn.title = "Kumpulkan tiket dulu dengan klik 'Pukul Prabowo'!";
    } else {
        dom.spinBtn.title = "Klik untuk memutar!";
    }
}

function setBannerMessage(msg, isHighlight = false) {
    dom.bannerText.textContent = msg;
    if (isHighlight) {
        dom.winBanner.classList.remove('highlight');
        void dom.winBanner.offsetWidth; // Reflow
        dom.winBanner.classList.add('highlight');
    }
}

// ==========================================
// 5. PUKUL PRABOWO CLICKER ENGINE
// ==========================================
const punchEffects = ['POW! 💥', 'BAM! 🥊', 'DUARR! ⚡', 'PLAKK! 💢', 'SMASH! 🔥'];

function handlePunch(event) {
    audio.playPunch();

    // Animate button
    dom.punchBtn.classList.add('punched');
    setTimeout(() => dom.punchBtn.classList.remove('punched'), 120);

    // Increment click count
    state.clicksCount++;

    // Floating text particle at mouse/touch
    const x = event.clientX || (event.touches && event.touches[0].clientX) || (window.innerWidth / 2);
    const y = event.clientY || (event.touches && event.touches[0].clientY) || (window.innerHeight * 0.7);
    spawnFloatingPop(x, y);

    // Check if 5 clicks reached
    if (state.clicksCount >= state.clicksRequired) {
        state.clicksCount = 0;
        state.tokens++;
        audio.playTokenEarned();
        setBannerMessage('🎉 MANTAP! KAMU MENDAPATKAN +1 TIKET SPIN! 🎟️', true);
        spawnCoinBlast(8);
    } else {
        const remaining = state.clicksRequired - state.clicksCount;
        setBannerMessage(`🥊 PUKULAN MASUK! Butuh ${remaining}x klik lagi untuk +1 Tiket!`);
    }

    updateUI();
}

function spawnFloatingPop(x, y) {
    const el = document.createElement('div');
    el.className = 'float-click-pop';
    const text = punchEffects[Math.floor(Math.random() * punchEffects.length)];
    el.textContent = `${text} (+1)`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 750);
}

// ==========================================
// 6. 3-MATCH SLOT SPIN ENGINE
// ==========================================
function spinSlots() {
    if (state.isSpinning || state.tokens < 1) return;

    // Deduct 1 token
    state.tokens--;
    state.isSpinning = true;
    updateUI();

    setBannerMessage('🎰 MEMUTAR REELS... SEMOGA BOOYAH 777! 🍀');

    // Remove any previous win pulse
    document.querySelectorAll('.slot-item').forEach(el => el.classList.remove('winner-bounce'));

    // Start rolling animation on all 3 reels
    dom.reels.forEach(reel => reel.classList.add('rolling'));

    // Audio spinning ticks loop
    const tickInterval = setInterval(() => {
        audio.playTick();
    }, 110);

    // Determine outcomes in advance
    const results = [
        symbolPool[Math.floor(Math.random() * symbolPool.length)],
        symbolPool[Math.floor(Math.random() * symbolPool.length)],
        symbolPool[Math.floor(Math.random() * symbolPool.length)]
    ];

    // Easter egg chance: Boost 3-match excitement on some spins
    if (Math.random() < 0.28) {
        const luckySymbol = symbolPool[Math.floor(Math.random() * symbolPool.length)];
        results[0] = luckySymbol;
        results[1] = luckySymbol;
        results[2] = luckySymbol;
    }

    state.lastResults = results;

    // Staggered stop times
    const stopTimes = [850, 1350, 1850];

    stopTimes.forEach((delay, index) => {
        setTimeout(() => {
            // Stop specific reel
            dom.reels[index].classList.remove('rolling');
            dom.strips[index].innerHTML = `<div class="slot-item">${results[index]}</div>`;
            audio.playReelStop();

            // When last reel stops:
            if (index === 2) {
                clearInterval(tickInterval);
                state.isSpinning = false;
                evaluateResults(results);
            }
        }, delay);
    });
}

function evaluateResults(results) {
    const [r1, r2, r3] = results;

    // 1. Triple Match (JACKPOT)
    if (r1 === r2 && r2 === r3) {
        const matchData = SYMBOLS.find(s => s.icon === r1);
        const winAmount = matchData ? matchData.payout : 3000;
        state.coins += winAmount;

        // Bounce winning reels
        document.querySelectorAll('.slot-item').forEach(el => el.classList.add('winner-bounce'));

        if (r1 === '7️⃣') {
            // 777 MEGA JACKPOT
            audio.playJackpot();
            showJackpotModal('👑 MEGA SULTAN 777 👑', `+${winAmount.toLocaleString('id-ID')} KOIN`);
        } else {
            // Regular 3-match win
            audio.playWin();
            setBannerMessage(`🎉 3x ${r1} MATCH! MENANG BESAR +${winAmount.toLocaleString('id-ID')} KOIN! 💰`, true);
            spawnCoinBlast(24);
        }
    } 
    // 2. Double Match (Consolation)
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const bonus = 250;
        state.coins += bonus;
        audio.playWin();
        setBannerMessage(`✨ 2 MATCH KEMBAR! DAPAT BONUS HIBURAN +${bonus} KOIN! 💵`, true);
        spawnCoinBlast(8);
    } 
    // 3. No match
    else {
        setBannerMessage(`😅 Belum kena match! Pukul Prabowo lagi buat kumpulin tiket spin! 🥊`);
    }

    updateUI();
}

// ==========================================
// 7. JACKPOT MODAL & COIN BLASTS
// ==========================================
function showJackpotModal(title, prize) {
    dom.jackpotTitle.textContent = title;
    dom.jackpotPrize.textContent = prize;
    dom.jackpotOverlay.classList.add('active');
    spawnCoinBlast(35);
}

dom.collectBtn.addEventListener('click', () => {
    dom.jackpotOverlay.classList.remove('active');
    audio.playTokenEarned();
});

function spawnCoinBlast(count) {
    const icons = ['🪙', '💰', '💎', '⭐', '💵'];
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.className = 'blast-coin';
            coin.textContent = icons[Math.floor(Math.random() * icons.length)];
            coin.style.left = `${Math.random() * 85 + 5}%`;
            coin.style.top = `${Math.random() * 30 + 15}%`;

            dom.coinBlastLayer.appendChild(coin);
            setTimeout(() => coin.remove(), 1200);
        }, i * 35);
    }
}

// ==========================================
// 8. EVENT LISTENERS
// ==========================================
dom.punchBtn.addEventListener('click', (e) => handlePunch(e));
dom.punchBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handlePunch(e);
}, { passive: false });

dom.spinBtn.addEventListener('click', spinSlots);

dom.soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    dom.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
});

// Ambient background sparkles generator
function createSparkles() {
    const layer = document.getElementById('sparklesLayer');
    if (!layer) return;
    for (let i = 0; i < 20; i++) {
        const spark = document.createElement('div');
        spark.style.position = 'absolute';
        spark.style.width = '3px';
        spark.style.height = '3px';
        spark.style.backgroundColor = '#ffd700';
        spark.style.borderRadius = '50%';
        spark.style.boxShadow = '0 0 8px #ffd700';
        spark.style.left = `${Math.random() * 100}%`;
        spark.style.top = `${Math.random() * 100}%`;
        spark.style.opacity = Math.random() * 0.7 + 0.3;
        spark.style.animation = `bulbBlink ${Math.random() * 2 + 1}s infinite alternate`;
        layer.appendChild(spark);
    }
}

// Initial Boot
createSparkles();
updateUI();
