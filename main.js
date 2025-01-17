document.addEventListener('DOMContentLoaded', function() {
    // Animated text for homepage
    const words = ["Party", "DJ Night", "Event", "Saturday", "Friday Night"];
    const animatedText = document.getElementById("animated-text");
    let index = 0;

    function displayNextWord() {
        if (animatedText) {
            animatedText.textContent = words[index];
            animatedText.classList.remove("fade-in");
            void animatedText.offsetWidth; // Trigger reflow
            animatedText.classList.add("fade-in");
            index = (index + 1) % words.length;
        }
    }

    if (animatedText) {
        setInterval(displayNextWord, 1500);
        displayNextWord(); // Initial call
    }

    // Intersection Observer for fade-in elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    // Waitlist form functionality
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        const toggleBtns = waitlistForm.querySelectorAll('.toggle-btn');
        const userTypeInput = waitlistForm.querySelector('input[name="userType"]');
        const pocPhoneGroup = document.getElementById('pocPhoneGroup');

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                toggleBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                userTypeInput.value = this.dataset.type;
                if (this.dataset.type === 'club') {
                    pocPhoneGroup.classList.remove('hidden');
                } else {
                    pocPhoneGroup.classList.add('hidden');
                }
            });
        });

        waitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            try {
                const response = await fetch('/api/join-waitlist', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    alert('Successfully joined the waitlist!');
                    this.reset();
                } else {
                    alert('Error: ' + (result.error || 'Failed to join waitlist'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
});