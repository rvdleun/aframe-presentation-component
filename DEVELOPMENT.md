# Development information

# Vision
[Reveal.js](https://revealjs.com), but in 3D, powered by AFrame.

I've been giving a number of talks in the past year and been using Reveal.js as my primary framework. While it takes a bit more effort to set things up, the fact that it's built with HTML/Javascript means that I can customize it entirely to my liking.

Every few months, I tend to completely revise my WebVR talk to keep it fresh for myself. After three revisions, I decided that I wanted to try something new and see if I could use AFrame to serve as a slidedeck. The `aframe-presentation-component` is its result.

## Getting started
Clone this repository locally:

``` bash
git clone https://github.com/rvdleun/aframe-presentation-component.git
```

Install dependencies:

``` bash
npm install
```

Then start the project

``` bash
npm start
```

You'll have access to the examples directory on `http://localhost:7000`, and it will autoreload any time something gets changed in the `src` directory.

## What can I contribute
This project is still in a fairly early stage and I would really like to ask people to start making talks with it and send in feedback.

In general, I also have issues with documentation. If you see any possibilities for improvement, let me know.

Other than that, I would also like to expand the slide-actions toolkit. At the time of writing, there is only `a-slide-animation`, `a-slide-camera` and `a-slide-visibility`. If you have an idea for one that could be easily reusable, then feel free to create [an issue](https://github.com/rvdleun/aframe-presentation-component/issues) or(even better) build it yourself and create [a pull request](https://github.com/rvdleun/aframe-presentation-component/pulls).

## Building a custom slide-action
The slide-action system was setup to ensure that developers can easily add their own custom features. This section will go into brief detail on how to create one in the repository...

* Create a new `slide-` file in the `src` directory.
* In the `init` function, setup listeners for `a-presentation.slide-active` and `a-presentation.slide-inactive`. These can be used to trigger your actions.
* Keep in mind that the user can also move backwards. When this happens, you will need to setup the triggers in reverse to avoid any potential timing issues.
* Register a primitive for your action. You can find examples in the other `slide-` files or read up about them in the [AFrame documentation](https://aframe.io/docs/0.9.0/introduction/html-and-primitives.html).
* If you want to add this slide-action to this repository, then add an example in the `examples` directory, and to the `overview.html` example.

### Things to discuss
Here are some things that are on my mind, and would like to hear more feedback about.

There will be an issue created for each of these in the repository to discuss.

#### Components vs Primitives
To make things as easy to understand and readable, I've wrapped all the components into primitives. However, the original setup I had was that the developer would need to attach a slide-action to every slide. Because the `slide` component fires off the events on itself as well, this is still possible.

So, for example, the [cameras example](examples/camera.html) can also be rewritten from...

```html
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
```
to...
```html
    <a-presentation>
        <a-slide slide-camera position="0 3 0"></a-slide>
        <a-slide slide-camera position="6 3 0"></a-slide>
        <a-slide slide-camera position="12 3 0"></a-slide>
        <a-slide slide-camera="duration: 2500" position="6 3 0" rotation="0 -180 0"></a-slide>
    </a-presentation>
```
To keep the documentation as concise as possible, I'm only using the first example. Do you think that the second approach could also be interesting to have in the documentation?

#### Increasing modularity
My goal is to make this toolkit as modular as possible, so that it could be used for multiple projects. At the moment, there are some things hardcoded in the presentation component, like...

* Hash tags for navigation
* Using keyboard shortcuts to move back and forth
* The progress bar

... and I'm wondering if it could be interesting to move these functionality into separate components instead. This way, it would be interesting to add more modular features to a presentation when needed.

With this in mind, this would mean that the following would change from...

```html
<a-presentation progress-bar="true" shortcuts="true" useHash="true">
  <a-slide></a-slide>
  <a-slide></a-slide>
  <a-slide></a-slide>
</a-presentation>
```

to...

```html
<a-presentation>
  <a-presentation-progress-bar></a-presentation-progress-bar>
  <a-presentation-shortcuts></a-presentation-shortcuts>
  <a-presentation-use-hash></a-presentation-use-hash>
  
  <a-slide></a-slide>
  <a-slide></a-slide>
  <a-slide></a-slide>
</a-presentation>
```

While I think this would be a neat thing to do to make it easier to add features, I'm also afraid that it can unnecessarily complicate things. Plus, it also means that these features will need to be added manually instead of being activated by default, which I think is great for newcomers.

