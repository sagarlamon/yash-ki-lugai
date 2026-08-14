// Birthday Cake Cutting & Random Cat Celebration Party Script
document.addEventListener('DOMContentLoaded', () => {
  const cutBtn = document.getElementById('cutBtn');
  const cakeContainer = document.getElementById('cakeContainer');
  const velas = document.getElementById('velas');
  const sliceLine = document.getElementById('sliceLine');
  const hintBanner = document.getElementById('hintBanner');
  const knifeFollower = document.getElementById('knifeFollower');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const catPartyOverlay = document.getElementById('catPartyOverlay');

  let isCut = false;
  let audioCtx = null;

  // List of all 13 Cat GIFs and Images with festive speech bubbles & keywords
  const catSquad = [
    { src: './claping cat/cat-clapping-cat.gif', alt: 'Clapping Cat', speech: 'APPLAUSE! 👏', keyword: 'CLAP CLAP!' },
    { src: './claping cat/cat-dancing-cat.gif', alt: 'Dancing Cat', speech: 'DANCE TIME! 💃', keyword: 'GROOVE!' },
    { src: './claping cat/happy-cat-cat.gif', alt: 'Happy Cat', speech: 'HAPPY HAPPY! 😸', keyword: 'YAY!' },
    { src: './claping cat/clap-cat.gif', alt: 'Clap Cat', speech: 'SO PROUD! 👏', keyword: 'BRAVO!' },
    { src: './claping cat/funny-jump.gif', alt: 'Funny Jump Cat', speech: 'BOING BOING! 🦘', keyword: 'JUMP!' },
    { src: './claping cat/beluga-beluga-cat-meme.gif', alt: 'Beluga Cat Meme', speech: 'MORE CAKE! 🐱', keyword: 'CHAMPION!' },
    { src: './claping cat/cat-laughing-laughing-teeth-cat.gif', alt: 'Laughing Cat', speech: 'HAHAHA! 😂', keyword: 'FUNNY!' },
    { src: './claping cat/suprised-cat-surprised.gif', alt: 'Surprised Cat', speech: 'WOAH CAKE! 😲', keyword: 'OMG!' },
    { src: './claping cat/cat-blobbo-excite.webp', alt: 'Blobbo Excite', speech: 'EXCITE! ✨', keyword: 'WOOO!' },
    { src: './claping cat/clap-cat (1).gif', alt: 'Clap Cat 2', speech: 'PARTY OVERLOAD! 🎉', keyword: 'PARTY!' },
    { src: './claping cat/clappi-cat-clapping.webp', alt: 'Clappi Cat', speech: 'BEST DAY EVER! 💖', keyword: 'HOORAY!' },
    { src: './claping cat/clappi-clappi-clappi.webp', alt: 'Clappi Clappi', speech: 'CLAPPI CLAPPI! 😻', keyword: 'CUTE!' },
    { src: './claping cat/clapping-cat.webp', alt: 'Clapping Cat Webp', speech: 'CHEERS TO QT! 🥳', keyword: 'CELEBRATE!' }
  ];

  // Sound Synth Generator
  function playSound(type) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (type === 'slice') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'cheer') {
        const notes = [392, 392, 440, 392, 523.25, 493.88, 587.33];
        const times = [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1.2];
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + times[i]);
          gain.gain.setValueAtTime(0.22, audioCtx.currentTime + times[i]);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + times[i] + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + times[i]);
          osc.stop(audioCtx.currentTime + times[i] + 0.35);
        });
      } else if (type === 'pop') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500 + Math.random() * 500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      }
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  // Knife Follow Cursor
  window.addEventListener('mousemove', (e) => {
    if (!isCut && knifeFollower) {
      knifeFollower.style.left = e.clientX + 'px';
      knifeFollower.style.top = e.clientY + 'px';
      knifeFollower.style.opacity = '1';
    }
  });

  window.addEventListener('mouseleave', () => {
    if (knifeFollower) knifeFollower.style.opacity = '0';
  });

  // Spawn All 13 Cats in Random Positions across Screen
  function spawnRandomCatParty() {
    catPartyOverlay.innerHTML = '';
    
    // Grid slot positions to prevent total overlapping while keeping random organic feel
    const slots = [
      { left: 4, top: 8 },    { left: 74, top: 6 },   { left: 38, top: 4 },
      { left: 3, top: 42 },   { left: 78, top: 40 },  { left: 14, top: 72 },
      { left: 68, top: 70 },  { left: 42, top: 74 },  { left: 24, top: 20 },
      { left: 58, top: 22 },  { left: 82, top: 72 },  { left: 2, top: 24 },
      { left: 84, top: 24 }
    ];

    // Shuffle slots
    const shuffledSlots = [...slots].sort(() => Math.random() - 0.5);

    catSquad.forEach((cat, index) => {
      const slot = shuffledSlots[index] || { left: Math.random() * 75 + 5, top: Math.random() * 70 + 10 };
      
      // Randomize offsets slightly
      const finalLeft = Math.min(84, Math.max(2, slot.left + (Math.random() * 6 - 3)));
      const finalTop = Math.min(80, Math.max(5, slot.top + (Math.random() * 6 - 3)));
      const rotDeg = (Math.random() * 24 - 12).toFixed(1);
      const scale = (Math.random() * 0.25 + 0.85).toFixed(2);
      const animType = (index % 3) + 1; // 1, 2, 3 animation variations

      const catEl = document.createElement('div');
      catEl.className = `floating-cat-item anim-type-${animType}`;
      catEl.style.left = `${finalLeft}%`;
      catEl.style.top = `${finalTop}%`;
      catEl.style.setProperty('--rot', `${rotDeg}deg`);
      catEl.style.setProperty('--scale', scale);
      catEl.style.animationDelay = `${(Math.random() * 0.8).toFixed(2)}s`;

      catEl.innerHTML = `
        <div class="cat-speech-bubble">${cat.speech}</div>
        <div class="cat-img-wrapper">
          <img src="${cat.src}" alt="${cat.alt}" />
          <span class="cat-badge">${cat.keyword}</span>
        </div>
      `;

      // Interactive Click on Cat
      catEl.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('pop');
        catEl.classList.add('pop-spin');
        setTimeout(() => catEl.classList.remove('pop-spin'), 600);
      });

      catPartyOverlay.appendChild(catEl);
    });

    catPartyOverlay.classList.add('active');
  }

  // Cut Cake Action
  function performCut() {
    if (isCut) return;
    isCut = true;

    if (knifeFollower) knifeFollower.style.opacity = '0';

    // Play Slicing Sound
    playSound('slice');

    // Trigger Knife Slice Line Flash
    sliceLine.classList.add('active');

    // Extinguish Candles
    velas.classList.add('extinguished');

    // Separate / Slice Cake
    cakeContainer.classList.add('is-cut');

    // Update Header Buttons & Banner
    cutBtn.textContent = 'Shuffle Party 🔀';
    if (hintBanner) {
      hintBanner.innerHTML = '<span>🎉 HAPPY CELEBRATION! CLICK CATS OR PRESS "SHUFFLE PARTY"! 🥳</span>';
      hintBanner.classList.add('celebrate');
    }

    // Play Cheer Melody
    setTimeout(() => playSound('cheer'), 250);

    // Launch Confetti
    startConfetti();

    // Spawn Random Cat Party across the screen
    setTimeout(spawnRandomCatParty, 300);

    // Show Gift Banner ("I have something for you…") with blush-cat.gif
    const giftBanner = document.getElementById('giftBanner');
    setTimeout(() => {
      if (giftBanner) giftBanner.classList.add('active');
    }, 600);
  }

  // Event Listeners for Cutting / Reshuffling
  if (cutBtn) {
    cutBtn.addEventListener('click', () => {
      if (isCut) {
        // Reshuffle cat positions and trigger cheer!
        playSound('pop');
        spawnRandomCatParty();
        startConfetti();
      } else {
        performCut();
      }
    });
  }

  if (cakeContainer) {
    cakeContainer.addEventListener('click', () => {
      if (!isCut) {
        performCut();
      } else {
        playSound('pop');
        spawnRandomCatParty();
      }
    });
  }

  // Confetti Animation Engine
  let confettiCtx = confettiCanvas.getContext('2d');
  let particles = [];
  let confettiRunning = false;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function startConfetti() {
    particles = [];
    const colors = ['#ff4081', '#ffeb3b', '#00e676', '#00b0ff', '#e040fb', '#ff9100', '#ffffff'];
    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 5 + 2,
        speedX: Math.random() * 3 - 1.5,
        rot: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4
      });
    }

    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(updateConfetti);
    }
  }

  function updateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rot += p.rotSpeed;

      if (p.y < confettiCanvas.height + 20) alive = true;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rot * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      confettiCtx.restore();
    });

    if (alive && isCut) {
      requestAnimationFrame(updateConfetti);
    } else {
      confettiRunning = false;
    }
  }
});
