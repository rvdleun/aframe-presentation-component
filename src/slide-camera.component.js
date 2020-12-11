AFRAME.registerSystem('slide-camera', {
    camera: null,
    cameraSlides: null,

    init: function() {
        this.setCamera('[camera]');
    },

    getAllCameraSlides: function() {
        this.cameraSlides = Array.from(document.querySelectorAll('[slide-camera]'));
    },

    setCamera: function(selector) {
        this.camera = document.querySelector(selector);
    },

    moveCamera: function(e, el, data) {
        const { camera } = this;
        const { direction, instant } = e.detail;

        if (this.cameraSlides === null) {
            this.getAllCameraSlides();
        }

        if (instant) {
            camera.setAttribute('position', el.getAttribute('position'));
            camera.setAttribute('rotation', el.getAttribute('rotation'));
        } else if (this.cameraSlides.length >= 1) {
            const curPos = el.getAttribute('position');
            const curRot = el.getAttribute('rotation');

            const currentIndex = this.cameraSlides.indexOf(el);
            const previousIndex = currentIndex + (-1 * direction);
            const prevEl = this.cameraSlides[previousIndex];
            const prevPos = prevEl.getAttribute('position');
            const prevRot = prevEl.getAttribute('rotation');

            const { duration, easing } = direction > 0 ? data : prevEl.components['slide-camera'].data;
            camera.setAttribute('animation__position', `property: position; dur: ${duration}; easing: ${easing}; from: ${prevPos.x} ${prevPos.y} ${prevPos.z}; to: ${curPos.x} ${curPos.y} ${curPos.z}`);
            camera.setAttribute('animation__rotation', `property: rotation; dur: ${duration}; easing: ${easing}; from: ${prevRot.x} ${prevRot.y} ${prevRot.z}; to: ${curRot.x} ${curRot.y} ${curRot.z}`);
        }
    }
});

AFRAME.registerComponent('slide-camera', {
    schema: {
        duration: { type: 'number', default: 1000 },
        easing: { type: 'string', default: 'linear' },
    },

    init: function() {
        this.el.addEventListener('a-presentation.slide-active', (e) => {
            if (e.detail.direction < 0) {
                return;
            }

            this.system.moveCamera(e, this.el, this.data);
        });

        this.el.addEventListener('a-presentation.slide-inactive', (e) => {
            if (e.detail.instant || e.detail.direction >= 0) {
                return;
            }

            const index = this.system.cameraSlides.indexOf(this.el);
            const previousCameraSlide = this.system.cameraSlides[index-1];
            if (!previousCameraSlide || previousCameraSlide === e.detail.currentSlide) {
                return;
            }

            this.system.moveCamera(e, previousCameraSlide, this.data);
        });
    }
});

AFRAME.registerPrimitive('a-slide-camera', {
    defaultComponents: {
        'slide-camera': {},
    },

    mappings: {
        'duration': 'slide-camera.duration',
        'easing': 'slide-camera.easing',
    }
});
