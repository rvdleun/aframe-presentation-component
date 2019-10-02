# AFrame Presentation Component
This presentation component will let you setup an AFrame scene to work like a slidedeck. By using the presentation and slide components, you can move the camera and trigger animations when moving back and forth through the slides.

## Example
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Example project</title>
    <meta name="description" content="Example project">

    <script src="https://aframe.io/releases/0.9.2/aframe.min.js"></script>
    <script src="./aframe-presentation-component.min.js"></script>
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

## Component
### Presentation
