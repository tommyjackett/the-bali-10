/* ============================================================
   THE BALI 10 — script.js
   Countdown · Polaroid bio modal · Ticker · Best-man poll
   ============================================================ */

/* ---------- ALWAYS LOAD FROM THE TOP (desktop + mobile, incl. iOS Safari bfcache) ---------- */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
// Strip any lingering anchor so the browser doesn't jump to it on reload
if (location.hash) history.replaceState(null, '', location.pathname + location.search);

function __scrollTopHard() {
  window.scrollTo(0, 0);
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
}
__scrollTopHard();
window.addEventListener('DOMContentLoaded', __scrollTopHard);
window.addEventListener('load', () => { __scrollTopHard(); requestAnimationFrame(__scrollTopHard); });
window.addEventListener('pageshow', __scrollTopHard);  // covers mobile back/forward bfcache

/* ---------- 0. YOUTUBE IFRAME API — reliable looping for unlisted videos ---------- */
var heroPlayer, bodhiPlayer;

// Pause a player when its iframe scrolls out of view; resume when back in view.
function observeForVisibility(player) {
  if (!('IntersectionObserver' in window)) return;
  const iframe = player.getIframe && player.getIframe();
  if (!iframe) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!player || typeof player.pauseVideo !== 'function') return;
      if (entry.isIntersecting) {
        try { player.playVideo(); } catch (_) {}
      } else {
        try { player.pauseVideo(); } catch (_) {}
      }
    });
  }, { threshold: 0.25 });
  io.observe(iframe);
}

function onYouTubeIframeAPIReady() {
  if (document.getElementById('hero-player')) {
    heroPlayer = new YT.Player('hero-player', {
      width: '100%', height: '100%',
      videoId: 'KL1dsh0B38w',
      playerVars: {
        autoplay: 1, mute: 1, controls: 1,
        modestbranding: 1, rel: 0, playsinline: 1,
        iv_load_policy: 3
      },
      events: {
        onReady: (e) => {
          e.target.playVideo();
          observeForVisibility(e.target);
          // Unmute on the first user interaction — browsers block audible autoplay.
          const unmute = () => {
            try { e.target.unMute(); e.target.setVolume(100); } catch (_) {}
            ['click', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
              document.removeEventListener(ev, unmute, true)
            );
          };
          ['click', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
            document.addEventListener(ev, unmute, { once: true, capture: true })
          );
        },
        onStateChange: (e) => { if (e.data === 0) { e.target.seekTo(0); e.target.playVideo(); } }
      }
    });
  }
  if (document.getElementById('bodhi-player')) {
    bodhiPlayer = new YT.Player('bodhi-player', {
      width: '100%', height: '100%',
      videoId: 'c-ixAloBfsk',
      playerVars: {
        autoplay: 1, mute: 1, controls: 1,
        modestbranding: 1, rel: 0, playsinline: 1
      },
      events: {
        onReady: (e) => {
          e.target.playVideo();
          observeForVisibility(e.target);
        },
        onStateChange: (e) => { if (e.data === 0) { e.target.seekTo(0); e.target.playVideo(); } }
      }
    });
  }
}

/* ---------- 1. COUNTDOWN ---------- */
// Melbourne (AEST, +10:00 in August — no DST)
const DEPARTURE = new Date('2026-08-23T17:45:00+10:00');

