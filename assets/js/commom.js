// Function to initialize or update ripples
function updateRipples() {
    try {
        if (typeof jQuery !== 'undefined' && jQuery.fn.ripples) {
            const $bg = jQuery('#ripple-bg');
            if ($bg.length) {
                if (!$bg.data('ripples')) {
                    $bg.ripples({
                        resolution: 512,
                        dropRadius: 20,
                        perturbance: 0.04,
                        interactive: true
                    });
                } else {
                    $bg.ripples('updateSize');
                }
            }
        }
    } catch (e) {
        console.warn('Ripples update failed:', e);
    }
}

// Config loading
async function loadConfig() {
    try {
        const response = await fetch('data/config.yaml');
        if (!response.ok) return null;
        const yamlText = await response.text();
        return jsyaml.load(yamlText);
    } catch (e) {
        return null;
    }
}

// Initialize everything on DOM ready
jQuery(function ($) {
    // Initial init
    updateRipples();

    // Initial config load
    loadConfig().then(config => {
        if (config && config.nav) {
            const navContainer = $('.nav-container');
            if (navContainer.length) {
                navContainer.empty();
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                config.nav.forEach(item => {
                    $('<a>')
                        .attr('href', item.link)
                        .addClass('nav-link')
                        .toggleClass('active', item.link === currentPath)
                        .text(item.label)
                        .appendTo(navContainer);
                });
            }
        }
        // Update ripples after potential nav rendering
        updateRipples();
    });

    // Event listeners
    $(window).on('resize', updateRipples);

    // Fallback checks
    setTimeout(updateRipples, 250);
    setTimeout(updateRipples, 1000);
});
