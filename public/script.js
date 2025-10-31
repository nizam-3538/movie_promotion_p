document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('.tilt-element');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10 degrees
            const rotateY = ((x - centerX) / centerX) * 10;  // Max rotation 10 degrees

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Marquee population and behavior
    const marqueeEl = document.querySelector('.marquee');
    if (marqueeEl) {
        const text = marqueeEl.getAttribute('data-scroll') || marqueeEl.textContent || '';
        // Put the text twice for a seamless loop
            const separator = ' \u2022 ';
            marqueeEl.textContent = text + separator + text;
            marqueeEl.tabIndex = 0; // make focusable for keyboard users

        // Pause animation on hover/focus for accessibility
        marqueeEl.addEventListener('mouseenter', () => {
            marqueeEl.style.animationPlayState = 'paused';
        });
        marqueeEl.addEventListener('mouseleave', () => {
            marqueeEl.style.animationPlayState = 'running';
        });
        marqueeEl.addEventListener('focus', () => {
            marqueeEl.style.animationPlayState = 'paused';
        });
            marqueeEl.addEventListener('blur', () => {
                marqueeEl.style.animationPlayState = 'running';
            });
    }

    // Views counter animation (0 -> 1,200,000) on page load
    (function animateViews() {
        const el = document.getElementById('views');
        if (!el) return;
    const target = 1200000; // 1.2M
    const duration = 10000; // ms (animate over 5 seconds)
        const start = performance.now();

        function formatNumber(n) {
            if (n >= 1000000) return (n/1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (n >= 1000) return (n/1000).toFixed(1).replace(/\.0$/, '') + 'K';
            return String(n);
        }

        function step(now) {
            const t = Math.min(1, (now - start) / duration);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.floor(eased * target);
            el.textContent = formatNumber(current);
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = formatNumber(target);
        }

    // Start animation shortly after load so it begins promptly
    setTimeout(() => requestAnimationFrame(step), 100);
    })();

        // Lightbox: open poster or trailer button to play YouTube in a lightbox
        function createLightbox() {
            const backdrop = document.createElement('div');
            backdrop.className = 'lightbox-backdrop';
            backdrop.innerHTML = `
                <div class="lightbox-content" role="dialog" aria-modal="true">
                    <button class="lightbox-close" aria-label="Close trailer">✕</button>
                    <div class="iframe-wrap"></div>
                </div>`;
            document.body.appendChild(backdrop);
            return backdrop;
        }

        const lightbox = createLightbox();

        function openLightbox(videoUrl) {
            const iframeWrap = lightbox.querySelector('.iframe-wrap');
                // If the URL looks like a local video file (mp4/webm), create a <video> element.
                const isLocalVideo = /\.(mp4|webm)(\?|$)/i.test(videoUrl);
                if (isLocalVideo) {
                    // Use HTML5 video player for local files. autoplay & controls included; muted to allow autoplay on some browsers.
                    iframeWrap.innerHTML = `<video controls autoplay playsinline muted style="width:100%;height:100%;object-fit:cover"><source src="${videoUrl}" type="video/${videoUrl.split('.').pop().split('?')[0]}">Your browser does not support the video tag.</video>`;
                } else {
                    // Inject iframe with autoplay muted (user can unmute)
                    iframeWrap.innerHTML = `<iframe src="${videoUrl}?autoplay=1&rel=0&modestbranding=1&mute=1" title="Trailer" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
                }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const iframeWrap = lightbox.querySelector('.iframe-wrap');
            iframeWrap.innerHTML = '';
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        document.addEventListener('click', (e) => {
            const poster = e.target.closest && e.target.closest('.poster-link');
            if (poster) {
                e.preventDefault();
                openLightbox(poster.getAttribute('data-video'));
                return;
            }
            const playBtn = e.target.closest && e.target.closest('.open-trailer');
            if (playBtn) {
                e.preventDefault();
                openLightbox(playBtn.getAttribute('data-video'));
                return;
            }
            if (e.target.classList && e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
            if (e.target.classList && e.target.classList.contains('lightbox-backdrop')) {
                closeLightbox();
            }
        });

        // close with Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
});