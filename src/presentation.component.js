AFRAME.registerComponent('presentation', {
    schema: {
        progressBar: { type: 'boolean', default: true },
        shortcuts: { type: 'boolean', default: true },
        useHash: { type: 'boolean', default: true },
    },

    currentSlide: 0,
    progressBar: null,
    slides: [],
    swipeSession: { start: null, direction: null },

    init: function() {
        this.slides = this.el.querySelectorAll('[slide]');

        if (this.data.progressBar) {
            const progressBar = document.createElement('div');
            progressBar.setAttribute('id', 'aframe-presentation-progress-bar');
            progressBar.style.position = 'fixed';
            progressBar.style.bottom = '0';
            progressBar.style.left = '0';
            progressBar.style.height = '5px';
            progressBar.style.width = '0';
            progressBar.style.backgroundColor = 'white';
            progressBar.style.transition = '.5s width';

            document.body.append(progressBar);
            this.progressBar = progressBar;
        }

        if (this.data.shortcuts) {
            document.addEventListener('keyup', (e) => this._onKey(e));
            document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
            document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
            document.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
        }

        setTimeout(() => {
            const slide = this.data.useHash && window.location.hash ? window.location.hash.substring(1) : 0;

            this.changeSlide(0, true);
            for (let i = 0; i < slide; i++) {
                this.changeSlide(1, true);
            }
        });
    },

    handleTouchStart(event) {
        this.swipeSession.start = event.touches[0].clientX
    },

    handleTouchMove(event) {
        if (this.swipeSession.start === null) return

        const end = event.touches[0].clientX
        const diff = this.swipeSession.start - end

        this.swipeSession.direction = diff > 0
            ? 'left' : 'right'
    },

    handleTouchEnd() {
        switch (this.swipeSession.direction) {
            case 'left':
                this.nextSlide()
                break;
            case 'right':
                this.previousSlide()
                break;
        }

        this.swipeSession.start = null
        this.swipeSession.direction = null
    },

    changeSlide: function(direction, instant) {
        const previousSlide = this.slides[this.currentSlide];
        this.currentSlide = Math.max(0, Math.min(this.slides.length - 1, this.currentSlide + direction));
        const currentSlide = this.slides[this.currentSlide];

        if (previousSlide === currentSlide && !instant) {
            return;
        }

        if (this.data.progressBar) {
            this.progressBar.style.width = `${100 * ((this.currentSlide + 1)/ this.slides.length)}vw`;
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

        this.el.dispatchEvent(new CustomEvent('a-presentation.slide-change', { detail }));
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
        'progress-bar': 'presentation.progressBar',
        'shortcuts': 'presentation.shortcuts',
        'use-hash': 'presentation.useHash',
    }
});
