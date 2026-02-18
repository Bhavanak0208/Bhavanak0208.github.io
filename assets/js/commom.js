// Function to initialize or update ripples
function updateRipples() {
    try {
        const jQ = window.jQuery;
        if (typeof jQ !== 'undefined' && jQ.fn.ripples) {
            const $bg = jQ('#ripple-bg');
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

// Initialize everything
(function ($) {
    $(document).ready(function () {
        // Initial init
        updateRipples();

        // Initial config load
        loadConfig().then(config => {
            if (config) {
                if (config.nav) {
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
            }
            // Update ripples after any potential nav rendering
            updateRipples();
        });

        // Periodic updates for dynamic content/resizes
        $(window).on('resize', updateRipples);

        // Final fallback checks
        setTimeout(updateRipples, 200);
        setTimeout(updateRipples, 1000);
    });
})(window.jQuery);
