AFRAME.registerComponent('slide', {
    schema: { },

    init: function() {
        this.el.addEventListener('a-presentation.slide-active', this.onSlideActive.bind(this));
    },

    onSlideActive: function(e) {
        Array.from(this.el.children).forEach((child) => {
            child.dispatchEvent(new CustomEvent('a-presentation.slide-active', e));
        });
    }
});

AFRAME.registerPrimitive('a-slide', {
    defaultComponents: {
        'slide': {},
    },

    mappings: {}
});
