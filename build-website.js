//Load the library and specify options
const replace = require('replace-in-file');
const options = {
    files: 'examples/*.html',
    from: '<script src="./aframe-presentation-component.min.js"></script>',
    to: '<script src="https://unpkg.com/aframe-presentation-component/dist/aframe-presentation-component.min.js"></script>',
};

try {
    const results = replace.sync(options);
    console.log('Replacement results:', results);
}
catch (error) {
    console.error('Error occurred:', error);
}
