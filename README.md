# AFrame Presentation Component
This presentation component will let you setup an AFrame scene to work like a slidedeck. By using the presentation and slide components, you can move the camera and trigger animations when moving back and forth through the slides.

Note: This documentation will only cover the primitives that are needed to setup the presentation. If you're interested in learning more about the components running them and an alternate way to setup a presentation via `<a-entity>` elements instead, please read the [DEVELOPMENT.md](development.md) file.

## Example
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Example project</title>
    <meta name="description" content="Example project">

    <script src="https://aframe.io/releases/0.9.2/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-presentation-component/dist/aframe-presentation-component.min.js"></script>
  </head>
  <body>
    <a-scene vr-mode-ui="enabled: false">
      <a-box color="red" position="0 3 -3">
        <a-text position="0 -1 0" align="center" value="Box"></a-text>
      </a-box>

      <a-sphere color="blue" position="6 3 -3" scale=".75 .75 .75">
        <a-text position="0 -1.333 0" scale="1.333 1.333 1.333" align="center" value="Sphere"></a-text>
      </a-sphere>

      <a-triangle color="green" position="12 3 -3">
        <a-text position="0 -1 0" align="center" value="Triangle"></a-text>
      </a-triangle>

      <a-cylinder color="gray" position="6 3 3">
        <a-text position="0 -1 0" rotation="0 -180 0" align="center" value="Cylinder"></a-text>
      </a-cylinder>

      <a-entity position="0 3 0" camera>
        <a-text position="0 1.5 -3" align="center" value="Press <- and -> to move back and forth"></a-text>
      </a-entity>

      <a-presentation>
        <a-slide>
          <a-slide-camera position="0 3 0"></a-slide-camera>
        </a-slide>
        <a-slide>
          <a-slide-camera position="6 3 0"></a-slide-camera>
        </a-slide>
        <a-slide>
          <a-slide-camera position="12 3 0"></a-slide-camera>
        </a-slide>
        <a-slide>
          <a-slide-camera position="6 3 0" rotation="0 -180 0" duration="2500"></a-slide-camera>
        </a-slide>
      </a-presentation>
    </a-scene>
  </body>
</html>
```

## Setup
After setting up your AFrame scene, first setup an entity with only a camera element.

```html
<a-entity camera></a-entity>
```

Then add a `<a-presentation>` element.

```html
<a-entity camera></a-entity>

<a-presentation>
</a-presentation>
```

Next, add an `<a-slide>` element for every slide you need.

```html
<a-entity camera></a-entity>

<a-presentation>
  <a-slide>
  </a-slide>
  <a-slide>
  </a-slide>
  <a-slide>
  </a-slide>
</a-presentation>
```

Finally, you can add actions to every `a-slide` to indicate what actions should be triggered once you get to that slide. This could mean moving the camera, triggering animations or making entities appear or disappear.

```html
<a-entity camera></a-entity>

<a-presentation>
  <a-slide>
    <a-slide-camera position="0 3 0"></a-slide-camera>
  </a-slide>
    <a-slide-camera position="2 3 0"></a-slide-camera>
    <a-slide-visibility selector="#background" visibility="false"></a-slide-visibility>
  <a-slide>
    <a-slide-visibility selector="#hello" visibility="true"></a-slide-visibility>
  </a-slide>
  <a-slide>
    <a-slide-camera position="10 20 10" rotation="0 -180 0" duration="3000"></a-slide-camera>
    <a-slide-animation selector="#model" animations="appear,position,rotation"></a-slide-animation>
  </a-slide>
