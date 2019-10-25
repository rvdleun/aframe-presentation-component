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
