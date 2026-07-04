// ==========================================================================
// HANUMANTE SPECIAL FALUDA & COLD COCO - CORE WEB LOGIC
// Scroll Progress, Status Tracker, Mobile Navigation, Interactive Maps, Lightbox
// ==========================================================================

// --- 1. INITIALIZATION ON DOM CONTENT LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    initScrollProgressBar();
    initHeaderScrollEffect();
    initMobileDrawer();
    initLiveStoreStatus();
    initMapSelector();
    initGalleryLightbox();
    initSmoothScrollingSpy();
});

// --- 2. SCROLL PROGRESS BAR ---
function initScrollProgressBar() {
    const progressBar = document.getElementById("scroll-progress");
    if (!progressBar) return;
    
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrolled + "%";
    });
}

// --- 3. HEADER SCROLL EFFECT ---
function initHeaderScrollEffect() {
    const header = document.querySelector(".main-header");
    if (!header) return;
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

// --- 4. MOBILE DRAWER ---
function initMobileDrawer() {
    const toggleBtn = document.getElementById("menu-toggle-btn");
    const closeBtn = document.getElementById("drawer-close-btn");
    const drawer = document.getElementById("mobile-drawer-menu");
    const backdrop = document.getElementById("drawer-backdrop-overlay");
    const links = document.querySelectorAll(".drawer-link");

    if (!toggleBtn || !drawer || !backdrop) return;

    const openDrawer = () => {
        drawer.classList.add("open");
        backdrop.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    const closeDrawer = () => {
        drawer.classList.remove("open");
        backdrop.classList.remove("open");
        document.body.style.overflow = "";
    };

    toggleBtn.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    links.forEach(link => {
        link.addEventListener("click", closeDrawer);
    });
}

// --- 5. LIVE STORE OPEN STATUS TRACKER ---
function initLiveStoreStatus() {
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    
    if (!statusDot || !statusText) return;

    const updateStatus = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeVal = hours * 60 + minutes;

        const openTime = 11 * 60 + 30; // 11:30 AM
        const closeTimeLimit = 30;     // 12:30 AM

        let isOpen = false;

        if (timeVal >= openTime && timeVal <= 24 * 60) {
            isOpen = true;
        } else if (hours === 0 && minutes < closeTimeLimit) {
            isOpen = true;
        }

        if (isOpen) {
            statusDot.className = "status-dot green";
            statusText.innerHTML = `Open Now · Closes at <strong class="highlight-hours">12:30 AM</strong>`;
        } else {
            statusDot.className = "status-dot red";
            statusText.innerHTML = `Closed Now · Opens at <strong class="highlight-hours">11:30 AM</strong>`;
        }
    };

    updateStatus();
    setInterval(updateStatus, 60000);
}

// --- 6. INTERACTIVE MAP OUTLET SELECTOR ---
function initMapSelector() {
    const cards = document.querySelectorAll(".location-card");
    const mapIframe = document.getElementById("interactive-map-iframe");
    const mapLoader = document.getElementById("map-loader");

    if (!mapIframe) return;

    cards.forEach(card => {
        const selectBtn = card.querySelector(".select-map-btn");
        
        const updateMap = () => {
            const mapUrl = card.getAttribute("data-map-url");
            if (!mapUrl) return;

            cards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            
            if (mapLoader) mapLoader.classList.add("loading");
            
            mapIframe.setAttribute("src", mapUrl);
            
            if (window.innerWidth <= 768) {
                mapIframe.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        };

        card.addEventListener("click", (e) => {
            if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                updateMap();
            }
        });

        if (selectBtn) {
            selectBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                updateMap();
            });
        }
    });

    mapIframe.addEventListener("load", () => {
        if (mapLoader) mapLoader.classList.remove("loading");
    });
}

// --- 7. PHOTO GALLERY LIGHTBOX SYSTEM ---
function initGalleryLightbox() {
    const items = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("lightbox-close-btn");
    const prevBtn = document.getElementById("lightbox-prev-btn");
    const nextBtn = document.getElementById("lightbox-next-btn");

    if (!lightbox) return;

    let currentIndex = 0;
    const galleryImages = [];

    items.forEach((item, idx) => {
        galleryImages.push({
            src: item.getAttribute("data-image"),
            caption: item.getAttribute("data-caption")
        });
        
        item.addEventListener("click", () => {
            currentIndex = idx;
            openLightbox(currentIndex);
        });
    });

    const openLightbox = (idx) => {
        const image = galleryImages[idx];
        if (lightboxImg) lightboxImg.setAttribute("src", image.src);
        if (lightboxCaption) lightboxCaption.textContent = image.caption;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentIndex);
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        openLightbox(currentIndex);
    };

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", showPrev);
    if (nextBtn) nextBtn.addEventListener("click", showNext);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("open")) return;
        
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
    });
}

// --- 8. SCROLL SPY & LINK ACTIVE STATE ---
function initSmoothScrollingSpy() {
    const navLinks = document.querySelectorAll(".nav-desktop .nav-link, .mobile-drawer .drawer-link");
    const sections = document.querySelectorAll("section, header");

    const updateActiveLink = () => {
        let currentSectionId = "home";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                const id = section.getAttribute("id");
                if (id) currentSectionId = id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
}
