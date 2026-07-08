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
            <button class="lightbox-close" type="button" aria-label="Close image viewer" data-lightbox-close>&times;</button>
            <img class="lightbox-image" alt="">
        </div>
    `;

    document.body.appendChild(overlay);

    const dialogImage = overlay.querySelector(".lightbox-image");
    const closeElements = overlay.querySelectorAll("[data-lightbox-close]");
    let lastActiveElement = null;

    function closeLightbox() {
        overlay.classList.remove("lightbox-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-active");
        dialogImage.removeAttribute("src");

        if (lastActiveElement instanceof HTMLElement) {
            lastActiveElement.focus();
        }
    }

    function openLightbox(image) {
        lastActiveElement = document.activeElement;
        dialogImage.src = image.currentSrc || image.src;
        dialogImage.alt = image.alt || "";
        overlay.classList.add("lightbox-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-active");
        overlay.querySelector(".lightbox-close").focus();
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

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay.classList.contains("lightbox-open")) {
            closeLightbox();
        }
    });
});