function tickCountdown() {
  const now = new Date();
  const diff = DEPARTURE - now;
  const el = {
    days:  document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    mins:  document.querySelector('[data-unit="mins"]'),
    secs:  document.querySelector('[data-unit="secs"]'),
  };
  if (diff <= 0) {
    [el.days, el.hours, el.mins, el.secs].forEach(n => n && (n.textContent = '0'));
    return;
  }
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  if (el.days)  el.days.textContent  = days;
  if (el.hours) el.hours.textContent = String(hours).padStart(2, '0');
  if (el.mins)  el.mins.textContent  = String(mins).padStart(2, '0');
  if (el.secs)  {
    el.secs.textContent = String(secs).padStart(2, '0');
    el.secs.classList.add('tick');
    setTimeout(() => el.secs.classList.remove('tick'), 300);
  }
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* ---------- 2. CAST BIOS ---------- */
const CAST = {
  'justin-jordana': {
    names: 'JUSTIN & JORDANA',
    nickname: 'The Smut Kings 📚🔥',
    photo: 'assets/couples/Jordana and Justin.PNG',
    occupation: 'Justin: private equity (funds big builds). Jordana: "works" for the government. 20% effort. 100% profit.',
    training: 'Justin is a secret scratch golfer. Jordana is on page 237 of her third romance novel this week.',
    spicy: '🌶️🌶️🌶️🌶️🌶️ — Jordana, extra spicy',
    mostExcited: 'The golf tournament (Justin) · Tropical book club of one (Jordana)',
    mostLikely: 'Justin: annihilate every bloke by day three. Jordana: host a beachside Tupperware pitch.',
    quote: '"Nusa Dua ain\'t gonna know what hit it."',
    badges: ['Early Birds', 'Landing Saturday', 'Golf Assassin', 'MLM CEO'],
  },
  'renee-al': {
    names: 'RENEE & AL',
    nickname: 'The Countdown Kings ⏰🍦',
    photo: 'assets/couples/Renee and Al.PNG',
    occupation: 'Al works for a developer on major gov projects (currently very over it). Renee is in HR. Yes. That HR.',
    training: 'Al books first, counts loudest. Renee quietly carries party-mix lollies for the entire group.',
    spicy: '🌶️ — minimal spice, all business',
    mostExcited: 'FREE ICE CREAM (Al) · It actually happening (Renee)',
    mostLikely: 'Al: book every activity before coffee. Renee: field every inappropriate comment.',
    quote: '"4 months / 121 days to Bali — not that I\'m counting."',
    badges: ['Booked First', 'Ice Cream Obsessed', 'Group HR'],
  },
  'lauren-oscar': {
    names: 'LAUREN & OSCAR',
    nickname: 'Always Training 🍷🛠️',
    photo: 'assets/couples/Lauren and Oscar.png',
    occupation: 'Oscar: own insurance-jobs building business. Lauren: merch co. → our official Bali 10 tee plug.',
    training: 'Lauren: yacht club, winery, repeat. Oscar: 5am start, then still buys the next round.',
    spicy: '🌶️🌶️🌶️ — medium. Will take the medication anyway.',
    mostExcited: 'Graduating from training to the main event',
    mostLikely: 'MISS THE FLIGHT. If Lauren\'s AFL team makes the Grand Final on Aug 23, Oscar is a solo dad at 30,000 ft.',
    quote: '"Always training."',
    badges: ['Grand Final Risk', 'Solo-Dad-In-Waiting', 'Merch Girl', 'Tradie'],
  },
  'tommy-amy': {
    names: 'TOMMY & AMY',
    nickname: 'The Chief & The Ex-Stripper ⛪💃',
    photo: 'assets/couples/Tommy and Amy.jpeg',
    occupation: 'Amy: Chief of Staff at a building business (runs the joint). Tommy: own video + podcast shop, AI-obsessed. Haters will say it\'s AI. They\'re right.',
    training: 'Amy: in business casual, in the pool. Tommy: in Pambula, training for Bali.',
    spicy: '🌶️🌶️🌶️🌶️ — undiagnosed, very spicy',
    mostExcited: 'The photo booth + a mullet fitting (Amy) · Testing whether the buckled-hand AI photo was a prophecy (Tommy)',
    mostLikely: 'Amy: still win trivia. Tommy: drop a Daz deepfake you can\'t unsee.',
    quote: '"Don\'t have to be good when you\'re the funnest." · "Keep your shirt on, Tommy."',
    badges: ['Cheaper Flights Than Al', 'AI Sweatshop', 'Bible College Alum', 'The Funnest'],
  },
  'rachel-darren': {
    names: 'RACHEL & DAZ',
    nickname: 'Katut & Rhonda 🍹👑',
    photo: 'assets/couples/Darren and Rachel.jpeg',
    occupation: 'Daz: IT wiz, own business (will fix resort wifi by day 2). Rachel: EA at one of Australia\'s biggest toy companies.',
    training: 'Daz: fire up, stay fired up. Rachel: observe, document, roast.',
    spicy: '🌶️ — butter chicken level',
    mostExcited: 'The glowing white dad-bod debut',
    mostLikely: 'Daz: set the tone before wheels up. Rachel: coin the nickname that sticks.',
    quote: '"Good morning, you look so hot today." · "Look for the glowing white dad bod and the sound of chaos."',
    badges: ['Late Arrivals', 'Nickname Architect', 'Man-Servant', 'Toy Industry Insider'],
  },
};

/* ---------- 3. POLAROID → MODAL ---------- */
const modal = document.getElementById('bioModal');
const modalInner = document.getElementById('bioInner');

/* Per-couple face-aware crop for the bio hero photo.
   Values tuned so the eyes sit at roughly the vertical centre of the 4:3 frame.
   Lower % = shows more of the top of the original (pushes faces down in frame). */
const FACE_POS = {
  'justin-jordana': 'center 8%',
  'renee-al':       'center 6%',
  'lauren-oscar':   'center 12%',
  'tommy-amy':      'center 22%',
  'rachel-darren':  'center 25%',
};

function openBio(key) {
  const c = CAST[key];
  if (!c) return;
  const pos = FACE_POS[key] || 'center 28%';
  modalInner.innerHTML = `
    <div class="bio-banner">MEET YOUR CONTESTANT</div>
    <div class="bio-hero">
      <img src="${c.photo}" alt="${c.names}" style="object-position: ${pos};">
      <div class="chyron">${c.nickname.toUpperCase()}</div>
    </div>
    <div class="bio-body">
      <h3>${c.names}</h3>
      <p class="sub">${c.occupation}</p>
      <div class="bio-stats">
        <div class="stat"><b>Training regime</b>${c.training}</div>
        <div class="stat"><b>Neuro-spicy rating</b>${c.spicy}</div>
        <div class="stat"><b>Most excited about</b>${c.mostExcited}</div>
        <div class="stat"><b>Most likely to</b>${c.mostLikely}</div>
      </div>
      <blockquote class="quote">${c.quote}</blockquote>
      <div class="bio-badges">${c.badges.map(b => `<span>${b}</span>`).join('')}</div>
    </div>
  `;
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
}

document.querySelectorAll('.polaroid').forEach(card => {
  card.addEventListener('click', () => openBio(card.dataset.couple));
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBio(card.dataset.couple); }
  });
});

