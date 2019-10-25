/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

            const { duration } = direction > 0 ? data : prevEl.components['slide-camera'].data;
            camera.setAttribute('animation__position', `property: position; dur: ${duration}; easing: linear; from: ${prevPos.x} ${prevPos.y} ${prevPos.z}; to: ${curPos.x} ${curPos.y} ${curPos.z}`);
            camera.setAttribute('animation__rotation', `property: rotation; dur: ${duration}; easing: linear; from: ${prevRot.x} ${prevRot.y} ${prevRot.z}; to: ${curRot.x} ${curRot.y} ${curRot.z}`);
        }
    }
});

AFRAME.registerComponent('slide-camera', {
    schema: {
        duration: { type: 'number', default: 1000 },
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
    }
});


/***/ }),
/* 2 */
/***/ (function(module, exports) {

AFRAME.registerSystem('slide-animation', {
    timeouts: [],

    init: function() {
        setTimeout(() => {
            const presentation = document.querySelector('[presentation]');
            if (!presentation) {
                return;
            }

            presentation.addEventListener('a-presentation.slide-change', () => {
                while(this.timeouts.length > 0) {
                    const timeout = this.timeouts.pop();
                    clearTimeout(timeout);
                }
            });
        });
    },

    playAnimation: function(selector, animations, action) {
        if (!selector || animations.length === 0) {
            return;
        }

        const elements = [].slice.call(document.querySelectorAll(selector));
        elements.forEach((element) => {
            animations.forEach((animation) => {
                const component = element.components[`animation__${animation}`];
                if (!component) {
                    return;
                }

                switch(action) {
                    case 'from':
                    case 'to':
                        component.pauseAnimation();

                        const property = component.data.property;
                        const to = component.data[action];

                        element.setAttribute(property, to);
                        break;

                    case 'prev':
                        element.setAttribute(`animation__${animation}`, 'dir', 'reverse');
                        component.beginAnimation();
                        break;

                    case 'play':
                        element.setAttribute(`animation__${animation}`, 'dir', '');

                        if (component.data.delay) {
                            this.playAnimation(selector, animations, 'from');
                            this.timeouts.push(setTimeout(() => component.beginAnimation(), component.data.delay));
                        } else {
                            component.beginAnimation();
                        }
                        break;
                }
            });
        });
    },
});

AFRAME.registerComponent('slide-animation', {
    schema: {
        animations: { type: 'array' },
        selector: { type: 'string' },
    },

    init: function() {
        this.el.addEventListener('a-presentation.slide-active', (e) => {
            const { direction, instant } = e.detail;

            const { animations, selector } = this.data;

            if (instant) {
                this.system.playAnimation(selector, animations, 'to');
            } else if(direction > 0) {
                this.system.playAnimation(selector, animations, 'play');
            }
        });

        this.el.addEventListener('a-presentation.slide-inactive', (e) => {
            const { direction } = e.detail;
            const { animations, selector } = this.data;

            this.system.playAnimation(selector, animations, direction < 0 ? 'from' : 'to');
        });
    }
});

AFRAME.registerPrimitive('a-slide-animation', {
    defaultComponents: {
        'slide-animation': {},
    },

    mappings: {
        'animations': 'slide-animation.animations',
        'selector': 'slide-animation.selector',
    }
});


/***/ }),
/* 3 */
/***/ (function(module, exports) {

AFRAME.registerComponent('slide', {
    schema: { },

    init: function() {
        this.el.addEventListener('a-presentation.slide-active', this.passEventToChildren.bind(this));
        this.el.addEventListener('a-presentation.slide-inactive', this.passEventToChildren.bind(this));
    },

    passEventToChildren: function(e) {
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


/***/ }),
/* 4 */
/***/ (function(module, exports) {

AFRAME.registerComponent('presentation', {
    schema: {
        aspectRatio: { type: 'string', default: null },
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

        if (this.data.aspectRatio) {
            this.setupAspectRatio();
        }

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

    setupAspectRatio: function() {
        const data = this.data.aspectRatio.split(':');
        if (data.length !== 2) {
            console.warn('The aspect ratio must be defined as follows: width:height. Example: "16:9"');
            return;
        }

        const sceneEl = this.el.sceneEl;
        if (!sceneEl.hasAttribute('embedded')) {
            sceneEl.setAttribute('embedded', '');
        }

        const width = parseInt(data[0]);
        const height = parseInt(data[1]);
        const updateCanvas = function() {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let canvasWidth, canvasHeight;

            if (width > height) {
                canvasWidth = windowWidth;
                canvasHeight = canvasWidth * (height / width);
            } else {
                canvasHeight = windowHeight;
                canvasWidth = canvasHeight * (width / height);
            }

            const top = (windowHeight - canvasHeight) / 2;
            const left = (windowWidth - canvasWidth) / 2;

            sceneEl.setAttribute('style', `position: fixed; top: ${top}px; left: ${left}px; width: ${canvasWidth}px; height: ${canvasHeight}px`);
        };

        window.addEventListener('resize', () => updateCanvas());
        updateCanvas();
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
        'aspect-ratio': 'presentation.aspectRatio',
        'progress-bar': 'presentation.progressBar',
        'shortcuts': 'presentation.shortcuts',
        'use-hash': 'presentation.useHash',
    }
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
__webpack_require__(3);
__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(0);


/***/ })
/******/ ]);