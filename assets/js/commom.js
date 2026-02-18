// Common functionality for all pages

async function loadConfig() {
    try {
        const response = await fetch('data/config.yaml');
        const yamlText = await response.text();
        const config = jsyaml.load(yamlText);
        return config;
    } catch (error) {
        console.error('Error loading config:', error);
        return null;
    }
}

async function renderNavbar(config) {
    if (!config || !config.nav) return;

    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    // Clear existing static nav if any (though we will likely empty it in HTML)
    navContainer.innerHTML = '';

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    config.nav.forEach(item => {
        const link = document.createElement('a');
        link.href = item.link;
        link.className = 'nav-link';
        link.textContent = item.label;

        // Highlight active link
        if (item.link === currentPath) {
            // You could add an 'active' class here if you have styles for it
            // link.classList.add('active');
        }

        navContainer.appendChild(link);
    });
}

function updatePageTitle(config) {
    if (!config) return;

    // Optional: Dynamic title update
    // const currentTitle = document.title;
    // if (currentTitle.includes('Aniket Junghare')) return; // Already set manually

    // document.title = `${config.name} - ${config.role}`;
}

// Function to initialize or update ripples
function updateRipples() {
    if (typeof $ !== 'undefined' && $.fn.ripples) {
        const $bg = $('#ripple-bg');
        if ($bg.length) {
            if (!$bg.data('ripples')) {
                // Initialize if not already done
                $bg.ripples({
                    resolution: 512,
                    dropRadius: 15,
                    perturbance: 0.04,
                    interactive: true
                });
            } else {
                // Update size if already initialized
                $bg.ripples('updateSize');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initial ripple setup
    updateRipples();

    const config = await loadConfig();
    if (config) {
        renderNavbar(config);
        updatePageTitle(config);
    }

    // Final ripple update after a short delay to account for layout shifts
    setTimeout(updateRipples, 100);
});
