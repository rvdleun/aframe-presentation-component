AFRAME.registerComponent('presentation', {
    schema: {
        shortcuts: { type: 'boolean', default: true },
        useHash: { type: 'boolean', default: true },
    },

    currentSlide: 0,
    slides: [],

    init: function() {
        this.slides = this.el.querySelectorAll('[slide]');

        if (this.data.shortcuts) {
            document.addEventListener('keyup', (e) => this._onKey(e));
        }

        setTimeout(() => {
            const slide = this.data.useHash && window.location.hash ? window.location.hash.substring(1) : 0;

            this.changeSlide(0, true);
            for (let i = 0; i < slide; i++) {
                this.changeSlide(1, true);
            }
        });
    },

    changeSlide: function(direction, instant) {
        const previousSlide = this.slides[this.currentSlide];
        this.currentSlide = Math.max(0, Math.min(this.slides.length - 1, this.currentSlide + direction));
        const currentSlide = this.slides[this.currentSlide];

        if (previousSlide === currentSlide && !instant) {
            return;
        }

        if (this.data.useHash) {
            window.location.hash = this.currentSlide.toString();
        }

        const detail = {
            currentSlide,
            direction,
            instant,
            previousSlide,
        };
        previousSlide.dispatchEvent(new CustomEvent('a-presentation.slide-inactive', { detail }));
        currentSlide.dispatchEvent(new CustomEvent('a-presentation.slide-active', { detail }));
    },

    previousSlide: function() {
        if (this.currentSlide === 0) {
            return;
        }

        this.changeSlide(-1);
    },

    nextSlide: function() {
        if (this.currentSlide === this.slides.length - 1) {
            return;
        }

        this.changeSlide(1);
    },

    _onKey: function(event) {
        switch(event.code) {
            case 'ArrowLeft':
                this.previousSlide();
                break;

            case 'ArrowRight':
                this.nextSlide();
                break;
        }
    }
});

AFRAME.registerPrimitive('a-presentation', {
    defaultComponents: {
        'presentation': {},
    },

    mappings: {
        'camera': 'presentation.camera',
        'keyboard-shortcuts': 'presentation.keyboardShortcuts',
        'use-hash': 'presentation.useHash',
    }
});
