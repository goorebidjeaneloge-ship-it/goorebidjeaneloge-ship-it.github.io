/* =====================================================================
   PORTFOLIO D'ÉLITE — SCRIPT D'INTERACTION & MINI-TERMINAL CLI
   DJEAN-BI GOORE Jules Euloge — L2 TWIN (ESATIC)
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. LIGNE DE PROGRESSION DE SCROLL NÉON --- */
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });

    /* --- 2. CARD SPOTLIGHT (LUEUR SOUS LE CURSEUR) --- */
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--card-mouse-x', `${x}px`);
            card.style.setProperty('--card-mouse-y', `${y}px`);
        });
    });

    /* --- 3. GESTION DES TEXTES CENSURÉS [REDACTED] --- */
    const redactedSpans = document.querySelectorAll('.redacted');
    redactedSpans.forEach(span => {
        span.addEventListener('click', () => {
            span.classList.toggle('revealed');
            playTerminalKeySound(700);
        });
    });

    const btnDeclassifyAll = document.getElementById('btn-declassify-all');
    if (btnDeclassifyAll) {
        btnDeclassifyAll.addEventListener('click', () => {
            document.body.classList.toggle('all-declassified');
            const isAllOpen = document.body.classList.contains('all-declassified');
            if (isAllOpen) {
                btnDeclassifyAll.innerHTML = `<span>🔓</span> Tout Déclassifié`;
                btnDeclassifyAll.style.borderColor = 'var(--neon-cyan)';
                btnDeclassifyAll.style.color = 'var(--neon-cyan)';
                playAccessGrantedSound();
            } else {
                btnDeclassifyAll.innerHTML = `<span>🔒</span> Rétablir Censure`;
                btnDeclassifyAll.style.borderColor = 'var(--border-subtle)';
                btnDeclassifyAll.style.color = 'var(--text-main)';
                playTerminalKeySound(420);
            }
        });
    }

    /* --- 4. SWITCH MODE RAPPORT CLAIR & IMPRESSION / CV --- */
    const btnPaperMode = document.getElementById('btn-paper-mode');
    if (btnPaperMode) {
        btnPaperMode.addEventListener('click', () => {
            document.body.classList.toggle('mode-paper');
            const isPaper = document.body.classList.contains('mode-paper');
            btnPaperMode.innerHTML = isPaper ? `<span>📄</span> Mode Papier` : `<span>🖥️</span> Mode Sombre`;
            playTerminalKeySound(550);
        });
    }

    const btnPrintCv = document.getElementById('btn-print-cv');
    if (btnPrintCv) {
        btnPrintCv.addEventListener('click', () => {
            playTerminalKeySound(800);
            window.print();
        });
    }

    /* --- 5. MINI TERMINAL CLI INTERACTIF --- */
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const cliChips = document.querySelectorAll('.cli-chip');

    const cliResponses = {
        help: `Commandes disponibles :\n  • cat bio.txt   : Afficher le parcours de l'étudiant\n  • ls projects   : Lister les 4 projets en production\n  • ls certs      : Afficher les certifications mondiales\n  • contact       : Coordonnées téléphoniques & réseaux\n  • clear         : Nettoyer la console\n  • whoami        : Identité de la session active`,
        whoami: `Session active : Recruteur invité [ACCRÉDITÉ NIVEAU 4]\nConnexion sécurisée établie avec DJEAN-BI GOORE Jules Euloge.`,
        'cat bio.txt': `[IDENTITÉ : DJEAN-BI GOORE Jules Euloge]\n• Baccalauréat Scientifique Série D (Promotion 2025)\n• Licence 2 TWIN (Technologie du Web et Image Numérique) — ESATIC Abidjan\n• Objectif : Création de plateformes web & mobiles scalables et performantes.`,
        bio: `[IDENTITÉ : DJEAN-BI GOORE Jules Euloge]\n• Baccalauréat Scientifique Série D (Promotion 2025)\n• Licence 2 TWIN — ESATIC Abidjan.`,
        'ls projects': `[4 SYSTÈMES EN PRODUCTION] :\n1. SCP-042 "Xamly" : Révision d'examens nationaux ivoiriens hors-ligne + IA\n2. SCP-108 "Calculateur Concours" : Algorithme des filières ESATIC/INP-HB\n3. SCP-256 "Coffre-fort Numérique" : Stockage chiffré de pièces d'état civil\n4. SCP-512 "CLI Task Manager" : Moteur Pure Dart (Camp FlutterFire 2026)`,
        projects: `1. Xamly (Mobile/Supabase) | 2. Calculateur (Django/Python) | 3. Coffre-fort (Web Sec) | 4. Dart CLI (OOP)`,
        'ls certs': `[10 CERTIFICATIONS INTERNATIONALES ACCRÉDITÉES] :\n• OpenClassrooms : Python Basics, Git/GitHub, HTML/CSS\n• Cisco Networking Academy : Apply AI (Resume & Customer Reviews)\n• NextFlutter : Dart CLI Architecture (Camp FlutterFire 2026)\n• freeCodeCamp : Responsive Web Design V8\n• ICDL Africa : L'Essentiel sur Ordinateur et Web\n• MTN Academy / Microsoft : L'IA pour tous\n• Coursera : Excel for Data Analysis`,
        certs: `10 Certifications : OpenClassrooms, Cisco, NextFlutter, freeCodeCamp, ICDL, MTN/Microsoft, Coursera.`,
        contact: `[LIAISON DIRECTE] :\n• Téléphone / WhatsApp : +225 05 00 30 05 96\n• GitHub : https://github.com/goorebidjeaneloge-ship-it\n• LinkedIn : eloge-goore-bi-djean-b4699039a`,
        sudo: `Permission refusée : L'accréditation root nécessite une signature de contrat de stage 😉`,
        clear: `CLEAR_SCREEN`
    };

    function executeCliCommand(cmdRaw) {
        const cmd = cmdRaw.trim().toLowerCase();
        if (!cmd) return;

        playTerminalKeySound(680);

        if (cmd === 'clear') {
            cliOutput.innerText = `Terminal réinitialisé. Tapez 'help' ou cliquez sur un filtre ci-dessus.\n`;
            if (cliInput) cliInput.value = '';
            return;
        }

        const response = cliResponses[cmd] || `Commande inconnue: '${cmdRaw}'. Tapez 'help' pour la liste des commandes.`;
        cliOutput.innerText += `\nuser@esatic:~$ ${cmdRaw}\n${response}\n`;
        cliOutput.scrollTop = cliOutput.scrollHeight;
        if (cliInput) cliInput.value = '';
    }

    if (cliInput) {
        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeCliCommand(cliInput.value);
            }
        });
    }

    cliChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            executeCliCommand(cmd);
        });
    });

    /* --- 6. COMPTEURS STATISTIQUES ANIMÉS --- */
    const statCounters = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            el.innerText = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.innerText = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statCounters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    if (!isNaN(target)) {
                        animateValue(counter, 0, target, 1600);
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    const statsStrip = document.querySelector('.stats-counter-strip');
    if (statsStrip) {
        statsObserver.observe(statsStrip);
    }

    /* --- 7. AUDIO CLAVIER TERMINAL & BIPS WEBAUDIO --- */
    let audioCtx = null;
    let isSoundMuted = false;

    function initAudio() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTerminalKeySound(freq = 600) {
        if (isSoundMuted) return;
        try {
            initAudio();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.06);
        } catch (e) {}
    }

    function playAccessGrantedSound() {
        if (isSoundMuted) return;
        try {
            initAudio();
            const now = audioCtx.currentTime;
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                gain.gain.setValueAtTime(0.05, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.12);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.14);
            });
        } catch (e) {}
    }

    const btnSound = document.getElementById('btn-scp-sound');
    if (btnSound) {
        btnSound.addEventListener('click', () => {
            initAudio();
            isSoundMuted = !isSoundMuted;
            if (!isSoundMuted) {
                btnSound.innerHTML = `<span>🔊</span> Audio Actif`;
                btnSound.style.borderColor = 'var(--neon-green)';
                playAccessGrantedSound();
            } else {
                btnSound.innerHTML = `<span>🔇</span> Audio Muet`;
                btnSound.style.borderColor = 'var(--border-subtle)';
            }
        });
    }

    document.querySelectorAll('.btn-scp, .scp-nav-link').forEach(btn => {
        btn.addEventListener('click', () => playTerminalKeySound(650));
    });
});
