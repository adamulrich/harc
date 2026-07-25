document.addEventListener("DOMContentLoaded", () => {
    const images = Array.from(document.querySelectorAll("[data-lightbox-gallery] img"));

    if (!images.length) {
        return;
    }

    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
        <div class="lightbox-backdrop" data-lightbox-close></div>
        <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Expanded image">
            <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">&lsaquo;</button>
            <button class="lightbox-close" type="button" aria-label="Close image viewer" data-lightbox-close>&times;</button>
            <img class="lightbox-image" alt="">
            <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">&rsaquo;</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const dialogImage = overlay.querySelector(".lightbox-image");
    const closeElements = overlay.querySelectorAll("[data-lightbox-close]");
    const prevButton = overlay.querySelector(".lightbox-prev");
    const nextButton = overlay.querySelector(".lightbox-next");
    let lastActiveElement = null;
    let currentIndex = -1;

    function syncNavigation() {
        const hasMultipleImages = images.length > 1;
        prevButton.style.display = hasMultipleImages ? "flex" : "none";
        nextButton.style.display = hasMultipleImages ? "flex" : "none";
    }

    function closeLightbox() {
        overlay.classList.remove("lightbox-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-active");
        dialogImage.removeAttribute("src");
        currentIndex = -1;

        if (lastActiveElement instanceof HTMLElement) {
            lastActiveElement.focus();
        }
    }

    function showImage(index) {
        const image = images[index];
        if (!image) {
            return;
        }

        currentIndex = index;
        dialogImage.src = image.currentSrc || image.src;
        dialogImage.alt = image.alt || "";
        syncNavigation();
    }

    function openLightbox(image) {
        lastActiveElement = document.activeElement;
        showImage(images.indexOf(image));
        overlay.classList.add("lightbox-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-active");
        overlay.querySelector(".lightbox-close").focus();
    }

    function showRelativeImage(direction) {
        if (currentIndex < 0 || images.length < 2) {
            return;
        }

        const nextIndex = (currentIndex + direction + images.length) % images.length;
        showImage(nextIndex);
    }

    images.forEach((image) => {
        image.classList.add("lightbox-trigger");
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", `Expand image${image.alt ? `: ${image.alt}` : ""}`);

        image.addEventListener("click", () => openLightbox(image));
        image.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(image);
            }
        });
    });

    closeElements.forEach((element) => {
        element.addEventListener("click", closeLightbox);
    });

    prevButton.addEventListener("click", () => showRelativeImage(-1));
    nextButton.addEventListener("click", () => showRelativeImage(1));

    document.addEventListener("keydown", (event) => {
        if (!overlay.classList.contains("lightbox-open")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            showRelativeImage(-1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            showRelativeImage(1);
        }
    });
});
