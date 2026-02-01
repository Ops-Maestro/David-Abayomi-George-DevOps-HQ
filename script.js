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
    // 1. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, offset: 100 });
    }

    // 2. Initialize Swiper Slider for Projects
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

    // 3. IMPROVED SKILL METER ANIMATION (Repeats on Scroll)
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const bar = entry.target;
            const level = bar.getAttribute('data-level');

            if (entry.isIntersecting) {
                // When section is viewed, fill the bar to the level
                setTimeout(() => {
                    bar.style.setProperty('width', level, 'important');
                }, 150); 
            } else {
                // When scrolled away, reset the width so it re-animates later
                bar.style.setProperty('width', '0', 'important');
            }
        });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => skillObserver.observe(bar));

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
    const handleTimelineScroll = () => {
        const timelines = document.querySelectorAll('.timeline');
        const windowHeight = window.innerHeight;

        timelines.forEach(timeline => {
            const progressLine = timeline.querySelector('.timeline-progress');
            if (!progressLine) return;

            const rect = timeline.getBoundingClientRect();
            const startTrigger = windowHeight * 0.8; 
            const progressRaw = (startTrigger - rect.top) / rect.height;
            const progress = Math.min(Math.max(progressRaw * 100, 0), 100);
            
            progressLine.style.height = `${progress}%`;
        });
    };

    window.addEventListener('scroll', handleTimelineScroll);
    handleTimelineScroll(); 
});