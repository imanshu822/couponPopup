document.addEventListener('DOMContentLoaded', function () {
    // --- Logic for Click-to-Reveal Coupon Popup ---
    const redeemButtons = document.querySelectorAll('.btn-redeem');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupClose = document.getElementById('popup-close');
    const popupCode = document.getElementById('popup-code');
    const popupCopyBtn = document.getElementById('popup-copy-btn');

    if (popupOverlay) {
        // Add click event to each redeem button
        redeemButtons.forEach(button => {
            button.addEventListener('click', function () {
                const couponId = this.id.replace('redeem-button-', '');
                const couponCodeEl = document.getElementById(`coupon-code-${couponId}`);
                if (couponCodeEl) {
                    const couponCode = couponCodeEl.textContent;
                    popupCode.textContent = couponCode;
                    popupOverlay.classList.add('active');

                    // Highlight the clicked offer card
                    const offerCard = this.closest('.offer-card');
                    if (offerCard) {
                        offerCard.classList.add('offer-highlight');
                        setTimeout(() => {
                            offerCard.classList.remove('offer-highlight');
                        }, 1500);
                    }
                }
            });
        });

        // Close popup with the '×' button
        if (popupClose) {
            popupClose.addEventListener('click', function () {
                popupOverlay.classList.remove('active');
            });
        }

        // Close popup when clicking on the overlay background
        popupOverlay.addEventListener('click', function (e) {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
            }
        });

        // Copy code from within the popup
        if (popupCopyBtn) {
            popupCopyBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(popupCode.textContent).then(() => {
                    const originalText = popupCopyBtn.textContent;
                    popupCopyBtn.textContent = 'COPIED!';
                    createConfetti();

                    // Track the event with Google Analytics
                    if (typeof gtag === 'function') {
                        gtag('event', 'click', {
                            'event_category': 'Button Clicks',
                            'event_action': 'Click',
                            'event_label': 'Popup Copy Button'
                        });
                    }

                    setTimeout(() => {
                        popupCopyBtn.textContent = originalText;
                    }, 2000);
                });
            });
        }
    }

    // Function to create a confetti effect inside the popup
    function createConfetti() {
        const popup = document.querySelector('.coupon-popup');
        if (!popup) return;
        const colors = ['#FF6B00', '#FF9500', '#FFC300', '#FFE600', '#FF8A00'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = Math.random() * 100 + '%';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            popup.appendChild(confetti);

            setTimeout(() => {
                confetti.style.opacity = '1';
                confetti.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`;
                confetti.style.transition = 'all 0.5s ease-out';
                setTimeout(() => {
                    confetti.style.opacity = '0';
                    setTimeout(() => confetti.remove(), 500);
                }, 1000);
            }, 0);
        }
    }
});

// --- Logic for Auto-Open Promo Popup ---
const promoPopup = document.getElementById("promoPopup");

function openPopup() {
    if (promoPopup) {
        promoPopup.style.display = "flex";
    }
}

function closePopup() {
    if (promoPopup) {
        promoPopup.style.display = "none";
    }
}

function copyCouponCode() {
    const codeEl = document.getElementById("couponCode");
    if (codeEl) {
        const code = codeEl.innerText;
        navigator.clipboard.writeText(code).then(() => {
            alert("Coupon code copied!");
        });
    }
}

// Auto-open popup after 5 seconds
window.onload = function () {
    setTimeout(openPopup, 5000);
};


document.addEventListener('DOMContentLoaded', function () {
  const promoPopup = document.getElementById("promoPopup");
  const closeBtn = promoPopup.querySelector(".close-popup");
  const copyBtn = document.getElementById("copyButton");
  const dontShowAgainCheckbox = document.getElementById("dontShowAgain");

  let popupOpened = false;

  let animationFrameId;
  let canvas, ctx;



  const openPromoPopup = () => {
    if (popupOpened || localStorage.getItem('hidePromoPopup') === 'true') return;
    popupOpened = true;
    promoPopup.style.display = "flex";
    setTimeout(() => promoPopup.classList.add("active"), 10);

    startCountdown(600);
  };

  window.closePopup = () => {
    if (dontShowAgainCheckbox && dontShowAgainCheckbox.checked) {
      localStorage.setItem('hidePromoPopup', 'true');
    }
    promoPopup.classList.remove("active");
    setTimeout(() => {
      promoPopup.style.display = "none";
      stopStarAnimation();
    }, 400);
  };

  document.addEventListener('mouseout', (e) => {
    if (e.clientY <= 0) {
      openPromoPopup();
    }
  });

  setTimeout(openPromoPopup, 2000);

  closeBtn.addEventListener('click', closePopup);

  window.copyCouponCode = () => {
    const codeEl = document.getElementById("couponCode");
    const code = codeEl.innerText;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBtn.querySelector('.copy-text').innerHTML;
      copyBtn.classList.add('copied');
      copyBtn.querySelector('.copy-text').innerHTML = 'COPIED!';
      createParticles(copyBtn);
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('.copy-text').innerHTML = originalText;
      }, 2000);
    });
  };

  const createParticles = (button) => {
    const rect = button.getBoundingClientRect();
    const buttonCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      document.body.appendChild(particle);

      const angle = Math.random() * 360;
      const distance = Math.random() * 60 + 40;
      const size = Math.random() * 4 + 4;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${buttonCenter.x}px`;
      particle.style.top = `${buttonCenter.y}px`;
      particle.style.setProperty('--x', `${Math.cos(angle * Math.PI / 180) * distance}px`);
      particle.style.setProperty('--y', `${Math.sin(angle * Math.PI / 180) * distance}px`);

      setTimeout(() => particle.remove(), 600);
    }
  };

  const startCountdown = (duration) => {
    let timer = duration;
    const timerDisplay = document.getElementById('timerDisplay');
    const interval = setInterval(() => {
      let minutes = String(Math.floor(timer / 60)).padStart(2, '0');
      let seconds = String(timer % 60).padStart(2, '0');
      timerDisplay.textContent = `${minutes}:${seconds}`;
      if (--timer < 0) {
        clearInterval(interval);
        timerDisplay.textContent = "DEAL EXPIRED";
      }
    }, 1000);
  };

  window.addEventListener('resize', () => {
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const promoPopup = document.getElementById("promoPopup");
  const popupContent = promoPopup.querySelector(".popup-content"); // Target content for shake
  const closeBtn = popupContent.querySelector(".close-popup");
  const copyBtn = document.getElementById("copyButton");
  const dontShowAgainCheckbox = document.getElementById("dontShowAgain");

  let popupOpened = false;
  let animationFrameId;
  let canvas, ctx;



  const stopStarAnimation = () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
  
  // ✨ NEW: Function to trigger confetti celebration
  const triggerCelebrationEffect = () => {
    // Check if confetti function exists
    if (typeof confetti !== 'function') return;

    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1001 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      // Launch confetti from two sides
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };


  const openPromoPopup = () => {
    if (popupOpened || localStorage.getItem('hidePromoPopup') === 'true') return;
    popupOpened = true;
    promoPopup.style.display = "flex";
    
    setTimeout(() => {
        popupContent.classList.add("active");
        
        // ✨ NEW: Add shake effect to popup content
        popupContent.classList.add('shake');
        
        // ✨ NEW: Trigger confetti 🎉
        triggerCelebrationEffect();
        
        // Remove shake class after animation finishes (600ms)
        setTimeout(() => popupContent.classList.remove('shake'), 600);

    }, 10);
    
    setupCanvas();
    startCountdown(600);
  };

  window.closePopup = () => {
    if (dontShowAgainCheckbox && dontShowAgainCheckbox.checked) {
      localStorage.setItem('hidePromoPopup', 'true');
    }
    popupContent.classList.remove("active");
    setTimeout(() => {
      promoPopup.style.display = "none";
      stopStarAnimation();
    }, 400);
  };

  document.addEventListener('mouseout', (e) => {
    if (e.clientY <= 0) {
      openPromoPopup();
    }
  });

  setTimeout(openPromoPopup, 2000);

  closeBtn.addEventListener('click', closePopup);

  window.copyCouponCode = () => {
    const codeEl = document.getElementById("couponCode");
    const code = codeEl.innerText;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBtn.querySelector('.copy-text').innerHTML;
      copyBtn.classList.add('copied');
      copyBtn.querySelector('.copy-text').innerHTML = 'COPIED!';
      createParticles(copyBtn);
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('.copy-text').innerHTML = originalText;
      }, 2000);
    });
  };

  const createParticles = (button) => {
    const rect = button.getBoundingClientRect();
    const buttonCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      document.body.appendChild(particle);

      const angle = Math.random() * 360;
      const distance = Math.random() * 60 + 40;
      const size = Math.random() * 4 + 4;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${buttonCenter.x}px`;
      particle.style.top = `${buttonCenter.y}px`;
      particle.style.setProperty('--x', `${Math.cos(angle * Math.PI / 180) * distance}px`);
      particle.style.setProperty('--y', `${Math.sin(angle * Math.PI / 180) * distance}px`);

      setTimeout(() => particle.remove(), 600);
    }
  };

  const startCountdown = (duration) => {
    let timer = duration;
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;
    const interval = setInterval(() => {
      let minutes = String(Math.floor(timer / 60)).padStart(2, '0');
      let seconds = String(timer % 60).padStart(2, '0');
      timerDisplay.textContent = `${minutes}:${seconds}`;
      if (--timer < 0) {
        clearInterval(interval);
        timerDisplay.textContent = "DEAL EXPIRED";
      }
    }, 1000);
  };

  window.addEventListener('resize', () => {
    if (canvas && popupOpened) {
        stopStarAnimation();
        setupCanvas();
    }
  });
});