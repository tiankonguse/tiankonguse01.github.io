// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: '../lib',
    paths: {
        view: '../view',
        app: '../app',
        model: '../model',
        controller: '../controller'
    }
});

