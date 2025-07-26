document.addEventListener('DOMContentLoaded', function () {
    
    //======================================================================
    // --- Logic for Click-to-Reveal Coupon Popup (#popup-overlay) ---
    //======================================================================
    
    const redeemOfferCards = document.querySelectorAll('.offer-card');
    const clickPopupOverlay = document.getElementById('popup-overlay');
    const clickPopupClose = document.getElementById('popup-close');
    const clickPopupCode = document.getElementById('popup-code');
    const clickPopupCopyBtn = document.getElementById('popup-copy-btn');

    if (clickPopupOverlay) {
        redeemOfferCards.forEach(card => {
            card.addEventListener('click', function () {
                const couponCodeEl = card.querySelector('.code');
                if (couponCodeEl) {
                    const couponCode = couponCodeEl.textContent;
                    clickPopupCode.textContent = couponCode;
                    clickPopupOverlay.classList.add('active');
                }
            });
        });

        if (clickPopupClose) {
            clickPopupClose.addEventListener('click', function () {
                clickPopupOverlay.classList.remove('active');
            });
        }

        clickPopupOverlay.addEventListener('click', function (e) {
            if (e.target === clickPopupOverlay) {
                clickPopupOverlay.classList.remove('active');
            }
        });

        if (clickPopupCopyBtn) {
            clickPopupCopyBtn.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent card click event from firing again
                navigator.clipboard.writeText(clickPopupCode.textContent).then(() => {
                    const originalText = clickPopupCopyBtn.textContent;
                    clickPopupCopyBtn.textContent = 'COPIED!';
                    createSimpleConfetti(); 

                    if (typeof gtag === 'function') {
                        gtag('event', 'click', {
                            'event_category': 'Button Clicks',
                            'event_action': 'Click',
                            'event_label': 'Popup Copy Button'
                        });
                    }

                    setTimeout(() => {
                        clickPopupCopyBtn.textContent = originalText;
                    }, 2000);
                });
            });
        }
    }

    function createSimpleConfetti() {
        const popup = document.querySelector('#popup-overlay .coupon-popup');
        if (!popup || typeof confetti !== 'function') return;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#58a6ff', '#e3b341', '#f778ba', '#3fb950', '#e6edf3']
        });
    }

    //======================================================================
    // --- Logic for Auto-Open Promo Popup (#promoPopup) ---
    //======================================================================

    const promoPopup = document.getElementById("promoPopup");
    if (!promoPopup) return; 

    const promoPopupContent = promoPopup.querySelector(".popup-content");
    const promoCloseBtn = promoPopup.querySelector(".close-popup");
    const promoCopyBtn = document.getElementById("copyButton");
    const timerDisplay = document.getElementById('timerDisplay');

    let popupOpened = false;
    
    const triggerCelebrationEffect = () => {
        if (typeof confetti !== 'function') return;

        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1002 };
        // New vibrant color palette
        const colors = ['#58a6ff', '#e3b341', '#f778ba', '#3fb950', '#e6edf3'];

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, colors: colors, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, colors: colors, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };
    
    const startCountdown = (duration) => {
        if (!timerDisplay) return;
        let timer = duration;
        const interval = setInterval(() => {
            if(timer < 0) {
                 clearInterval(interval);
                 timerDisplay.textContent = "DEAL EXPIRED";
                 return;
            }
            let minutes = String(Math.floor(timer / 60)).padStart(2, '0');
            let seconds = String(timer % 60).padStart(2, '0');
            timerDisplay.textContent = `${minutes}:${seconds}`;
            timer--;
        }, 1000);
    };

    const openPromoPopup = () => {
        if (popupOpened || localStorage.getItem('hidePromoPopup') === 'true') return;
        popupOpened = true;
        promoPopup.style.display = "flex";
        
        setTimeout(() => {
            promoPopup.classList.add("active");
            triggerCelebrationEffect();
        }, 10);
        
        startCountdown(599); // 10 minutes (9:59)
    };
    
    window.closePopup = () => {
        promoPopup.classList.remove("active");
        setTimeout(() => {
            promoPopup.style.display = "none";
        }, 400);
    };

    window.copyCouponCode = () => {
        const codeEl = document.getElementById("couponCode");
        const code = codeEl.innerText;
        navigator.clipboard.writeText(code).then(() => {
            const copyTextEl = promoCopyBtn.querySelector('.copy-text');
            const originalText = copyTextEl.innerHTML;
            copyTextEl.innerHTML = 'COPIED!';
            promoCopyBtn.style.backgroundColor = '#3fb950'; // Success color
            
            setTimeout(() => {
                copyTextEl.innerHTML = originalText;
                promoCopyBtn.style.backgroundColor = ''; // Revert to original CSS color
            }, 2000);
        });
    };

    // --- Triggers for Auto-Open Popup ---
    document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0 && !popupOpened) { // Only trigger if it hasn't opened yet
            openPromoPopup();
        }
    });

    // Time-based trigger (e.g., after 3 seconds)
    setTimeout(openPromoPopup, 3000);

    if (promoCloseBtn) {
        promoCloseBtn.addEventListener('click', window.closePopup);
    }
});


//======================================================================
// --- Universal Functions (can be called from HTML onclick) ---
//======================================================================

function copyCoupon(code) {
  navigator.clipboard.writeText(code);

  // Find the button that was clicked to provide targeted feedback
  const buttons = document.querySelectorAll('.btn-redeem');
  let clickedButton = null;

  buttons.forEach(btn => {
      const parentContainer = btn.closest('.coupon-container');
      const codeSpan = parentContainer.querySelector('.code, .mystery-coupon');
      if (codeSpan && codeSpan.innerText === code) {
        clickedButton = btn;
      }
  });

  if (clickedButton) {
      const container = clickedButton.closest('.coupon-container');
      container.classList.add('copied');
      const origText = clickedButton.innerText;
      clickedButton.innerText = 'COPIED!';
      clickedButton.style.background = 'var(--color-accent-success)';

      setTimeout(() => {
          clickedButton.innerText = origText;
          clickedButton.style.background = ''; // Revert to CSS
          container.classList.remove('copied');
      }, 1200);
  }
}

// Close popups with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    const activePopupOverlay = document.getElementById('popup-overlay');
    const activePromoPopup = document.getElementById('promoPopup');

    if (activePopupOverlay && activePopupOverlay.classList.contains('active')) {
      activePopupOverlay.classList.remove('active');
    }
    if (activePromoPopup && activePromoPopup.classList.contains('active')) {
      window.closePopup();
    }
  }
});