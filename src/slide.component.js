AFRAME.registerComponent('slide', {
    schema: { },

    init: function() {
        this.el.addEventListener('a-presentation.slide-active', this.passEventToChildren.bind(this));
        this.el.addEventListener('a-presentation.slide-inactive', this.passEventToChildren.bind(this));
    },

    passEventToChildren: function(e) {
        console.log(e);
        Array.from(this.el.children).forEach((child) => {
            child.dispatchEvent(new CustomEvent(e.type, e));
        });
    }
});

AFRAME.registerPrimitive('a-slide', {
    defaultComponents: {
        'slide': {},
    },

    mappings: {}
});