modal.addEventListener('click', e => {
  if (e.target === modal || e.target.closest('[data-close]')) modal.close();
});

/* ---------- 4. BEST-MAN POLL ---------- */
const POLL_KEY = 'bali10_bestman_poll';
const POLL_VOTED_KEY = 'bali10_bestman_voted';
const DEFAULTS = { justin: 3, tommy: 5, oscar: 2, daz: 7 }; // seeded for vibes

function getPoll() {
  try { return JSON.parse(localStorage.getItem(POLL_KEY)) || { ...DEFAULTS }; }
  catch { return { ...DEFAULTS }; }
}
function savePoll(p) { localStorage.setItem(POLL_KEY, JSON.stringify(p)); }
function renderPoll() {
  const p = getPoll();
  const total = Object.values(p).reduce((a, b) => a + b, 0) || 1;
  Object.entries(p).forEach(([k, v]) => {
    const fill = document.querySelector(`[data-fill="${k}"]`);
    const count = document.querySelector(`[data-count="${k}"]`);
    const btn = document.querySelector(`[data-vote="${k}"]`);
    if (fill) fill.style.width = `${Math.round((v / total) * 100)}%`;
    if (count) count.textContent = v;
    if (btn && localStorage.getItem(POLL_VOTED_KEY) === k) btn.classList.add('voted');
  });
}
document.querySelectorAll('[data-vote]').forEach(btn => {
  btn.addEventListener('click', () => {
    const prior = localStorage.getItem(POLL_VOTED_KEY);
    const p = getPoll();
    if (prior === btn.dataset.vote) return;
    if (prior && p[prior] > 0) p[prior] -= 1;
    p[btn.dataset.vote] = (p[btn.dataset.vote] || 0) + 1;
    savePoll(p);
    localStorage.setItem(POLL_VOTED_KEY, btn.dataset.vote);
    document.querySelectorAll('[data-vote]').forEach(b => b.classList.remove('voted'));
    btn.classList.add('voted');
    renderPoll();
  });
});
renderPoll();

/* ---------- 5. WHATSAPP AUTO-SCROLL (seamless loop) ---------- */
// Duplicate the track contents so the -50% translate lands exactly on the next copy.
(function () {
  const track = document.querySelector('#waMessages .wa-track');
  if (!track) return;
  const clones = Array.from(track.children).map(el => {
    const c = el.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    return c;
  });
  clones.forEach(c => track.appendChild(c));
})();

