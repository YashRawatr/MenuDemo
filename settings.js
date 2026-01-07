document.addEventListener('DOMContentLoaded', () => {

    // Tab Switching Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Find and show valid content
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Slider Value Updates
    const rangeInputs = document.querySelectorAll('.range-slider');
    rangeInputs.forEach(input => {
        input.addEventListener('input', () => {
            const nextSpan = input.parentElement.querySelector('.range-value');
            if (nextSpan) {
                nextSpan.innerText = input.value;
            }
        });
    });

    // Back Button (Return to Main Menu)
    document.getElementById('btn-back').addEventListener('click', () => {
        // Redirect to index.html
        window.location.href = 'index.html';
    });

    // Apply Button (Simulation)
    document.getElementById('btn-apply').addEventListener('click', () => {
        const btn = document.getElementById('btn-apply');
        const originalText = btn.innerText;

        btn.innerText = "SAVING...";
        btn.style.opacity = "0.7";

        setTimeout(() => {
            btn.innerText = "SETTINGS SAVED";
            btn.style.opacity = "1";

            setTimeout(() => {
                btn.innerText = originalText;
            }, 1500);
        }, 800);
    });

    // Reset Button
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (confirm("Reset all settings to default?")) {
            // Logic to reset inputs would go here
            location.reload(); // Simple reload for demo
        }
    });

});