</a-presentation>
```

To get a full idea of every element, read on...

## Primitives

### a-presentation

```html
<a-presentation progress-bar="true" shortcuts="false" use-hash="true"></a-presentation>
```

#### Description
The `a-presentation` primitive contains all elements makes up the slide deck.

#### Parameters

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| **progress-bar** | true | Adds a progress bar to the bottom of the document that will update every time you change slides. If you want to style it, the `div` element gets an id named `aframe-presentation-progress-bar`.
| **shortcuts** | true | Whether the user can move back and forth through the slides by using the arrow keys on the keyboard or by swiping the screen (for touch device).
| **use-hash** | true | Will use the URL's hash to store the current slide and move to that slide when the user enters the page.

#### Events

Whenever the user changes slides, events are fired off on the presentation primitive, the new slide and the previous slide. Each event gets the following details...

| Key | Description |
| --- | ----------- |
| **currentSlide** | The `a-slide` that is getting activated. |
| **direction** | In which direction the user moved. -1 if the user went to a previous slide, 1 if to the next. |
| **instant** | If the slide-action should move to the end. | 
| **previousSlide** | The previous slide that was active |

##### a-presentation.slide-change
The `a-presentation.slide-change` is fired on the `a-presentation` element whenever a slide changes.

##### a-presentation.slide-inactive
Is fired on the previous active `a-slide`.

##### a-presentation.slide-active
Is fired on the current active `a-slide`.

### a-slide
```html
<a-slide></a-slide>
```

#### Description
The `a-slide` is a container for all slide actions. It will pass all events to its children.

## Slide actions

### a-slide-animation
```html
<a-gltf-model 
    id="phone"
    src="#phone-gltf"
    animation__position="property: position; from: 0 0 0; to: 0 0 3; autoplay: false"
    animation__rotation="property: position; from: 360 720 0; to: 0 0 3; autoplay: false"
    animation__scale="property: scale; from: 0.25 0.25 0.25; to: 3 3 3; autoplay: false"
></a-gltf-model>

...

<a-slide-animation selector="#phone" animations="position,rotation,scale"></a-slide>
```

#### Description
The `a-slide-animation` will automatically trigger AFrame [animations](https://aframe.io/docs/0.9.0/components/animation.html) to play. 

Note: Each animation should have its own [namespace](https://aframe.io/docs/0.9.0/components/animation.html#multiple-animations), and `autoplay` should be set to `false`. There is also no proper support yet for looping animations.

#### Parameters
| Parameter | Default | Description |
| --------- | ------- | ----------- |
| animations | [] | Which animation namespaces need to be trigger. |
| selector |  | What [selector](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors) is used to find all elements with animations to trigger. |

### a-slide-camera
```html
<a-slide-camera position="1 2 0" rotation="90 180 0"></a-slide-camera>
```
The `a-slide-camera` will move the camera to a new position.

#### Parameters
| Parameter | Default | Description |
| --------- | ------- | ----------- |
| duration | 1000 | How long the animation will last in miliseconds |
| position | 0 0 0 | The new position |
| rotation | 0 0 0 | The new rotation |

### a-slide-visibility
```html
<a-box id="red-box"></a-box>

...

<a-slide-visibility selector="red-box" visibility="true"></a-slide-visibility>
```

#### Description
The `a-slide-visibility` will change an entity's visibility by changing its `visible` attribute.

Note: When moving back one slide, the entities' visibility will be set to the opposite value.

#### Parameters
| Parameter | Default | Description |
| --------- | ------- | ----------- |
| selector |  | What [selector](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors) is used to find all elements whose visibility needs to be changed. |
| visibility | false | Whether the entity should become visibile or not |


## Creating your own slide action
By making use of the `a-presentation.slide-inactive` and `a-presentation.slide-active` events, it is possible to create your own custom actions that can be easily reused per slide.

As seen in the `examples/overview.html`, here is an action that will change an [aframe-environment](https://github.com/supermedium/aframe-environment-component) whenever a slide becomes active.

```javascript
AFRAME.registerComponent('slide-environment', {
    schema: {
        settings: { type: 'string', default: 'preset: default' },
    },

    init: function() {
        this.el.addEventListener('a-presentation.slide-active', () => {
            const { settings } = this.data;

            if (this.el.sceneEl.getAttribute('environment') === settings) {
                return;
            }

            const elements = [].slice.call(document.querySelectorAll('.environment'));
            elements.forEach((element) => {
                element.parentNode.removeChild(element);
            });

            this.el.sceneEl.removeAttribute('environment');
            this.el.sceneEl.setAttribute('environment', settings);
        });
    }
});

AFRAME.registerPrimitive('a-slide-environment', {
    defaultComponents: {
        'slide-environment': {},
    },

    mappings: {
        'settings': 'slide-environment.settings',
    }
});
```

Which can then be followed as follows...

```html
<a-slide>
  <a-slide-environment settings="preset: tron"></a-slide-environment>
</a-slide>
```

If you've created a slide-action that you think could be easily reusable, then feel free to [create a pull request](https://github.com/rvdleun/aframe-presentation-component/pulls).
