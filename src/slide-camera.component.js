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
    }
});

AFRAME.registerComponent('slide-camera', {
    schema: {
        duration: { type: 'number', default: 1000 },
    },

    init: function() {
        this.el.addEventListener('a-presentation.slide-active', (e) => {
            const { camera } = this.system;
            const { direction, instant } = e.detail;

            if (this.system.cameraSlides === null) {
                this.system.getAllCameraSlides();
            }

            if (instant) {
                camera.setAttribute('position', this.el.getAttribute('position'));
                camera.setAttribute('rotation', this.el.getAttribute('rotation'));
            } else {
                const curPos = this.el.getAttribute('position');
                const curRot = this.el.getAttribute('rotation');

                const currentIndex = this.system.cameraSlides.indexOf(this.el);
                const previousIndex = currentIndex + (-1 * direction);
                const prevEl = this.system.cameraSlides[previousIndex];
                const prevPos = prevEl.getAttribute('position');
                const prevRot = prevEl.getAttribute('rotation');

                const { duration } = this.direction > 0 ? this.data : prevEl.components['slide-camera'].data;

                camera.setAttribute('animation__position', `property: position; dur: ${duration}; easing: linear; from: ${prevPos.x} ${prevPos.y} ${prevPos.z}; to: ${curPos.x} ${curPos.y} ${curPos.z}`);
                camera.setAttribute('animation__rotation', `property: rotation; dur: ${duration}; easing: linear; from: ${prevRot.x} ${prevRot.y} ${prevRot.z}; to: ${curRot.x} ${curRot.y} ${curRot.z}`);
            }
        });
    }
});

AFRAME.registerPrimitive('a-slide-camera', {
    defaultComponents: {
        'slide-camera': {},
    },

    mappings: {
        'duration': 'slide-camera.duration',
    }
});
