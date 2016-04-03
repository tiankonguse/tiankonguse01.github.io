//Load common code that includes config, then load the app logic for this page.
requirejs(['./common_requirejs'], function (common) {
    requirejs(['./app/map']);
});
