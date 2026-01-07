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

    // Options
    btnOptions.addEventListener('click', () => {
        // Redirect to standalone settings page
        window.location.href = 'settings.html';
    });

    // Archives (No tabs, just content)
    btnArchives.addEventListener('click', () => {
        const tabsContainer = document.getElementById('options-tabs');
        hide(tabsContainer); // Hide tabs for archives

        openModal("ARCHIVES", `
            <div style="padding: 1rem;">
                <p style="margin-bottom:1rem; border-left: 2px solid #fff; padding-left: 10px;">
                    <strong>FILE 001: SUBJECT ALPHA</strong><br>
                    <span style="font-size:0.8rem; color:#666;">DATE: 2084.10.21</span><br>
                    Subject shows promising adaptation to the neural interface. Rejection rate is below 2%.
                </p>
                <p style="margin-bottom:1rem; border-left: 2px solid #333; padding-left: 10px;">
                    <strong>FILE 002: THE INCIDENT</strong><br>
                    <span style="font-size:0.8rem; color:#666;">DATE: 2084.11.05</span><br>
                    Unexpected surge in sector 7. Containment breached.
                </p>
                <p style="color:#444;">[REMAINING DATA CORRUPTED]</p>
            </div>
        `);
    });

    // Back from Modal
    btnModalBack.addEventListener('click', () => {
        resetMenu();
    });

    // Exit
    btnExit.addEventListener('click', () => {
        hide(mainMenu);
        show(exitScreen);
        // Optional: Attempt to close window (often blocked)
        // window.close(); 
    });

    // Menu Item Hover Effects (Sound Placeholders)
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // console.log("Hover sound");
        });
    });

    // Glitch effect removed
});
