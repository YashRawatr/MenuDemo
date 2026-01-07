document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const mainMenu = document.getElementById('main-menu');
    const loadingScreen = document.getElementById('loading-screen');
    const modalScreen = document.getElementById('modal-screen');
    const exitScreen = document.getElementById('exit-screen');

    // Buttons
    const btnNewGame = document.getElementById('btn-newgame');
    const btnContinue = document.getElementById('btn-continue');
    const btnOptions = document.getElementById('btn-options');
    const btnArchives = document.getElementById('btn-archives');
    const btnExit = document.getElementById('btn-exit');

    const btnLoadingCancel = document.getElementById('btn-loading-cancel');
    const btnModalBack = document.getElementById('btn-modal-back');

    // Dynamic Content
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const progressFill = document.querySelector('.progress-fill');
    const loadingStatus = document.querySelector('.loading-status');

    let loadingInterval;

    // --- Audio Setup ---
    const bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.5; // Set volume to 50%

    // Try to play immediately
    const playMusic = () => {
        bgMusic.play().catch(error => {
            console.log("Autoplay blocked, waiting for interaction...");
        });
    };
    playMusic();

    // Ensure music starts on first interaction if autoplay failed
    const enableAudio = () => {
        if (bgMusic.paused) {
            bgMusic.play();
        }
        document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);

    // --- Helpers ---
    const show = (el) => el.classList.remove('hidden');
    const hide = (el) => el.classList.add('hidden');

    const resetMenu = () => {
        hide(loadingScreen);
        hide(modalScreen);
        hide(exitScreen);
        show(mainMenu);
        clearInterval(loadingInterval);
        progressFill.style.width = '0%';
    };

    // --- Actions ---

    const startLoading = (mode) => {
        hide(mainMenu);
        show(loadingScreen);

        // Reset
        progressFill.style.width = '0%';
        loadingStatus.innerText = "ESTABLISHING CONNECTION...";

        let progress = 0;
        loadingInterval = setInterval(() => {
            progress += Math.random() * 2;
            if (progress > 100) progress = 100;

            progressFill.style.width = `${progress}%`;

            // Random status updates
            if (progress > 30 && progress < 32) loadingStatus.innerText = "DECRYPTING MEMORY BLOCKS...";
            if (progress > 60 && progress < 62) loadingStatus.innerText = "SYNCHRONIZING CONSCIOUSNESS...";
            if (progress > 90 && progress < 92) loadingStatus.innerText = "WAKING UP...";

            if (progress >= 100) {
                clearInterval(loadingInterval);
                loadingStatus.innerText = "COMPLETE. WELCOME BACK.";
                setTimeout(() => {
                    // Redirect to Game Demo
                    window.location.href = 'game.html';
                }, 500);
            }
        }, 50); // Speed of loading
    };

    const openModal = (title, content) => {
        hide(mainMenu);
        show(modalScreen);
        modalTitle.innerText = title;
        modalBody.innerHTML = content;
    };

    // --- Event Listeners ---

    // New Game / Continue
    btnNewGame.addEventListener('click', () => startLoading("NEW GAME"));
    btnContinue.addEventListener('click', () => startLoading("SAVED GAME"));

    // Cancel Loading
    btnLoadingCancel.addEventListener('click', () => {
        resetMenu(); // This fulfills the "come back to menu" requirement
    });

    // --- Options Data & Generation ---
    const optionsData = {
        video: `
            <div class="settings-grid">
                <div class="setting-item">
                    <label class="setting-label">Resolution</label>
                    <select class="menu-item" style="border:1px solid #333; padding:5px; font-size:0.8rem;">
                        <option>3840 x 2160</option>
                        <option selected>2560 x 1440</option>
                        <option>1920 x 1080</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label class="setting-label">Fullscreen Mode</label>
                    <label class="toggle-container">
                        <input type="checkbox" checked>
                        <span class="checkmark"></span>
                    </label>
                </div>
                <!-- Sliders -->
                <div class="setting-item">
                    <label class="setting-label">Gamma Correction</label>
                    <input type="range" min="0" max="100" value="50" oninput="this.nextElementSibling.innerText = this.value + '%'">
                    <span class="range-value">50%</span>
                </div>
                <div class="setting-item">
                    <label class="setting-label">Motion Blur</label>
                    <label class="toggle-container">
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
        `,
        audio: `
            <div class="settings-grid">
                <div class="setting-item">
                    <label class="setting-label">Master Volume</label>
                    <input type="range" min="0" max="100" value="80" oninput="this.nextElementSibling.innerText = this.value + '%'">
                    <span class="range-value">80%</span>
                </div>
                <div class="setting-item">
                    <label class="setting-label">Music Volume</label>
                    <input type="range" min="0" max="100" value="60" oninput="this.nextElementSibling.innerText = this.value + '%'">
                    <span class="range-value">60%</span>
                </div>
                <div class="setting-item">
                    <label class="setting-label">SFX Volume</label>
                    <input type="range" min="0" max="100" value="100" oninput="this.nextElementSibling.innerText = this.value + '%'">
                    <span class="range-value">100%</span>
                </div>
                <div class="setting-item">
                    <label class="setting-label">Subtitles</label>
                    <label class="toggle-container">
                        <input type="checkbox" checked>
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
        `,
        gameplay: `
            <div class="settings-grid">
                <div class="setting-item">
                    <label class="setting-label">Difficulty</label>
                    <select class="menu-item" style="border:1px solid #333; padding:5px; font-size:0.8rem;">
                        <option>STORY</option>
                        <option selected>NORMAL</option>
                        <option>HARDCORE</option>
                        <option>NIGHTMARE</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label class="setting-label">Auto-Save</label>
                    <label class="toggle-container">
                        <input type="checkbox" checked>
                        <span class="checkmark"></span>
                    </label>
                </div>
                         <div class="setting-item">
                    <label class="setting-label">Crosshair</label>
                    <label class="toggle-container">
                        <input type="checkbox" checked>
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
        `
    };

    const setupTabs = () => {
        const tabsContainer = document.getElementById('options-tabs');
        const tabBtns = document.querySelectorAll('.tab-btn');

        show(tabsContainer);

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update Active State
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Inject Content
                const tabKey = btn.getAttribute('data-tab');
                modalBody.innerHTML = optionsData[tabKey];
            });
        });

        // Trigger first tab
        tabBtns[0].click();
    };

    // --- Settings / Options Logic (Merged) ---

    // Elements
    const settingsScreen = document.getElementById('settings-screen');
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab Switching
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // Slider Updates
    const rangeInputs = document.querySelectorAll('.range-slider');
    rangeInputs.forEach(input => {
        input.addEventListener('input', () => {
            const nextSpan = input.parentElement.querySelector('.range-value');
            if (nextSpan) nextSpan.innerText = input.value;
        });
    });

    // Volume Control
    const masterVolume = document.getElementById('master-volume');
    if (masterVolume && bgMusic) {
        masterVolume.addEventListener('input', (e) => {
            bgMusic.volume = e.target.value / 100;
        });
    }

    // Options Button (Show Settings Overlay)
    btnOptions.addEventListener('click', () => {
        hide(mainMenu);
        show(settingsScreen);
    });

    // Back Button (Hide Settings Overlay)
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            hide(settingsScreen);
            show(mainMenu);
        });
    }

    // Apply Button
    const btnApply = document.getElementById('btn-apply');
    if (btnApply) {
        btnApply.addEventListener('click', () => {
            const originalText = btnApply.innerText;
            btnApply.innerText = "SAVING...";
            btnApply.style.opacity = "0.7";
            setTimeout(() => {
                btnApply.innerText = "SETTINGS SAVED";
                btnApply.style.opacity = "1";
                setTimeout(() => {
                    btnApply.innerText = originalText;
                }, 1500);
            }, 800);
        });
    }

    // Reset Button
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm("Reset all settings to default?")) {
                // Reset logic could go here
                alert("Settings reset.");
            }
        });
    }
});
