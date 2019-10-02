AFRAME.registerSystem('slide-visibility', {
    setVisibility: function(selector, visible) {
        const elements = [].slice.call(document.querySelectorAll(selector));
        elements.forEach((element) => {
            element.setAttribute('visible', visible);
        });
    }
});

AFRAME.registerComponent('slide-visibility', {
    schema: {
        selector: { type: 'string' },
        visibility: { type: 'boolean' },
    },

    init: function() {
        const { selector, visibility } = this.data;

        this.el.addEventListener('a-presentation.slide-active', () => {
            this.system.setVisibility(selector, visibility);
        });

        this.el.addEventListener('a-presentation.slide-inactive', (e) => {
            const { direction } = e.detail;

            if (direction >= 0) {
                return;
            }

            this.system.setVisibility(selector, !visibility);
        });
    }
});

AFRAME.registerPrimitive('a-slide-visibility', {
    defaultComponents: {
        'slide-visibility': {},
    },

    mappings: {
        'selector': 'slide-visibility.selector',
        'visibility': 'slide-visibility.visibility',
    }
});
