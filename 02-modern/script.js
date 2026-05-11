document.addEventListener('DOMContentLoaded', function() {
    
    // --- Elements ---
    const btnOpen = document.getElementById('btn-open-invitation');
    const cover = document.getElementById('theme-cover');
    const mainContent = document.getElementById('main-content');
    const fabContainer = document.getElementById('theme-fab-container');
    const btnMusic = document.getElementById('btn-toggle-music');
    const bgMusic = document.getElementById('bg-music');
    
    // --- Open Invitation ---
    if (btnOpen) {
        btnOpen.addEventListener('click', function() {
            // Hide cover and show main content
            cover.classList.add('hide');
            mainContent.style.display = 'block';
            
            // Show FAB
            if (fabContainer) fabContainer.style.display = 'flex';
            
            // Play Music
            if (bgMusic) {
                bgMusic.play().catch(err => console.log("Auto-play blocked"));
                updateMusicUI();
            }
            
            // Re-trigger scrollspy for initial sections
            UIkit.scrollspy(mainContent).check();
        });
    }

    // --- Music Control ---
    function updateMusicUI() {
        const icon = btnMusic.querySelector('i');
        if (bgMusic.paused) {
            btnMusic.classList.remove('playing');
            icon.setAttribute('uk-icon', 'play');
        } else {
            btnMusic.classList.add('playing');
            icon.setAttribute('uk-icon', 'pause');
        }
    }

    if (btnMusic && bgMusic) {
        btnMusic.addEventListener('click', function() {
            if (bgMusic.paused) {
                bgMusic.play();
            } else {
                bgMusic.pause();
            }
        });
        
        bgMusic.addEventListener('play', updateMusicUI);
        bgMusic.addEventListener('pause', updateMusicUI);
    }

    // --- Countdown Timer ---
    const targetDate = new Date("Dec 31, 2026 23:59:59").getTime();
    
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.querySelector('[data-var="countdown_hari"]');
        const hoursEl = document.querySelector('[data-var="countdown_jam"]');
        const minsEl = document.querySelector('[data-var="countdown_menit"]');
        const secsEl = document.querySelector('[data-var="countdown_detik"]');
        
        if (daysEl) daysEl.innerText = d.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = h.toString().padStart(2, '0');
        if (minsEl) minsEl.innerText = m.toString().padStart(2, '0');
        if (secsEl) secsEl.innerText = s.toString().padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(timer);
        }
    }, 1000);

    // --- Form RSVP Logic ---
    const btnSubmitRSVP = document.getElementById('btn-submit-kehadiran');
    if (btnSubmitRSVP) {
        btnSubmitRSVP.addEventListener('click', function() {
            const code = document.getElementById('rsvp-code').value;
            const name = document.getElementById('rsvp-guests').value;
            const status = document.getElementById('rsvp-status').value;
            const alertEl = document.getElementById('alert-submit-kehadiran');
            
            if (!name || !status) {
                alertEl.innerText = "Mohon lengkapi nama dan status kehadiran.";
                alertEl.style.display = 'block';
                alertEl.style.color = '#dc3545';
                return;
            }
            
            btnSubmitRSVP.disabled = true;
            btnSubmitRSVP.innerText = "Mengirim...";
            
            setTimeout(() => {
                const container = document.getElementById('rsvp-container');
                container.innerHTML = `
                    <div class="alert-success">
                        <h3>Terima Kasih!</h3>
                        <p>Konfirmasi Anda telah kami terima. Terima kasih <strong>${name}</strong>!</p>
                    </div>
                `;
            }, 1500);
        });
    }

    // --- Form Ucapan Logic ---
    const btnSubmitWish = document.getElementById('btn-submit-ucapan');
    if (btnSubmitWish) {
        btnSubmitWish.addEventListener('click', function() {
            const name = document.getElementById('wish-name').value;
            const message = document.getElementById('wish-message').value;
            const alertEl = document.getElementById('alert-submit-ucapan');
            
            if (!name || !message) {
                alertEl.innerText = "Mohon lengkapi nama dan ucapan Anda.";
                alertEl.style.display = 'block';
                alertEl.style.color = '#dc3545';
                return;
            }
            
            btnSubmitWish.disabled = true;
            btnSubmitWish.innerText = "Mengirim...";
            
            setTimeout(() => {
                const container = document.getElementById('wish-form-container');
                container.innerHTML = `
                    <div class="alert-success">
                        <p>Terima kasih atas doa dan ucapan manisnya! ✨</p>
                    </div>
                `;
                // Optionally prepend to list
            }, 1500);
        });
    }

    // --- Form Hadiah Logic ---
    const btnSubmitGift = document.getElementById('btn-submit-hadiah');
    if (btnSubmitGift) {
        btnSubmitGift.addEventListener('click', function() {
            const name = document.getElementById('gift-name').value;
            const bank = document.getElementById('gift-bank').value;
            const alertEl = document.getElementById('alert-submit-hadiah');
            
            if (!name || !bank) {
                alertEl.innerText = "Mohon lengkapi nama dan informasi pengirim.";
                alertEl.style.display = 'block';
                alertEl.style.color = '#dc3545';
                return;
            }
            
            btnSubmitGift.disabled = true;
            btnSubmitGift.innerText = "Mengirim...";
            
            setTimeout(() => {
                const container = document.getElementById('gift-form-container');
                container.innerHTML = `
                    <div class="alert-success">
                        <p>Terima kasih <strong>${name}</strong> atas kiriman hadiahnya! 🙏</p>
                    </div>
                `;
            }, 1500);
        });
    }

    // --- Copy to Clipboard Function ---
    window.copyToClipboard = function(elementId, btn) {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        const text = el.innerText || el.textContent;
        const originalText = btn.innerText;

        navigator.clipboard.writeText(text).then(() => {
            btn.innerText = "Tersalin!";
            btn.style.background = "#28a745";
            
            // UIkit Toast
            UIkit.notification({
                message: '<span uk-icon="check"></span> Nomor rekening berhasil disalin!',
                status: 'success',
                pos: 'bottom-center',
                timeout: 2000
            });

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
            }, 2000);
        }).catch(err => {
            console.error('Copy failed', err);
        });
    };

    // --- Scroll reveal adjustment ---
    // Make sure elements are revealed as they enter viewport
    window.addEventListener('scroll', function() {
        // Any custom scroll logic here
    });

});
