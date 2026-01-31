// Function to Open Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent body scroll
    }
}

// Function to Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Re-enable body scroll
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, offset: 100 });
    }

    // 2. Initialize Swiper Slider
    const swiper = new Swiper('.project-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });

    // Close modal if user clicks outside of the modal content
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    // 3. Skill Meter Animation
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const triggerSkills = () => {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            if (level) {
                const percentage = (parseInt(level) / 9) * 100;
                bar.style.width = percentage + '%';
            }
        });
    };

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerSkills();
                    observer.unobserve(skillsSection);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(skillsSection);
    }

    // 4. Form Submission Handling (AJAX)
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(form);
            
            submitBtn.disabled = true;
            submitBtn.textContent = "SENDING...";

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    status.innerHTML = "MESSAGE SENT SUCCESSFULLY!";
                    status.className = "form-status success";
                    form.reset();
                } else {
                    status.innerHTML = "OOPS! SOMETHING WENT WRONG.";
                    status.className = "form-status error";
                }
            } catch (error) {
                status.innerHTML = "OOPS! THERE WAS A PROBLEM.";
                status.className = "form-status error";
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "SEND MESSAGE";
            }
        });
    }

    // 5. GLOBAL TIMELINE THREAD SCROLL LOGIC
    // This finds every .timeline on the page and moves its .timeline-progress child
    const handleTimelineScroll = () => {
        const timelines = document.querySelectorAll('.timeline');
        const windowHeight = window.innerHeight;

        timelines.forEach(timeline => {
            const progressLine = timeline.querySelector('.timeline-progress');
            if (!progressLine) return;

            const rect = timeline.getBoundingClientRect();
            
            // Trigger starts when the top of the timeline is 80% down the screen
            const startTrigger = windowHeight * 0.8; 
            const progressRaw = (startTrigger - rect.top) / rect.height;
            
            // Constrain between 0% and 100%
            const progress = Math.min(Math.max(progressRaw * 100, 0), 100);
            
            progressLine.style.height = `${progress}%`;
        });
    };

    window.addEventListener('scroll', handleTimelineScroll);
    handleTimelineScroll(); // Run once on load to catch initial position
});