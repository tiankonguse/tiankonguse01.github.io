define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var messages = require('model/messages');

    // Load library/vendor modules using
    // full IDs, like:
    var print = require('view/print');

    print(messages.getHello());
});
