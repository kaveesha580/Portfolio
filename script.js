window.addEventListener('load', function() {
        const loader = document.getElementById('loaderWrapper');
        setTimeout(() => { 
            loader.classList.add('hide'); 
            setTimeout(() => loader.style.display = 'none', 500); 
        }, 500);
    });

    // Typing Animation
    const words = ["University Student🎓","Videographer🎥", "Photographer📸", "Creator🖌️"];
    const typedTextElement = document.getElementById('typedText');
    let wordIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500;
        }
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }
        setTimeout(typeEffect, typingSpeed);
    }
    setTimeout(typeEffect, 500);

    // ========= DARK / LIGHT MODE TOGGLE - FIXED =========
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIconSpan = document.getElementById('themeIcon');
    const themeTextSpan = document.getElementById('themeText');

    // Function to set theme
    function setTheme(isDark) {
        if (isDark) {
            document.body.classList.remove('light-mode');
            themeIconSpan.textContent = '🌙';
            themeTextSpan.textContent = 'Dark Mode';
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            themeIconSpan.textContent = '☀️';
            themeTextSpan.textContent = 'Light Mode';
            localStorage.setItem('portfolio-theme', 'light');
        }
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        setTheme(false);
    } else {
        setTheme(true);
    }

    // Toggle button click event
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const isCurrentlyDark = !document.body.classList.contains('light-mode');
            setTheme(!isCurrentlyDark);
        });
    }

    // Timeline Progress
    const timelineContainer = document.getElementById('timelineRoot');
    const progressFill = document.getElementById('timelineProgressFill');
    const educationSection = document.getElementById('education');
    if (progressFill) progressFill.style.height = "0%";

    function updateTimelineProgress() {
        if (!timelineContainer || !progressFill || !educationSection) return;
        const windowHeight = window.innerHeight;
        const viewportCenter = windowHeight / 2;
        const sectionRect = educationSection.getBoundingClientRect();
        let percentage = 0;
        if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
            if (sectionRect.top <= viewportCenter) {
                const passedAmount = viewportCenter - sectionRect.top;
                const totalHeight = sectionRect.bottom - sectionRect.top;
                if (totalHeight > 0) percentage = Math.min(0.98, passedAmount / totalHeight);
            }
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                const dot = item.querySelector('.timeline-dot');
                if (dot) {
                    const dotRect = dot.getBoundingClientRect();
                    const dotCenter = dotRect.top + (dotRect.height / 2);
                    if (dotCenter <= viewportCenter) {
                        percentage = Math.max(percentage, (index + 1) / timelineItems.length);
                    }
                }
            });
        }
        if (sectionRect.bottom <= 0) percentage = 0.98;
        progressFill.style.height = (Math.min(0.98, Math.max(0, percentage)) * 100) + "%";
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { updateTimelineProgress(); ticking = false; });
            ticking = true;
        }
    });
    window.addEventListener('resize', updateTimelineProgress);
    window.addEventListener('load', () => { updateTimelineProgress(); setTimeout(updateTimelineProgress, 100); });

    // Smooth navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== "#" && targetId.startsWith('#')) {
                e.preventDefault();
                document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    const feedbackPara = document.getElementById('formFeedback');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('nameInput')?.value.trim();
            const email = document.getElementById('emailInput')?.value.trim();
            const msg = document.getElementById('msgInput')?.value.trim();
            if (name && email && msg) {
                feedbackPara.style.color = "#59ff00";
                feedbackPara.innerHTML = "✨ Thanks " + name + "! Your message has been received!";
                contactForm.reset();
                setTimeout(() => feedbackPara.innerHTML = "", 4000);
            } else {
                feedbackPara.style.color = "#ffaa66";
                feedbackPara.innerHTML = "⚠️ Please fill all fields.";
                setTimeout(() => { if (feedbackPara.innerHTML.includes("fill")) feedbackPara.innerHTML = ""; }, 3000);
            }
        });
    }