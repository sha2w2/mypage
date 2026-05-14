(function () {
    // 1. Reveal animations on scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Performance: only reveal once
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -10px 0px" });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 2. Scroll progress bar (system feedback)
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 3. Active navigation state (redundant coding: color + weight)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.style.color = '';
            link.style.fontWeight = '500';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--accent-soft)';
                link.style.fontWeight = '600';
            }
        });
    });
})();